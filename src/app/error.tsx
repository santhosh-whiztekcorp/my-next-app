'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 flex min-h-[70vh] w-full flex-col items-center justify-center p-4 text-center duration-500">
      <div className="bg-destructive/10 text-destructive mb-6 flex h-20 w-20 items-center justify-center rounded-full">
        <AlertCircle className="h-10 w-10" />
      </div>
      <h2 className="mb-2 text-2xl font-bold tracking-tight">Something went wrong!</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        We apologize for the inconvenience. An unexpected error occurred while processing your request.
      </p>
      <div className="flex flex-col gap-3 min-[400px]:flex-row">
        <Button onClick={() => reset()} variant="default" size="lg" className="group transition-all duration-200">
          <RefreshCcw className="mr-2 h-4 w-4 transition-transform duration-500 group-hover:rotate-180" />
          Try again
        </Button>
        <Button onClick={() => router.push('/')} variant="outline" size="lg">
          Go back home
        </Button>
      </div>
      {error.digest && <p className="text-muted-foreground/50 mt-8 font-mono text-xs">Error ID: {error.digest}</p>}
    </div>
  );
}
