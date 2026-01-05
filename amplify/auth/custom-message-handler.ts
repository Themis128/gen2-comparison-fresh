import type { CustomMessageTriggerHandler } from 'aws-lambda';

export const handler: CustomMessageTriggerHandler = async (event) => {
  console.log('Custom Message Event:', JSON.stringify(event, null, 2));

  if (event.triggerSource === 'CustomMessage_SignUp' || event.triggerSource === 'CustomMessage_ResendCode') {
    const { codeParameter } = event.request;
    const { email } = event.request.userAttributes;

    console.log('################################################');
    console.log(`DEBUG: Verification code for ${email} is being sent.`);
    console.log(`The code parameter is: ${codeParameter}`);
    console.log('Check your email or the Cognito console if this is a real user.');
    console.log('################################################');

    // Note: In some environments, the actual code might be available in event.request.code
    // but usually it's just the placeholder {####} for security.
    // We log the event above to see if it's available in this specific environment.
  }

  return event;
};
