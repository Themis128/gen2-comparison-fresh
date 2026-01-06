'use client';

import React, { useState } from 'react';

import { Badge } from './badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { ScrollArea } from './scroll-area';
import { Button } from './ui/button';
import { useAuthEvents, type AuthEventData } from '../lib/useAuthEvents';

interface AuthEventMonitorProps {
  _onClose?: () => void;
}

export const AuthEventMonitor: React.FC<AuthEventMonitorProps> = ({ _onClose }) => {
  const [eventHistory, setEventHistory] = useState<AuthEventData[]>([]);
  const [isListening, setIsListening] = useState(true);
  const [maxEvents] = useState(50); // Keep last 50 events

  useAuthEvents((eventData) => {
    if (isListening) {
      setEventHistory((prev) => {
        const newHistory = [eventData, ...prev];
        return newHistory.slice(0, maxEvents);
      });
    }
  }, isListening);

  const clearHistory = () => {
    setEventHistory([]);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  const getEventColor = (event: string) => {
    if (event.includes('signedIn') || event.includes('signUp') || event.includes('confirm')) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    if (event.includes('signedOut') || event.includes('signOut')) {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    if (event.includes('failure') || event.includes('_failure')) {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    if (event.includes('tokenRefresh')) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    if (event.includes('redirect')) {
      return 'bg-purple-100 text-purple-800 border-purple-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatEventData = (data: unknown) => {
    if (!data) return 'No data';
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return new Date().toLocaleTimeString();
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              🔊 Auth Event Monitor
              <Badge variant={isListening ? 'default' : 'secondary'}>
                {isListening ? 'Listening' : 'Paused'}
              </Badge>
            </CardTitle>
            <CardDescription>
              Real-time monitoring of authentication events via Amplify Hub
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={toggleListening}>
              {isListening ? 'Pause' : 'Resume'}
            </Button>
            <Button size="sm" variant="outline" onClick={clearHistory}>
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Events captured: {eventHistory.length} / {maxEvents}
          </div>

          <ScrollArea className="h-96 w-full rounded-md border p-4">
            {eventHistory.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                {isListening ? 'Waiting for auth events...' : 'Event listening is paused'}
              </div>
            ) : (
              <div className="space-y-3">
                {eventHistory.map((event) => (
                  <div
                    key={`${event.event}-${event.timestamp}-${Math.random()}`}
                    className="rounded-lg border bg-card p-3"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={getEventColor(event.event)}>{event.event}</Badge>
                        <span className="text-xs text-muted-foreground">{formatTimestamp()}</span>
                      </div>
                    </div>

                    {event.message && (
                      <div className="mb-2">
                        <span className="text-sm font-medium">Message: </span>
                        <span className="text-sm text-muted-foreground">{event.message}</span>
                      </div>
                    )}

                    {event.data ? (
                      <details className="text-xs">
                        <summary className="mb-1 cursor-pointer font-medium">Event Data</summary>
                        <pre className="overflow-x-auto rounded bg-muted p-2 text-xs">
                          {formatEventData(event.data)}
                        </pre>
                      </details>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="space-y-1 text-xs text-muted-foreground">
            <p>
              <strong>Common Events:</strong>
            </p>
            <ul className="ml-4 list-inside list-disc space-y-1">
              <li>
                <code>signedIn</code> - User successfully signed in
              </li>
              <li>
                <code>signedOut</code> - User signed out
              </li>
              <li>
                <code>tokenRefresh</code> - Auth tokens refreshed
              </li>
              <li>
                <code>tokenRefresh_failure</code> - Token refresh failed
              </li>
              <li>
                <code>signIn_failure</code> - Sign in attempt failed
              </li>
              <li>
                <code>signUp</code> - User signed up
              </li>
              <li>
                <code>autoSignIn</code> - Automatic sign in after sign up
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
