import { defineAuth, secret } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */

// Define secrets
const googleClientId = secret('GOOGLE_CLIENT_ID');
const googleClientSecret = secret('GOOGLE_CLIENT_SECRET');

export const auth = defineAuth({
  loginWith: {
    email: true,
    // Social authentication providers
    externalProviders: {
      google: {
        clientId: googleClientId,
        clientSecret: googleClientSecret,
        scopes: ['email', 'profile', 'openid'],
        attributeMapping: {
          email: 'email',
          givenName: 'given_name',
          familyName: 'family_name',
        },
      },
      callbackUrls: [
        'http://localhost:3000/auth/signin',
        'https://yourdomain.com/auth/signin',
      ],
      logoutUrls: [
        'http://localhost:3000/auth/signin',
        'https://yourdomain.com/auth/signin',
      ],
    },
  },
  // Enhanced security settings
  userAttributes: {
    email: {
      required: true,
      mutable: true,
    },
    givenName: {
      required: false,
      mutable: true,
    },
    familyName: {
      required: false,
      mutable: true,
    },
  },
});
