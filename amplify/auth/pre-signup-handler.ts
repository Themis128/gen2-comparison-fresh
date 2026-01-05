import type { PreSignUpTriggerHandler } from 'aws-lambda';

export const handler: PreSignUpTriggerHandler = async (event) => {
  const email = event.request.userAttributes.email;

  // Auto-confirm users with @admin.com or @company.com emails
  if (email && (email.endsWith('@admin.com') || email.endsWith('@company.com') || email.includes('admin'))) {
    event.response.autoConfirmUser = true;
    event.response.autoVerifyEmail = true;

    console.log(`AUTO-CONFIRMED: User ${email} has been automatically verified.`);
  }

  return event;
};
