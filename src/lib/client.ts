import { generateClient } from "aws-amplify/api";
// Note: Schema will be available when Amplify Gen2 data resource is configured
// import { Schema } from "../amplify/data/resource";
// import { createAIHooks } from "@aws-amplify/ui-react-ai";
import { Amplify } from "aws-amplify";
import outputs from '../../amplify_outputs.json';

// Configure Amplify with outputs
Amplify.configure(outputs, { ssr: true });

// Basic client without schema for now
export const client = generateClient({ authMode: "userPool" });

// AI hooks will be available when data schema is configured
// export const { useAIConversation, useAIGeneration } = createAIHooks(client);
