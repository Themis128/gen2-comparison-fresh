import type { PostConfirmationTriggerHandler } from 'aws-lambda';
import { CognitoIdentityProviderClient, AdminAddUserToGroupCommand } from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient({});

export const handler: PostConfirmationTriggerHandler = async (event) => {
  const email = event.request.userAttributes.email;

  // Add admin users to admin group
  if (email && (
    email.endsWith('@cloudless.com') ||
    email === 'tbaltzakis@cloudless.com'
  )) {
    try {
      await client.send(new AdminAddUserToGroupCommand({
        UserPoolId: event.userPoolId,
        Username: event.userName,
        GroupName: 'admin',
      }));
      console.log(`Added ${email} to admin group`);
    } catch (error) {
      console.error('Error adding user to admin group:', error);
    }
  }

  return event;
};
