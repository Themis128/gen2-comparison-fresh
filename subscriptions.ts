/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateContactMessage = /* GraphQL */ `subscription OnCreateContactMessage(
  $filter: ModelSubscriptionContactMessageFilterInput
) {
  onCreateContactMessage(filter: $filter) {
    createdAt
    email
    id
    message
    name
    newsletter
    priority
    recaptchaToken
    subject
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateContactMessageSubscriptionVariables,
  APITypes.OnCreateContactMessageSubscription
>;
export const onDeleteContactMessage = /* GraphQL */ `subscription OnDeleteContactMessage(
  $filter: ModelSubscriptionContactMessageFilterInput
) {
  onDeleteContactMessage(filter: $filter) {
    createdAt
    email
    id
    message
    name
    newsletter
    priority
    recaptchaToken
    subject
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteContactMessageSubscriptionVariables,
  APITypes.OnDeleteContactMessageSubscription
>;
export const onUpdateContactMessage = /* GraphQL */ `subscription OnUpdateContactMessage(
  $filter: ModelSubscriptionContactMessageFilterInput
) {
  onUpdateContactMessage(filter: $filter) {
    createdAt
    email
    id
    message
    name
    newsletter
    priority
    recaptchaToken
    subject
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateContactMessageSubscriptionVariables,
  APITypes.OnUpdateContactMessageSubscription
>;
