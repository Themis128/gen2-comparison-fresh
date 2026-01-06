export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          {/* Outer ring */}
          <div className="h-16 w-16 rounded-full border-4 border-primary/20" />
          {/* Spinning inner ring */}
          <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-primary" />
        </div>
        <p className="animate-pulse text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
