import { generateClient } from 'aws-amplify/data'
import { Amplify } from 'aws-amplify'
import type { Schema } from '../../amplify/data/resource'
import outputs from '../../amplify_outputs.json'

// Configure Amplify before creating the client
Amplify.configure(outputs)

export const client = generateClient<Schema>()
