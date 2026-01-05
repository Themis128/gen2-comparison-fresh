import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, email, role } = body;

    // Mock user update
    const updatedUser = {
      id,
      name: name || 'Updated User',
      email: email || 'updated@example.com',
      role: role || 'User',
      status: 'Active' as const,
      lastLogin: new Date().toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    };

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Update user API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Mock user deletion
    return NextResponse.json({
      message: `User ${id} deleted successfully`
    });
  } catch (error) {
    console.error('Delete user API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
