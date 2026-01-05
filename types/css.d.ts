// Type declarations for CSS imports

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// Side-effect CSS imports (no default export)
declare module '@aws-amplify/ui-react/styles.css';

