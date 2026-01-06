import { NextResponse } from 'next/server';

export const revalidate = false;

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'User' | 'Moderator' | 'Admin';
  status: 'Active' | 'Inactive';
  lastLogin?: string;
  createdAt: string;
}

interface DashboardData {
  totalUsers: number;
  newUsersThisMonth: number;
  activeSessions: number;
  sessionGrowth: number;
  systemHealth: number;
  metrics: {
    totalUsers: number;
    userGrowth: number;
    activeSessions: number;
    sessionGrowth: number;
    systemHealth: number;
    activeAlerts: number;
    resolvedAlertsToday: number;
  };
  system: {
    cpuUsage: number;
    memoryUsage: number;
    storageUsage: number;
    networkUsage: number;
  };
  activity: Array<{
    type: 'security' | 'system' | 'maintenance' | 'other';
    message: string;
    timestamp: string;
  }>;
  users?: UserData[];
}

export async function GET(_request: Request) {
  try {
    // Mock data for demonstration
    const dashboardData: DashboardData = {
      totalUsers: 1247,
      newUsersThisMonth: 89,
      activeSessions: 234,
      sessionGrowth: 12.5,
      systemHealth: 98.7,
      metrics: {
        totalUsers: 1247,
        userGrowth: 7.2,
        activeSessions: 234,
        sessionGrowth: 12.5,
        systemHealth: 98.7,
        activeAlerts: 3,
        resolvedAlertsToday: 12,
      },
      system: {
        cpuUsage: 45.2,
        memoryUsage: 67.8,
        storageUsage: 34.1,
        networkUsage: 23.4,
      },
      activity: [
        {
          type: 'security',
          message: 'User authentication successful',
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
        },
        {
          type: 'system',
          message: 'Database backup completed',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
        },
        {
          type: 'maintenance',
          message: 'System update applied',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        },
        {
          type: 'security',
          message: 'Failed login attempt detected',
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
        },
        {
          type: 'other',
          message: 'New user registered',
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
        },
      ],
      users: [
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'Admin',
          status: 'Active',
          lastLogin: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          role: 'User',
          status: 'Active',
          lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(), // 15 days ago
        },
        {
          id: '3',
          name: 'Bob Johnson',
          email: 'bob.johnson@example.com',
          role: 'Moderator',
          status: 'Inactive',
          lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(), // 60 days ago
        },
      ],
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
