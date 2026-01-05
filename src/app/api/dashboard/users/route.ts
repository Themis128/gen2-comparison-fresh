import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock users data
    const users = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'User' as const,
        status: 'Active' as const,
        lastLogin: new Date().toISOString(),
        createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'Admin' as const,
        status: 'Active' as const,
        lastLogin: new Date(Date.now() - 3600000).toISOString(),
        createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
      },
      {
        id: '3',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        role: 'Moderator' as const,
        status: 'Active' as const,
        lastLogin: new Date(Date.now() - 7200000).toISOString(),
        createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
      },
      {
        id: '4',
        name: 'Alice Wilson',
        email: 'alice@example.com',
        role: 'User' as const,
        status: 'Inactive' as const,
        lastLogin: new Date(Date.now() - 86400000 * 7).toISOString(),
        createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
      },
      {
        id: '5',
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        role: 'User' as const,
        status: 'Active' as const,
        lastLogin: new Date(Date.now() - 1800000).toISOString(),
        createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
      },
    ];

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Users API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, role } = body;

    // Mock user creation
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      role: role || 'User',
      status: 'Active' as const,
      lastLogin: null,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error('Create user API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
