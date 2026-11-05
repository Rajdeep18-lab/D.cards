import React from 'react';

/**
 * Lightweight, high-performance page-level loading fallback.
 * Renders instantly without layout shift while lazy chunks are downloaded.
 */
export default function PageLoadingFallback() {
  return (
    <div 
      className="min-h-[55vh] w-full flex flex-col items-center justify-center p-6 select-none"
      aria-label="Loading page content"
      role="status"
    >
      <div className="relative flex items-center justify-center mb-4">
        {/* Ambient warm golden halo */}
        <div className="absolute w-12 h-12 rounded-full bg-amber-500/15 dark:bg-amber-400/10 blur-md pointer-events-none" />
        {/* Sleek branded spinner */}
        <div className="w-9 h-9 rounded-full border-2 border-slate-200 dark:border-slate-800 border-t-amber-500 dark:border-t-amber-400 animate-spin" />
      </div>
      <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400 animate-pulse">
        <span>Loading</span>
        <span className="inline-flex gap-0.5">
          <span className="w-1 h-1 rounded-full bg-amber-500 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1 h-1 rounded-full bg-amber-500 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1 h-1 rounded-full bg-amber-500 animate-bounce" />
        </span>
      </div>
    </div>
  );
}

