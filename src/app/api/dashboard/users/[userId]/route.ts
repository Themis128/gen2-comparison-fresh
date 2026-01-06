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

export async function PUT(request: Request, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params;
    const body = await request.json();
    const { _action, ...updateData } = body;

    // Mock user update logic
    const updatedUser: UserData = {
      id: userId,
      name: updateData.name || 'Updated User',
      email: updateData.email || `user${userId}@example.com`,
      role: updateData.role || 'User',
      status: updateData.status || 'Active',
      lastLogin: new Date().toISOString(),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    };

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: `User ${userId} updated successfully`,
    });
  } catch (error) {
    console.error('User update API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params;

    // Mock user deletion logic
    return NextResponse.json({
      success: true,
      message: `User ${userId} deleted successfully`,
    });
  } catch (error) {
    console.error('User delete API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export function generateStaticParams() {
  return [];
}
