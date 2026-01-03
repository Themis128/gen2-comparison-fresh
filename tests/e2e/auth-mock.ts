// Mock authentication for testing purposes
// This bypasses real Cognito authentication to allow tests to run

export const mockAuthConfig = {
  // Mock auth configuration that doesn't require real authentication
  auth: {
    user_pool_id: "mock-pool-id",
    aws_region: "us-east-1",
    user_pool_client_id: "mock-client-id",
    identity_pool_id: "mock-identity-pool-id",
    mfa_methods: [],
    standard_required_attributes: ["email"],
    username_attributes: ["email"],
    user_verification_types: ["email"],
    groups: [],
    mfa_configuration: "NONE",
    password_policy: {
      min_length: 8,
      require_lowercase: true,
      require_numbers: true,
      require_symbols: true,
      require_uppercase: true
    },
    unauthenticated_identities_enabled: true
  }
};

export const mockDataConfig = {
  data: {
    url: "mock-graphql-endpoint",
    aws_region: "us-east-1",
    default_authorization_type: "API_KEY",
    authorization_types: ["API_KEY"],
    model_introspection: {
      version: 1,
      models: {},
      enums: {},
      nonModels: {}
    }
  },
  version: "1.4"
};

// Mock Amplify client for testing
export const createMockClient = () => {
  return {
    models: {
      Todo: {
        list: async () => ({ data: [] }),
        create: async (data: any) => ({ data }),
        update: async (data: any) => ({ data }),
        delete: async (id: string) => ({ id }),
        observeQuery: () => ({
          subscribe: ({ next }: any) => {
            next({ items: [] });
            return { unsubscribe: () => {} };
          }
        })
      }
    }
  };
};
