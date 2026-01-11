/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createContactMessage = /* GraphQL */ `mutation CreateContactMessage(
  $condition: ModelContactMessageConditionInput
  $input: CreateContactMessageInput!
) {
  createContactMessage(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateContactMessageMutationVariables,
  APITypes.CreateContactMessageMutation
>;
export const deleteContactMessage = /* GraphQL */ `mutation DeleteContactMessage(
  $condition: ModelContactMessageConditionInput
  $input: DeleteContactMessageInput!
) {
  deleteContactMessage(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteContactMessageMutationVariables,
  APITypes.DeleteContactMessageMutation
>;
export const updateContactMessage = /* GraphQL */ `mutation UpdateContactMessage(
  $condition: ModelContactMessageConditionInput
  $input: UpdateContactMessageInput!
) {
  updateContactMessage(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateContactMessageMutationVariables,
  APITypes.UpdateContactMessageMutation
>;
