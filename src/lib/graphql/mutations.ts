export const createContact = /* GraphQL */ `
  mutation CreateContact(
    $input: CreateContactInput!
    $condition: ModelContactConditionInput
  ) {
    createContact(input: $input, condition: $condition) {
      id
      name
      email
      message
      createdAt
      updatedAt
    }
  }
`;

export const sendContact = /* GraphQL */ `
  mutation SendContact(
    $name: String!
    $email: String!
    $message: String!
  ) {
    sendContact(name: $name, email: $email, message: $message)
  }
`;
