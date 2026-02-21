import Link from 'next/link';
import { FileQuestion, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="animate-in fade-in zoom-in-95 flex min-h-[70vh] w-full flex-col items-center justify-center p-4 text-center duration-700">
      <div className="relative mb-8">
        <div className="bg-primary/10 absolute inset-0 animate-pulse rounded-full blur-3xl" />
        <div className="bg-muted border-border relative flex h-32 w-32 rotate-3 items-center justify-center rounded-2xl border shadow-2xl">
          <FileQuestion className="text-muted-foreground h-16 w-16" />
        </div>
        <div className="bg-primary text-primary-foreground absolute -right-2 -bottom-2 flex h-12 w-12 -rotate-12 items-center justify-center rounded-lg shadow-lg">
          <span className="text-xl font-bold">404</span>
        </div>
      </div>

      <h2 className="mb-3 text-3xl font-bold tracking-tight">Page not found</h2>
      <p className="text-muted-foreground mb-10 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved to a new location.
      </p>

      <Button asChild size="lg" className="hover:shadow-primary/20 rounded-full shadow-lg transition-all duration-300">
        <Link href="/">
          <Home className="mr-2 h-4 w-4" />
          Back to homepage
        </Link>
      </Button>
    </div>
  );
}
