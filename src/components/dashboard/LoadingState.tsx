'use client';

export default function LoadingState() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
          {/* Skeleton Image */}
          <div className="aspect-video bg-neutral-200 animate-pulse" />
          
          {/* Skeleton Content */}
          <div className="flex flex-1 flex-col gap-3 px-4 py-4 sm:px-5 sm:py-5">
            {/* Category Badge */}
            <div className="h-6 w-20 rounded bg-neutral-200 animate-pulse" />
            
            {/* Title */}
            <div className="space-y-2">
              <div className="h-5 bg-neutral-200 rounded animate-pulse" />
              <div className="h-5 w-4/5 bg-neutral-200 rounded animate-pulse" />
            </div>
            
            {/* Description */}
            <div className="space-y-2 mt-2">
              <div className="h-4 bg-neutral-200 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-neutral-200 rounded animate-pulse" />
            </div>
            
            {/* Details */}
            <div className="mt-auto space-y-2 pt-2">
              <div className="h-4 w-1/2 bg-neutral-200 rounded animate-pulse" />
              <div className="h-4 bg-neutral-200 rounded animate-pulse" />
            </div>
            
            {/* Capacity bar */}
            <div className="pt-2 space-y-2 mt-3">
              <div className="h-4 w-1/3 bg-neutral-200 rounded animate-pulse" />
              <div className="h-1.5 w-full bg-neutral-200 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
