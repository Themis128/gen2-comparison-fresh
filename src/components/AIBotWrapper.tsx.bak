'use client';

import dynamic from 'next/dynamic';

// Dynamically import AIBot to prevent SSR issues
const AIBot = dynamic(() => import('./AIBot'), {
  ssr: false,
  loading: () => null
});

const AIBotWrapper: React.FC = () => {
  return <AIBot />;
};

export default AIBotWrapper;
