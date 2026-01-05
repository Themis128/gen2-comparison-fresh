export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero skeleton */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Name skeleton */}
            <div className="mb-8 space-y-6">
              <div className="h-16 md:h-20 bg-muted/50 rounded-lg animate-pulse mx-auto max-w-md" />
              <div className="h-8 bg-muted/40 rounded-lg animate-pulse mx-auto max-w-sm" />
              <div className="h-6 bg-muted/30 rounded-lg animate-pulse mx-auto max-w-2xl" />
            </div>
            
            {/* Button skeletons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="h-12 w-36 bg-blue-500/30 rounded-lg animate-pulse" />
              <div className="h-12 w-36 bg-muted/40 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Content skeleton */}
      <div className="container mx-auto px-6 py-16 space-y-8">
        <div className="h-64 bg-muted/30 rounded-2xl animate-pulse" />
        <div className="h-48 bg-muted/20 rounded-2xl animate-pulse" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="h-40 bg-muted/25 rounded-xl animate-pulse" />
          <div className="h-40 bg-muted/25 rounded-xl animate-pulse" />
          <div className="h-40 bg-muted/25 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
