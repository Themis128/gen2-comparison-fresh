declare module '@21st-extension/extension-toolbar-srpc-contract' {
  export const DEFAULT_PORT: unknown;
  export const PING_ENDPOINT: unknown;
  export const PING_RESPONSE: unknown;
  export const contract: unknown;
  export const EventName: unknown;
  export function getExtensionBridge(...args: unknown[]): unknown;
  export function getToolbarBridge(...args: unknown[]): unknown;
  export type VSCodeContext = unknown;
  export type PromptRequest = unknown;
}

declare module '@21st-extension/srpc' {
  export const createSRPCClientBridge: unknown;
  export const createSRPCServerBridge: unknown;
  export type SRPC = unknown;
}
