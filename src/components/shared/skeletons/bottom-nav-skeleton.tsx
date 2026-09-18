'use client';

export function BottomNavSkeleton() {
  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-[0_-4px_20px_rgba(153,105,248,0.1)]">
        <div className="grid grid-cols-4 h-16 max-w-lg mx-auto px-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center gap-1 h-full"
            >
              <div className="w-6 h-6 rounded-full bg-muted animate-pulse" />
              <div className="w-10 h-2 rounded bg-muted animate-pulse" />
            </div>
          ))}
        </div>
      </nav>
      <div className="h-16 md:hidden" />
    </>
  );
}
