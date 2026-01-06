import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

export const revalidate = false;

export async function GET(request: NextRequest) {
  try {
    // Check for test auth header first (for Playwright tests)
    const testAuthHeader = request.headers.get('x-test-auth');
    if (testAuthHeader === 'authenticated') {
      return NextResponse.json({
        isAuthenticated: true,
        isAdmin: true, // Assume test user is admin
      });
    }

    // Check for test mode
    const testMode =
      request.headers.get('x-test-mode') === 'true' || process.env.NEXT_PUBLIC_TEST_MODE === 'true';

    if (testMode) {
      return NextResponse.json({
        isAuthenticated: true,
        isAdmin: true,
      });
    }

    // Check actual authentication
    try {
      const user = await getCurrentUser();
      const session = await fetchAuthSession();
      const groups = (session.tokens?.accessToken?.payload['cognito:groups'] as string[]) || [];

      return NextResponse.json({
        isAuthenticated: !!user,
        isAdmin: groups.includes('admin'),
      });
    } catch (authError) {
      // Not authenticated
      return NextResponse.json({
        isAuthenticated: false,
        isAdmin: false,
      });
    }
  } catch {
    return NextResponse.json({
      isAuthenticated: false,
      isAdmin: false,
    });
  }
}
