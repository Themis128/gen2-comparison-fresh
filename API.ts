/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type ContactMessage = {
  __typename: "ContactMessage",
  createdAt: string,
  email?: string | null,
  id: string,
  message?: string | null,
  name?: string | null,
  newsletter?: boolean | null,
  priority?: string | null,
  recaptchaToken?: string | null,
  subject?: string | null,
  updatedAt: string,
};

export type ModelContactMessageFilterInput = {
  and?: Array< ModelContactMessageFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  email?: ModelStringInput | null,
  id?: ModelIDInput | null,
  message?: ModelStringInput | null,
  name?: ModelStringInput | null,
  newsletter?: ModelBooleanInput | null,
  not?: ModelContactMessageFilterInput | null,
  or?: Array< ModelContactMessageFilterInput | null > | null,
  priority?: ModelStringInput | null,
  recaptchaToken?: ModelStringInput | null,
  subject?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelStringInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  _null = "_null",
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
}


export type ModelSizeInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelIDInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export type ModelBooleanInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  eq?: boolean | null,
  ne?: boolean | null,
};

export type ModelContactMessageConnection = {
  __typename: "ModelContactMessageConnection",
  items:  Array<ContactMessage | null >,
  nextToken?: string | null,
};

export type ModelContactMessageConditionInput = {
  and?: Array< ModelContactMessageConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  email?: ModelStringInput | null,
  message?: ModelStringInput | null,
  name?: ModelStringInput | null,
  newsletter?: ModelBooleanInput | null,
  not?: ModelContactMessageConditionInput | null,
  or?: Array< ModelContactMessageConditionInput | null > | null,
  priority?: ModelStringInput | null,
  recaptchaToken?: ModelStringInput | null,
  subject?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateContactMessageInput = {
  email?: string | null,
  id?: string | null,
  message?: string | null,
  name?: string | null,
  newsletter?: boolean | null,
  priority?: string | null,
  recaptchaToken?: string | null,
  subject?: string | null,
};

export type DeleteContactMessageInput = {
  id: string,
};

export type UpdateContactMessageInput = {
  email?: string | null,
  id: string,
  message?: string | null,
  name?: string | null,
  newsletter?: boolean | null,
  priority?: string | null,
  recaptchaToken?: string | null,
  subject?: string | null,
};

export type ModelSubscriptionContactMessageFilterInput = {
  and?: Array< ModelSubscriptionContactMessageFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  message?: ModelSubscriptionStringInput | null,
  name?: ModelSubscriptionStringInput | null,
  newsletter?: ModelSubscriptionBooleanInput | null,
  or?: Array< ModelSubscriptionContactMessageFilterInput | null > | null,
  priority?: ModelSubscriptionStringInput | null,
  recaptchaToken?: ModelSubscriptionStringInput | null,
  subject?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionStringInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIDInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionBooleanInput = {
  eq?: boolean | null,
  ne?: boolean | null,
};

export type GetContactMessageQueryVariables = {
  id: string,
};

export type GetContactMessageQuery = {
  getContactMessage?:  {
    __typename: "ContactMessage",
    createdAt: string,
    email?: string | null,
    id: string,
    message?: string | null,
    name?: string | null,
    newsletter?: boolean | null,
    priority?: string | null,
    recaptchaToken?: string | null,
    subject?: string | null,
    updatedAt: string,
  } | null,
};

export type ListContactMessagesQueryVariables = {
  filter?: ModelContactMessageFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListContactMessagesQuery = {
  listContactMessages?:  {
    __typename: "ModelContactMessageConnection",
    items:  Array< {
      __typename: "ContactMessage",
      createdAt: string,
      email?: string | null,
      id: string,
      message?: string | null,
      name?: string | null,
      newsletter?: boolean | null,
      priority?: string | null,
      recaptchaToken?: string | null,
      subject?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type CreateContactMessageMutationVariables = {
  condition?: ModelContactMessageConditionInput | null,
  input: CreateContactMessageInput,
};

export type CreateContactMessageMutation = {
  createContactMessage?:  {
    __typename: "ContactMessage",
    createdAt: string,
    email?: string | null,
    id: string,
    message?: string | null,
    name?: string | null,
    newsletter?: boolean | null,
    priority?: string | null,
    recaptchaToken?: string | null,
    subject?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteContactMessageMutationVariables = {
  condition?: ModelContactMessageConditionInput | null,
  input: DeleteContactMessageInput,
};

export type DeleteContactMessageMutation = {
  deleteContactMessage?:  {
    __typename: "ContactMessage",
    createdAt: string,
    email?: string | null,
    id: string,
    message?: string | null,
    name?: string | null,
    newsletter?: boolean | null,
    priority?: string | null,
    recaptchaToken?: string | null,
    subject?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateContactMessageMutationVariables = {
  condition?: ModelContactMessageConditionInput | null,
  input: UpdateContactMessageInput,
};

export type UpdateContactMessageMutation = {
  updateContactMessage?:  {
    __typename: "ContactMessage",
    createdAt: string,
    email?: string | null,
    id: string,
    message?: string | null,
    name?: string | null,
    newsletter?: boolean | null,
    priority?: string | null,
    recaptchaToken?: string | null,
    subject?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateContactMessageSubscriptionVariables = {
  filter?: ModelSubscriptionContactMessageFilterInput | null,
};

export type OnCreateContactMessageSubscription = {
  onCreateContactMessage?:  {
    __typename: "ContactMessage",
    createdAt: string,
    email?: string | null,
    id: string,
    message?: string | null,
    name?: string | null,
    newsletter?: boolean | null,
    priority?: string | null,
    recaptchaToken?: string | null,
    subject?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteContactMessageSubscriptionVariables = {
  filter?: ModelSubscriptionContactMessageFilterInput | null,
};

export type OnDeleteContactMessageSubscription = {
  onDeleteContactMessage?:  {
    __typename: "ContactMessage",
    createdAt: string,
    email?: string | null,
    id: string,
    message?: string | null,
    name?: string | null,
    newsletter?: boolean | null,
    priority?: string | null,
    recaptchaToken?: string | null,
    subject?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateContactMessageSubscriptionVariables = {
  filter?: ModelSubscriptionContactMessageFilterInput | null,
};

export type OnUpdateContactMessageSubscription = {
  onUpdateContactMessage?:  {
    __typename: "ContactMessage",
    createdAt: string,
    email?: string | null,
    id: string,
    message?: string | null,
    name?: string | null,
    newsletter?: boolean | null,
    priority?: string | null,
    recaptchaToken?: string | null,
    subject?: string | null,
    updatedAt: string,
  } | null,
};
