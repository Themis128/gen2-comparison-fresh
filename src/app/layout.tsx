import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gen2 Comparison Fresh',
  description: 'Your new page starts here',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
    <head>
      <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
    </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
