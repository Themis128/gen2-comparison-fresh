'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, RefreshCw, Trash2, Eye, EyeOff, Mail, User, MessageSquare } from 'lucide-react';
import React from 'react';

import { client } from '@/lib/amplify-client';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface ContactMessage {
  id: string;
  name: string | null;
  email: string | null;
  subject: string | null;
  message: string | null;
  priority: string | null;
  newsletter: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export default function ContactMessages() {
  const queryClient = useQueryClient();
  const [selectedMessage, setSelectedMessage] = React.useState<ContactMessage | null>(null);

  // Fetch contact messages
  const {
    data: messages,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['contact-messages'],
    queryFn: async () => {
      const response = await client.models.ContactMessage.list({
        limit: 50,
      });
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
  });

  // Delete message mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await client.models.ContactMessage.delete({ id });
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData(['contact-messages'], (old: any) =>
        old?.filter((msg: ContactMessage) => msg.id !== deletedId)
      );
    },
  });

  // Mark as read/unread (we'll use a simple approach with local state for demo)
  const [readMessages, setReadMessages] = React.useState<Set<string>>(new Set());

  const toggleReadStatus = (messageId: string) => {
    setReadMessages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contact Messages</CardTitle>
          <CardDescription>Loading messages...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contact Messages</CardTitle>
          <CardDescription>Error loading messages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <p className="mb-4 text-red-500">Error: {error?.message}</p>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Messages</CardTitle>
        <CardDescription>
          Manage contact form submissions ({messages?.length || 0} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg border p-3 text-center">
            <div className="text-2xl font-bold">{messages?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <div className="text-2xl font-bold text-red-600">
              {messages?.filter((m) => m.priority === 'high').length || 0}
            </div>
            <div className="text-sm text-muted-foreground">High Priority</div>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{readMessages.size}</div>
            <div className="text-sm text-muted-foreground">Read</div>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <div className="text-2xl font-bold text-green-600">
              {messages?.filter((m) => m.newsletter).length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Newsletter</div>
          </div>
        </div>

        {/* Messages List */}
        <div className="space-y-4">
          {messages?.map((message) => (
            <div
              key={message.id}
              className={`rounded-lg border p-4 transition-colors ${
                readMessages.has(message.id) ? 'bg-muted/30' : 'bg-background'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <Badge className={getPriorityColor(message.priority || 'normal')}>
                      {message.priority || 'Normal'}
                    </Badge>
                    {message.newsletter && <Badge variant="outline">Newsletter</Badge>}
                    {readMessages.has(message.id) && <Badge variant="secondary">Read</Badge>}
                  </div>

                  <div className="mb-1 flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{message.name}</span>
                  </div>

                  <div className="mb-1 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{message.email}</span>
                  </div>

                  <div className="mb-2 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{message.subject}</span>
                  </div>

                  <p className="line-clamp-2 text-sm text-muted-foreground">{message.message}</p>

                  {message.createdAt && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Date(message.createdAt).toLocaleDateString()} at{' '}
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </p>
                  )}
                </div>

                <div className="ml-4 flex flex-col gap-2">
                  <Button size="sm" variant="outline" onClick={() => toggleReadStatus(message.id)}>
                    {readMessages.has(message.id) ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(message.id)}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center gap-2">
          <Button onClick={() => refetch()} variant="outline" disabled={isFetching}>
            {isFetching ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
          {messages?.length === 0 && (
            <p className="text-sm text-muted-foreground">No contact messages yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
