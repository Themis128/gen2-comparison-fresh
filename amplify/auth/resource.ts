import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  groups: ["ADMIN", "USER"],
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
