import type { PreSignUpTriggerHandler } from 'aws-lambda';

export const handler: PreSignUpTriggerHandler = async (event) => {
  const email = event.request.userAttributes.email;

  // Auto-verify admin emails - no 6-digit code needed
  if (email && (
    email.includes('admin') ||
    email.endsWith('@admin.com') ||
    email.endsWith('@company.com') ||
    email.endsWith('@cloudless.com') ||
    email === 'tbaltzakis@cloudless.com'
  )) {
    event.response.autoConfirmUser = true;
    event.response.autoVerifyEmail = true;
  }

  return event;
};
