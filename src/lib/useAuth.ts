'use client';

import {
  confirmSignIn,
  confirmUserAttribute,
  deleteUserAttributes,
  fetchAuthSession,
  fetchUserAttributes,
  getCurrentUser,
  sendUserAttributeVerificationCode,
  signIn,
  signOut,
  signUp,
  updateUserAttribute,
  updateUserAttributes,
  type UserAttributeKey,
  type VerifiableUserAttributeKey,
  type SignUpInput
} from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

// Re-export types for use in components
export type { UserAttributeKey, VerifiableUserAttributeKey };

export interface UserInfo {
  username: string;
  userId: string;
  signInDetails: {
    loginId?: string;
    authFlowType?: string;
  } | null | undefined;
}

export type AuthFlowType = 'USER_SRP_AUTH' | 'USER_PASSWORD_AUTH' | 'CUSTOM_WITH_SRP' | 'CUSTOM_WITHOUT_SRP' | 'USER_AUTH';

export type PreferredChallenge = 'PASSWORD' | 'PASSWORD_SRP' | 'WEB_AUTHN' | 'EMAIL_OTP' | 'SMS_OTP';

export interface SignInOptions {
  authFlowType?: AuthFlowType;
  preferredChallenge?: PreferredChallenge;
}

export interface SignInResult {
  nextStep: {
    signInStep: string;
    availableChallenges?: string[];
  };
}

export interface AuthSession {
  tokens: {
    idToken: {
      payload: Record<string, unknown>;
      toString: () => string;
    };
    accessToken: {
      payload: Record<string, unknown>;
      toString: () => string;
    };
  };
}

export interface UserAttributes {
  email?: string;
  phone_number?: string;
  given_name?: string;
  family_name?: string;
  nickname?: string;
  name?: string;
  [key: `custom:${string}`]: string | undefined;
  [key: string]: string | undefined;
}

export interface UpdateUserAttributeResult {
  nextStep: {
    updateAttributeStep: 'CONFIRM_ATTRIBUTE_WITH_CODE' | 'DONE';
    codeDeliveryDetails?: {
      deliveryMedium: string;
      destination: string;
    };
  };
}

export interface UpdateUserAttributesResult {
  [key: string]: UpdateUserAttributeResult;
}

export type AuthEventType =
  | 'signedIn'
  | 'signedOut'
  | 'tokenRefresh'
  | 'tokenRefresh_failure'
  | 'signInWithRedirect'
  | 'signInWithRedirect_failure'
  | 'customOAuthState'
  | 'configured'
  | 'signIn_failure'
  | 'signUp'
  | 'signUp_failure'
  | 'confirmSignUp'
  | 'confirmSignUp_failure'
  | 'autoSignIn'
  | 'autoSignIn_failure'
  | 'forgotPassword'
  | 'forgotPassword_failure'
  | 'forgotPasswordSubmit'
  | 'forgotPasswordSubmit_failure'
  | 'verify'
  | 'verify_failure'
  | 'resend'
  | 'resend_failure'
  | 'updateUserAttributes'
  | 'updateUserAttributes_failure'
  | 'updateUserAttribute'
  | 'updateUserAttribute_failure'
  | 'confirmUserAttribute'
  | 'confirmUserAttribute_failure'
  | 'signOut'
  | 'signOut_failure';

/**
 * Retrieve the current authenticated user
 * @returns Promise<UserInfo> - username, userId, signInDetails
 * @throws Error if user is not authenticated
 */
export const getCurrentUserInfo = async (): Promise<UserInfo> => {
  const { username, userId, signInDetails } = await getCurrentUser();
  return { username, userId, signInDetails };
};

/**
 * Retrieve the user's authentication session
 * @returns Promise<AuthSession> - tokens object with idToken and accessToken
 */
export const getAuthSession = async (): Promise<AuthSession> => {
  const session = await fetchAuthSession();
  return session as AuthSession;
};

/**
 * Refresh the user's session explicitly
 * @returns Promise<AuthSession> - refreshed tokens
 */
