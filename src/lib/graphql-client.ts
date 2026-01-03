import axios, { AxiosResponse } from 'axios';
import { getAmplifyConfig } from './amplify-client-config';

interface GraphQLResponse<T = unknown> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
  }>;
}

interface GraphQLError extends Error {
  response?: AxiosResponse;
  code?: string;
}

export class GraphQLClient {
  private endpoint: string;
  private apiKey: string;
  private timeout: number = 30000; // 30 seconds

  constructor() {
    const config = getAmplifyConfig();
    this.endpoint = (config as { data?: { url?: string } })?.data?.url || '';
    this.apiKey = (config as { data?: { api_key?: string } })?.data?.api_key || '';
  }

  async query<T = unknown>(
    query: string,
    variables?: Record<string, unknown>
  ): Promise<T> {
    const startTime = Date.now();

    try {
      console.log(`[GraphQLClient] Starting query at ${new Date().toISOString()}`);
      console.log(`[GraphQLClient] Endpoint: ${this.endpoint}`);
      console.log(`[GraphQLClient] Query: ${query.substring(0, 100)}...`);
      console.log(`[GraphQLClient] Variables:`, variables);

      const response: AxiosResponse<GraphQLResponse<T>> = await axios.post(
        this.endpoint,
        {
          query,
          variables,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
          },
          timeout: this.timeout,
        }
      );

      const duration = Date.now() - startTime;
      console.log(`[GraphQLClient] Query completed in ${duration}ms`);
      console.log(`[GraphQLClient] Response status: ${response.status}`);
      console.log(`[GraphQLClient] Response data:`, response.data);

      if (response.data.errors && response.data.errors.length > 0) {
        console.error(`[GraphQLClient] GraphQL errors:`, response.data.errors);
        const error = new Error(`GraphQL Error: ${response.data.errors[0].message}`) as GraphQLError;
        error.response = response;
        throw error;
      }

      if (!response.data.data) {
        console.error(`[GraphQLClient] No data in response:`, response.data);
        throw new Error('No data returned from GraphQL query');
      }

      return response.data.data;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[GraphQLClient] Query failed after ${duration}ms:`, error);

      if (axios.isAxiosError(error)) {
        console.error(`[GraphQLClient] Axios error details:`, {
          code: error.code,
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });

        const graphQLError = new Error(`HTTP ${error.response?.status}: ${error.message}`) as GraphQLError;
        graphQLError.response = error.response;
        graphQLError.code = error.code;
        throw graphQLError;
      }

      throw error;
    }
  }

  async mutation<T = unknown>(
    mutation: string,
    variables?: Record<string, unknown>
  ): Promise<T> {
    // Mutations use the same POST request structure as queries
    return this.query<T>(mutation, variables);
  }
}

// Export a singleton instance
export const graphqlClient = new GraphQLClient();