import { render, screen, waitFor } from '@testing-library/react';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

import AuthWrapper from '../AuthWrapper';

type User = {
  userId: string;
  username: string;
};

// Mock Next.js router
const mockPush = jest.fn();
const mockPathname = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => mockPathname(),
}));

// Mock AWS Amplify auth
jest.mock('aws-amplify/auth', () => ({
  getCurrentUser: jest.fn(),
  fetchAuthSession: jest.fn(),
}));

// Mock process.env
const originalEnv = process.env;
beforeEach(() => {
  jest.resetModules();
  process.env = { ...originalEnv };
  delete process.env.NEXT_PUBLIC_TEST_MODE;
});

afterEach(() => {
  process.env = originalEnv;
});

const mockGetCurrentUser = getCurrentUser as jest.MockedFunction<typeof getCurrentUser>;
const mockFetchAuthSession = fetchAuthSession as jest.MockedFunction<typeof fetchAuthSession>;

describe('AuthWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
    mockPathname.mockReturnValue('/');
  });

  it('shows loading spinner while checking authentication', () => {
    mockGetCurrentUser.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(
      <AuthWrapper>
        <div>Protected Content</div>
      </AuthWrapper>
    );

    // When loading, should show spinner and not render children
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders children when user is authenticated', async () => {
    mockPathname.mockReturnValue('/app');
    mockGetCurrentUser.mockResolvedValue({
      userId: 'test-user-id',
      username: 'testuser',
    } as User);
    mockFetchAuthSession.mockResolvedValue({
      tokens: {
        accessToken: {
          payload: {
            'cognito:groups': [],
          },
        },
      },
    } as any);

    render(
      <AuthWrapper>
        <div>Protected Content</div>
      </AuthWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('redirects to signin when user is not authenticated', async () => {
    mockGetCurrentUser.mockRejectedValue(new Error('Not authenticated'));

    render(
      <AuthWrapper>
        <div>Protected Content</div>
      </AuthWrapper>
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/auth/signin');
    });

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('handles authentication check errors gracefully', async () => {
    mockGetCurrentUser.mockRejectedValue(new Error('Network error'));

    render(
      <AuthWrapper>
        <div>Protected Content</div>
      </AuthWrapper>
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/auth/signin');
    });
  });

  it('bypasses authentication in test mode', () => {
    render(
      <AuthWrapper testMode>
        <div>Protected Content</div>
      </AuthWrapper>
    );

    // Should render children immediately without checking auth
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
    expect(mockGetCurrentUser).not.toHaveBeenCalled();
  });
});
