import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock dashboard data for now - in production this would query real data
    const dashboardData = {
      metrics: {
        totalUsers: 25,
        userGrowth: 12,
        activeSessions: 18,
        sessionGrowth: 8,
        systemHealth: 98,
        activeAlerts: 3,
        resolvedAlertsToday: 7,
      },
      system: {
        cpuUsage: 32,
        memoryUsage: 67,
        storageUsage: 45,
        networkUsage: 28,
      },
      activity: [
        {
          type: 'security' as const,
          message: 'User authentication successful',
          timestamp: new Date().toISOString(),
        },
        {
          type: 'system' as const,
          message: 'Database backup completed',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          type: 'maintenance' as const,
          message: 'System update applied',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
        },
      ],
      users: [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'User' as const,
          status: 'Active' as const,
          lastLogin: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'Admin' as const,
          status: 'Active' as const,
          lastLogin: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
      ],
      alerts: [
        {
          id: '1',
          type: 'warning' as const,
          message: 'High CPU usage detected',
          resolved: false,
          timestamp: new Date().toISOString(),
        },
        {
          id: '2',
          type: 'error' as const,
          message: 'Database connection timeout',
          resolved: false,
          timestamp: new Date(Date.now() - 1800000).toISOString(),
        },
      ],
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
