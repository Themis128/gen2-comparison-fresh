'use client';

import { MobileNavigation } from '@/components/MobileNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <>
      <MobileNavigation />
      <main className="container mx-auto px-4 py-8 safe-area-bottom">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to your dashboard</p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="mobile-spacing">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full touch-button">New Project</Button>
                <Button variant="outline" className="w-full touch-button">View Reports</Button>
              </CardContent>
            </Card>
            
            <Card className="mobile-spacing">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest actions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">No recent activity</p>
              </CardContent>
            </Card>
            
            <Card className="mobile-spacing md:col-span-2 lg:col-span-1">
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Manage your preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full touch-button">Open Settings</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}