import { NextRequest, NextResponse } from 'next/server';

// Edge runtime API route
export const runtime = 'edge';
export const revalidate = false;

export async function GET(request: NextRequest) {
  // Simulate edge processing
  const region = request.headers.get('x-vercel-ip-country') || 'unknown';
  const city = request.headers.get('x-vercel-ip-city') || 'unknown';

  return NextResponse.json({
    message: 'Edge runtime API response',
    region,
    city,
    timestamp: new Date().toISOString(),
    runtime: 'edge',
    processingLocation: 'nearest edge server',
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  return NextResponse.json({
    success: true,
    message: 'Edge-processed request',
    data: body,
    processedAt: 'edge',
    latency: '< 10ms',
  });
}