export const refreshAuthSession = async (): Promise<AuthSession> => {
  const session = await fetchAuthSession({ forceRefresh: true });
  return session as AuthSession;
};

/**
 * Sign in with various authentication flows
 * @param username - The username to sign in with
 * @param password - The password (required for PASSWORD flows)
 * @param options - Authentication options including flow type and preferred challenge
 * @returns Promise<SignInResult>
 */
export const signInWithFlow = async (
  username: string,
  password?: string,
  options: SignInOptions = {}
): Promise<SignInResult> => {
  const signInOptions: {
    authFlowType: AuthFlowType;
    preferredChallenge?: PreferredChallenge;
  } = {
    authFlowType: options.authFlowType || 'USER_SRP_AUTH',
    ...(options.preferredChallenge && { preferredChallenge: options.preferredChallenge }),
  };

  const result = await signIn({
    username,
    ...(password && { password }),
    options: signInOptions,
  });

  return result as SignInResult;
};

/**
 * Confirm sign-in with challenge response (for USER_AUTH flow)
 * @param challengeResponse - The selected challenge or response
 * @returns Promise<SignInResult>
 */
export const confirmSignInWithChallenge = async (challengeResponse: string): Promise<SignInResult> => {
  const result = await confirmSignIn({
    challengeResponse,
  });

  return result as SignInResult;
};

/**
 * Sign out the current user
 * @returns Promise<void>
 */
export const signOutUser = async (): Promise<void> => {
  await signOut();
};

/**
 * Sign up a new user with optional user attributes
 * @param username - The username for sign up
 * @param password - The password for the user
 * @param userAttributes - Optional user attributes to set during sign up
 * @returns Promise<any> - Sign up result
 */
export const signUpWithAttributes = async (
  username: string,
  password: string,
  userAttributes?: Partial<UserAttributes>
): Promise<unknown> => {
  const signUpInput: SignUpInput = {
    username,
    password,
  };

  if (userAttributes) {
    signUpInput.options = {
      userAttributes,
    };
  }

  const result = await signUp(signUpInput);
  return result;
};

/**
 * Fetch user attributes for the current authenticated user
 * @returns Promise<UserAttributes>
 */
export const getUserAttributes = async (): Promise<UserAttributes> => {
  const attributes = await fetchUserAttributes();
  return attributes as UserAttributes;
};

/**
 * Update a single user attribute
 * @param attributeKey - The attribute key to update
 * @param value - The new value for the attribute
 * @returns Promise<UpdateUserAttributeResult>
 */
export const updateSingleUserAttribute = async (
  attributeKey: string,
  value: string
): Promise<UpdateUserAttributeResult> => {
  const result = await updateUserAttribute({
    userAttribute: {
      attributeKey,
      value,
    },
  });

  return result as UpdateUserAttributeResult;
};

/**
 * Update multiple user attributes
 * @param attributes - Object containing attribute key-value pairs to update
 * @returns Promise<UpdateUserAttributesResult>
 */
export const updateMultipleUserAttributes = async (
  attributes: Record<string, string>
): Promise<UpdateUserAttributesResult> => {
  const result = await updateUserAttributes({
    userAttributes: attributes,
  });

  return result as UpdateUserAttributesResult;
};

/**
 * Confirm a user attribute update with verification code
 * @param attributeKey - The attribute key to confirm
 * @param confirmationCode - The verification code received
 * @returns Promise<void>
 */
export const confirmUserAttributeUpdate = async (
  attributeKey: VerifiableUserAttributeKey,
  confirmationCode: string
): Promise<void> => {
  await confirmUserAttribute({
    userAttributeKey: attributeKey,
    confirmationCode,
  });
};

/**
 * Send verification code for user attribute confirmation
 * @param attributeKey - The attribute key that needs verification
 * @returns Promise<void>
 */
export const sendUserAttributeVerification = async (attributeKey: VerifiableUserAttributeKey): Promise<void> => {
  await sendUserAttributeVerificationCode({
    userAttributeKey: attributeKey,
  });
};

