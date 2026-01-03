'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './input';
import { Label } from './label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Badge } from './badge';
import {
  getUserAttributes,
  updateMultipleUserAttributes,
  confirmUserAttributeUpdate,
  sendUserAttributeVerification,
  deleteUserAttributesByKeys,
  UserAttributes,
  UpdateUserAttributesResult,
  type VerifiableUserAttributeKey,
  type UserAttributeKey
} from '../lib/useAuth';

interface UserProfileProps {
  onClose?: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const [userAttributes, setUserAttributes] = useState<UserAttributes>({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [pendingConfirmation, setPendingConfirmation] = useState<{
    attributeKey: string;
    deliveryDetails?: { deliveryMedium: string; destination: string };
  } | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedAttributes, setEditedAttributes] = useState<Partial<UserAttributes>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadUserAttributes();
  }, []);

  const loadUserAttributes = async () => {
    try {
      setLoading(true);
      const attributes = await getUserAttributes();
      setUserAttributes(attributes);
      setEditedAttributes(attributes);
    } catch (err) {
      setError('Failed to load user attributes');
      console.error('Error loading user attributes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMultipleAttributes = async () => {
    try {
      setUpdating(true);
      setError(null);
      const attributesToUpdate: Record<string, string> = {};

      Object.entries(editedAttributes).forEach(([key, value]) => {
        if (value !== userAttributes[key as keyof UserAttributes]) {
          attributesToUpdate[key] = value || '';
        }
      });

      if (Object.keys(attributesToUpdate).length === 0) {
        setError('No changes to update');
        return;
      }

      const result: UpdateUserAttributesResult = await updateMultipleUserAttributes(attributesToUpdate);

      const needsConfirmation = Object.values(result).some(
        (attrResult) => attrResult.nextStep.updateAttributeStep === 'CONFIRM_ATTRIBUTE_WITH_CODE'
      );

      if (needsConfirmation) {
        setSuccess('Some attributes require confirmation. Check your email/phone for verification codes.');
      } else {
        setSuccess('All attributes updated successfully');
      }

      await loadUserAttributes();
      setEditMode(false);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to update attributes');
    } finally {
      setUpdating(false);
    }
  };

  const handleConfirmAttribute = async () => {
    if (!pendingConfirmation || !confirmationCode) return;

    try {
      setUpdating(true);
      setError(null);
      await confirmUserAttributeUpdate(pendingConfirmation.attributeKey as VerifiableUserAttributeKey, confirmationCode);
      setSuccess('Attribute confirmed successfully');
      setPendingConfirmation(null);
      setConfirmationCode('');
      await loadUserAttributes();
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to confirm attribute');
    } finally {
      setUpdating(false);
    }
  };

  const handleSendVerification = async (attributeKey: string) => {
    try {
      setUpdating(true);
      setError(null);
      await sendUserAttributeVerification(attributeKey as VerifiableUserAttributeKey);
      setSuccess('Verification code sent');
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to send verification code');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAttribute = async (attributeKey: string) => {
    if (!confirm(`Are you sure you want to delete the ${attributeKey} attribute?`)) return;

    try {
      setUpdating(true);
      setError(null);
      await deleteUserAttributesByKeys([attributeKey as UserAttributeKey]);
      setSuccess('Attribute deleted successfully');
      await loadUserAttributes();
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Failed to delete attribute');
    } finally {
      setUpdating(false);
    }
  };

  const handleAttributeChange = (key: string, value: string) => {
    setEditedAttributes(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const renderAttributeField = (key: string, value: string | undefined, isEditable: boolean = true) => {
    const isCustom = key.startsWith('custom:');
    const displayKey = isCustom ? key.replace('custom:', '') : key;

    return (
      <div key={key} className="space-y-2">
        <Label htmlFor={key} className="text-sm font-medium">
          {displayKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          {isCustom && <Badge variant="secondary" className="ml-2">Custom</Badge>}
        </Label>
        {editMode && isEditable ? (
          <Input
            id={key}
            value={editedAttributes[key] || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAttributeChange(key, e.target.value)}
            placeholder={`Enter ${displayKey}`}
          />
        ) : (
          <div className="p-2 bg-muted rounded-md">
            {value || <span className="text-muted-foreground">Not set</span>}
          </div>
        )}
        {!editMode && value && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleSendVerification(key)}
              disabled={updating}
            >
              Send Verification
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDeleteAttribute(key)}
              disabled={updating}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Delete
            </Button>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">Loading user profile...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
        <CardDescription>Manage your account attributes and preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-800 text-sm">
            {success}
          </div>
        )}

        <Tabs defaultValue="view" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="view">View Profile</TabsTrigger>
            <TabsTrigger value="edit">Edit Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="view" className="space-y-4">
            <div className="grid gap-4">
              {Object.entries(userAttributes).map(([key, value]) =>
                renderAttributeField(key, value, false)
              )}
            </div>
          </TabsContent>

          <TabsContent value="edit" className="space-y-4">
            <div className="grid gap-4">
              {Object.keys(userAttributes).map((key) =>
                renderAttributeField(key, editedAttributes[key], true)
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleUpdateMultipleAttributes}
                disabled={updating}
                className="flex-1"
              >
                {updating ? 'Updating...' : 'Update All Changes'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditedAttributes(userAttributes);
                  setEditMode(false);
                }}
                disabled={updating}
              >
                Cancel
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {pendingConfirmation && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-800">Confirm Attribute Update</CardTitle>
              <CardDescription className="text-orange-700">
                A verification code was sent to {pendingConfirmation.deliveryDetails?.deliveryMedium} at{' '}
                {pendingConfirmation.deliveryDetails?.destination}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="confirmation-code">Confirmation Code</Label>
                <Input
                  id="confirmation-code"
                  value={confirmationCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmationCode(e.target.value)}
                  placeholder="Enter verification code"
                />
              </div>
              <Button
                onClick={handleConfirmAttribute}
                disabled={updating || !confirmationCode}
                className="w-full"
              >
                {updating ? 'Confirming...' : 'Confirm Update'}
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end pt-4">
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};