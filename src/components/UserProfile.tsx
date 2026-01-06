'use client';

import React, { useState, useEffect } from 'react';

import { Badge } from './badge';
import { Input } from './input';
import { Label } from './label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Button } from './ui/button';
import {
  getUserAttributes,
  updateMultipleUserAttributes,
  confirmUserAttributeUpdate,
  sendUserAttributeVerification,
  deleteUserAttributesByKeys,
  type UserAttributes,
  type UpdateUserAttributesResult,
  type VerifiableUserAttributeKey,
  type UserAttributeKey,
} from '../lib/useAuth';

interface UserProfileProps {
  _onClose?: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ _onClose }) => {
  const [userAttributes, setUserAttributes] = useState<UserAttributes>({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [pendingConfirmation, setPendingConfirmation] = useState<{
    attributeKey: string;
    deliveryDetails?: { deliveryMedium: string; destination: string };
  } | null>(null);
  const [_editMode, setEditMode] = useState(false);
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

      const result: UpdateUserAttributesResult =
        await updateMultipleUserAttributes(attributesToUpdate);

      const needsConfirmation = Object.values(result).some(
        (attrResult) => attrResult.nextStep.updateAttributeStep === 'CONFIRM_ATTRIBUTE_WITH_CODE'
      );

      if (needsConfirmation) {
        setSuccess(
          'Some attributes require confirmation. Check your email/phone for verification codes.'
        );
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
      await confirmUserAttributeUpdate(
        pendingConfirmation.attributeKey as VerifiableUserAttributeKey,
        confirmationCode
      );
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
    setEditedAttributes((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="space-y-4 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Profile Header */}
      <div className="space-y-2 border-b border-border/50 pb-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
          <svg
            className="h-8 w-8 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-foreground">User Profile</h2>
        <p className="text-muted-foreground">Manage your account attributes and preferences</p>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          <svg
            className="h-5 w-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200">
          <svg
            className="h-5 w-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {success}
        </div>
      )}

      {/* Main Content */}
      <div className="overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm">
        <Tabs defaultValue="view" className="w-full">
          <div className="px-6 pt-6">
            <TabsList className="grid w-full grid-cols-2 rounded-lg bg-muted/50 p-1">
              <TabsTrigger
                value="view"
                className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                View Profile
              </TabsTrigger>
              <TabsTrigger
                value="edit"
                className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Profile
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="view" className="px-6 pb-6">
            <div className="grid gap-6 pt-6">
              {Object.entries(userAttributes).map(([key, value]) => {
                const isCustom = key.startsWith('custom:');
                const displayKey = isCustom ? key.replace('custom:', '') : key;
                const formattedKey = displayKey
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, (l) => l.toUpperCase());

                return (
                  <div
                    key={key}
                    className="group rounded-lg border border-border/50 p-4 transition-all duration-200 hover:border-border hover:shadow-sm"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{formattedKey}</span>
                        {isCustom && (
                          <Badge variant="secondary" className="text-xs">
                            Custom
                          </Badge>
                        )}
                      </div>
                      {value && (
                        <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            onClick={() => handleSendVerification(key)}
                            disabled={updating}
                            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                            title="Send verification"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteAttribute(key)}
                            disabled={updating}
                            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                            title="Delete attribute"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="rounded-md bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                      {value || <span className="italic">Not set</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="edit" className="px-6 pb-6">
            <div className="grid gap-6 pt-6">
              {Object.keys(userAttributes).map((key) => {
                const isCustom = key.startsWith('custom:');
                const displayKey = isCustom ? key.replace('custom:', '') : key;
                const formattedKey = displayKey
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, (l) => l.toUpperCase());

                return (
                  <div
                    key={key}
                    className="space-y-3 rounded-lg border border-border/50 bg-muted/20 p-4"
                  >
                    <div className="flex items-center gap-2">
                      <Label htmlFor={key} className="text-sm font-medium text-foreground">
                        {formattedKey}
                      </Label>
                      {isCustom && (
                        <Badge variant="secondary" className="text-xs">
                          Custom
                        </Badge>
                      )}
                    </div>
                    <Input
                      id={key}
                      value={editedAttributes[key] || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleAttributeChange(key, e.target.value)
                      }
                      placeholder={`Enter ${formattedKey.toLowerCase()}`}
                      className="bg-background"
                    />
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex gap-3 border-t border-border/50 pt-6">
              <Button
                onClick={handleUpdateMultipleAttributes}
                disabled={updating}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {updating ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                    Updating...
                  </>
                ) : (
                  <>
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Update All Changes
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditedAttributes(userAttributes);
                  setEditMode(false);
                }}
                disabled={updating}
                className="px-6"
              >
                Cancel
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Confirmation Dialog */}
      {pendingConfirmation && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-900/20">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40">
              <svg
                className="h-5 w-5 text-amber-600 dark:text-amber-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="font-semibold text-amber-800 dark:text-amber-200">
                  Confirm Attribute Update
                </h3>
                <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                  A verification code was sent to{' '}
                  {pendingConfirmation.deliveryDetails?.deliveryMedium} at{' '}
                  {pendingConfirmation.deliveryDetails?.destination}
                </p>
              </div>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="confirmation-code" className="text-sm font-medium">
                    Confirmation Code
                  </Label>
                  <Input
                    id="confirmation-code"
                    value={confirmationCode}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setConfirmationCode(e.target.value)
                    }
                    placeholder="Enter verification code"
                    className="mt-1"
                  />
                </div>
                <Button
                  onClick={handleConfirmAttribute}
                  disabled={updating || !confirmationCode}
                  className="w-full bg-amber-600 text-white hover:bg-amber-700"
                >
                  {updating ? 'Confirming...' : 'Confirm Update'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