/**
 * Delete one or more user attributes
 * @param attributeKeys - Array of attribute keys to delete
 * @returns Promise<void>
 */
export const deleteUserAttributesByKeys = async (attributeKeys: [UserAttributeKey, ...UserAttributeKey[]]): Promise<void> => {
  await deleteUserAttributes({
    userAttributeKeys: attributeKeys,
  });
};

/**
 * Check if user is authenticated (without throwing error)
 * @returns Promise<UserInfo | null>
 */
export const checkAuthStatus = async (): Promise<UserInfo | null> => {
  try {
    return await getCurrentUserInfo();
  } catch {
    return null;
  }
};

/**
 * Auth event listener management
 */
export interface AuthEventListener {
  event: AuthEventType;
  callback: (data: unknown) => void;
}

export interface AuthEventData {
  event: AuthEventType;
  data?: unknown;
  message?: string;
}

/**
 * Start listening to auth events
 * @param callback - Function to call when auth events occur
 * @returns Function to stop listening
 */
export const listenToAuthEvents = (callback: (data: AuthEventData) => void): (() => void) => {
  const hubListenerCancelToken = Hub.listen('auth', ({ payload }) => {
    const eventData: AuthEventData = {
      event: payload.event as AuthEventType,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: (payload as any).data,
      message: payload.message,
    };
    callback(eventData);
  });

  return hubListenerCancelToken;
};

/**
 * Listen to specific auth events
 * @param events - Array of events to listen for
 * @param callback - Function to call when specified events occur
 * @returns Function to stop listening
 */
export const listenToSpecificAuthEvents = (
  events: AuthEventType[],
  callback: (data: AuthEventData) => void
): (() => void) => {
  const hubListenerCancelToken = Hub.listen('auth', ({ payload }) => {
    if (events.includes(payload.event as AuthEventType)) {
      const eventData: AuthEventData = {
        event: payload.event as AuthEventType,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: (payload as any).data,
        message: payload.message,
      };
      callback(eventData);
    }
  });

  return hubListenerCancelToken;
};

/**
 * Log auth events to console (useful for debugging)
 * @param events - Optional array of events to log (logs all if not specified)
 * @returns Function to stop logging
 */
export const logAuthEvents = (events?: AuthEventType[]): (() => void) => {
  const targetEvents = events || [
    'signedIn',
    'signedOut',
    'tokenRefresh',
    'tokenRefresh_failure',
    'signInWithRedirect',
    'signInWithRedirect_failure',
    'customOAuthState',
    'signIn_failure',
    'signUp',
    'signUp_failure',
    'autoSignIn',
    'autoSignIn_failure',
  ];

  return listenToSpecificAuthEvents(targetEvents, ({ event, data, message }) => {
    switch (event) {
      case 'signedIn':
        console.log('🔐 User has been signed in successfully.');
        break;
      case 'signedOut':
        console.log('🚪 User has been signed out successfully.');
        break;
      case 'tokenRefresh':
        console.log('🔄 Auth tokens have been refreshed.');
        break;
      case 'tokenRefresh_failure':
        console.log('❌ Failure while refreshing auth tokens.', { error: data });
        break;
      case 'signInWithRedirect':
        console.log('🔗 signInWithRedirect API has successfully been resolved.');
        break;
      case 'signInWithRedirect_failure':
        console.log('❌ Failure while trying to resolve signInWithRedirect API.', { error: data });
        break;
      case 'customOAuthState':
        console.log('🌐 Custom state returned from Cognito Hosted UI', { state: data });
        break;
      case 'signIn_failure':
        console.log('❌ Sign in failed.', { error: data, message });
        break;
      case 'signUp':
        console.log('📝 User has signed up successfully.');
        break;
      case 'signUp_failure':
        console.log('❌ Sign up failed.', { error: data, message });
        break;
      case 'autoSignIn':
        console.log('🔄 Auto sign in successful.');
        break;
      case 'autoSignIn_failure':
        console.log('❌ Auto sign in failed.', { error: data, message });
        break;
      default:
        console.log(`ℹ️ Auth event: ${event}`, { data, message });
    }
  });
};