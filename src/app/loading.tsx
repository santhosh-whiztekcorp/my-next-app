import { LucideLoader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="relative flex min-h-[80vh] w-full flex-col items-center justify-center overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 dark:opacity-30">
        <div className="bg-primary absolute -top-20 -left-20 h-64 w-64 animate-pulse rounded-full blur-[100px]" />
        <div className="bg-secondary absolute -right-20 -bottom-20 h-64 w-64 animate-pulse rounded-full blur-[100px] delay-700" />
      </div>

      <div className="bg-background/40 border-border/50 hover:border-primary/30 relative z-10 flex flex-col items-center gap-6 rounded-3xl border p-12 shadow-2xl backdrop-blur-xl transition-all duration-500">
        <div className="bg-primary/10 ring-primary/20 flex h-20 w-20 items-center justify-center rounded-2xl ring-1">
          <LucideLoader2 className="text-primary h-10 w-10 animate-spin" />
        </div>

        <div className="space-y-1 text-center">
          <h3 className="text-xl font-semibold tracking-tight">Loading</h3>
          <p className="text-muted-foreground text-sm">Getting things ready...</p>
        </div>
      </div>
    </div>
  );
}
