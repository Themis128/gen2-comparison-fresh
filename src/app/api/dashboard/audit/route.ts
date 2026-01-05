import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock audit logs data
    const auditLogs = [
      {
        id: '1',
        action: 'User Login',
        resource: 'Authentication',
        resourceId: 'user-123',
        userId: 'admin@admin.com',
        details: { ip: '192.168.1.1', userAgent: 'Chrome/91.0' },
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        action: 'User Created',
        resource: 'User Management',
        resourceId: 'user-456',
        userId: 'admin@admin.com',
        details: { role: 'User', email: 'newuser@example.com' },
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: '3',
        action: 'Todo Updated',
        resource: 'Todo',
        resourceId: 'todo-789',
        userId: 'john@example.com',
        details: { field: 'isDone', oldValue: false, newValue: true },
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: '4',
        action: 'Alert Resolved',
        resource: 'Alert Management',
        resourceId: 'alert-101',
        userId: 'admin@admin.com',
        details: { alertType: 'warning', message: 'High CPU usage' },
        timestamp: new Date(Date.now() - 10800000).toISOString(),
      },
      {
        id: '5',
        action: 'Bulk User Update',
        resource: 'User Management',
        userId: 'admin@admin.com',
        details: { count: 5, action: 'status_update', newStatus: 'Active' },
        timestamp: new Date(Date.now() - 14400000).toISOString(),
      },
    ];

    return NextResponse.json({ auditLogs });
  } catch (error) {
    console.error('Audit API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
