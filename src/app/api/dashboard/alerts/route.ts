import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock alerts data
    const alerts = [
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
      {
        id: '3',
        type: 'info' as const,
        message: 'System backup completed successfully',
        resolved: true,
        resolvedAt: new Date(Date.now() - 3600000).toISOString(),
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: '4',
        type: 'success' as const,
        message: 'User authentication spike detected',
        resolved: true,
        resolvedAt: new Date(Date.now() - 1800000).toISOString(),
        timestamp: new Date(Date.now() - 10800000).toISOString(),
      },
    ];

    return NextResponse.json({ alerts });
  } catch (error) {
    console.error('Alerts API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
