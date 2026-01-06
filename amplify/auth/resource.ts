import { defineAuth, secret } from '@aws-amplify/backend';
import { defineFunction } from '@aws-amplify/backend';

const preSignUpHandler = defineFunction({
  name: 'pre-signup-handler',
  entry: './pre-signup-handler.ts',
  resourceGroupName: 'auth',
});

const postConfirmationHandler = defineFunction({
  name: 'post-confirmation-handler',
  entry: './post-confirmation-handler.ts',
  resourceGroupName: 'auth',
});

export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: secret('GOOGLE_CLIENT_ID'),
        clientSecret: secret('GOOGLE_CLIENT_SECRET'),
        scopes: ['email', 'profile', 'openid'],
      },
      callbackUrls: [
        'http://localhost:3000/auth/callback',
        'http://localhost:45267/auth/callback',
        'https://baltzakisthemis.com/auth/callback',
        'https://www.baltzakisthemis.com/auth/callback',
      ],
      logoutUrls: [
        'http://localhost:3000',
        'http://localhost:45267',
        'https://baltzakisthemis.com',
        'https://www.baltzakisthemis.com',
      ],
    },
  },
  groups: ['admin', 'user'],
  triggers: {
    preSignUp: preSignUpHandler,
    postConfirmation: postConfirmationHandler,
  },
});
