import { NextRequest, NextResponse } from 'next/server';

export const revalidate = false;

// Route Handler - API endpoint for contact form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message, priority } = body;

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Simulate successful submission
    console.log('Contact form submitted:', { name, email, subject, priority });

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      id: Math.random().toString(36).substr(2, 9),
    });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET handler for testing
export async function GET() {
  return NextResponse.json({
    message: 'Contact API is running',
    timestamp: new Date().toISOString(),
  });
}
