import { Spinner } from '@/components/ui/spinner';

export default function Loading() {
  return (
    <div className="animate-in fade-in flex min-h-[70vh] w-full flex-col items-center justify-center gap-4 duration-500">
      <div className="relative flex items-center justify-center">
        <div className="bg-primary/20 absolute h-12 w-12 animate-ping rounded-full duration-1000" />
        <Spinner className="text-primary h-8 w-8" />
      </div>
      <p className="text-muted-foreground animate-pulse text-sm font-medium">Loading amazing things...</p>
    </div>
  );
}
