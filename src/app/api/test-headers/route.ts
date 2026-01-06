import { NextRequest, NextResponse } from 'next/server';

export const revalidate = false;

export async function GET(request: NextRequest) {
  // Return middleware headers for testing
  const headers = {
    'x-middleware-test': request.headers.get('x-middleware-test'),
    'x-request-path': request.headers.get('x-request-path'),
    'x-request-method': request.headers.get('x-request-method'),
    'x-simulated-country': request.headers.get('x-simulated-country'),
    'x-device-type': request.headers.get('x-device-type'),
    'x-test-variant': request.headers.get('x-test-variant'),
  };

  return NextResponse.json({
    message: 'Middleware headers test',
    headers,
    timestamp: new Date().toISOString(),
  });
}
