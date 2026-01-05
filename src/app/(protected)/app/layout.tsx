import NavigationWrapper from '@/components/NavigationWrapper';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavigationWrapper />
      {children}
    </>
  );
}
