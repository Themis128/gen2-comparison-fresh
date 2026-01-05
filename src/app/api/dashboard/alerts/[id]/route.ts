import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { resolved } = body;

    // Mock alert update
    const updatedAlert = {
      id,
      type: 'warning' as const,
      message: 'Alert updated',
      resolved: resolved || false,
      resolvedAt: resolved ? new Date().toISOString() : undefined,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    };

    return NextResponse.json({ alert: updatedAlert });
  } catch (error) {
    console.error('Update alert API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
