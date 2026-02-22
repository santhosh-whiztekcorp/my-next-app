'use client';

import { useInfiniteQuery, type InfiniteData } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect, useMemo } from 'react';
import { LucideAlertCircle, Star, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';

import { ThemeToggle } from '@/components/shared/theme-switcher';

const PAGE_SIZE = 12;

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  category: string;
  thumbnail: string;
}

interface ProductResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export default function InfiniteLoadingExample() {
  const { ref, inView } = useInView();

  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery<
    ProductResponse,
    Error,
    InfiniteData<ProductResponse>,
    string[],
    number
  >({
    queryKey: ['products'],
    queryFn: async ({ pageParam }) => {
      const response = await fetch(`https://dummyjson.com/products?limit=${PAGE_SIZE}&skip=${pageParam}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return (await response.json()) as ProductResponse;
    },
    initialData: {
      pages: [],
      pageParams: [0],
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;
      return nextSkip >= lastPage.total ? undefined : nextSkip;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const products = useMemo(() => data?.pages.flatMap((page) => page.products) ?? [], [data]);

  const isInitialLoading = (data?.pages.length ?? 0) === 0 || (products.length === 0 && isFetching);
  const isEmpty = (data?.pages.length ?? 0) > 0 && products.length === 0 && !isFetching;

  if (isInitialLoading) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="ring-border flex flex-col overflow-hidden border-none shadow-none ring-1">
              <Skeleton className="aspect-video w-full" />
              <CardHeader className="gap-2 p-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <Alert>
          <LucideAlertCircle className="size-4" />
          <AlertTitle>No Products Found</AlertTitle>
          <AlertDescription>We couldn&apos;t find any products in the marketplace at the moment.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <Alert variant="destructive">
          <LucideAlertCircle className="size-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load products: {error.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-10 p-6">
      <header className="flex flex-col items-center justify-between gap-4 border-b pb-8 md:flex-row">
        <div className="space-y-1 text-center md:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Product Market</h1>
          <p className="text-muted-foreground text-lg">Exploring DummyJSON with Infinite Scrolling</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="px-4 py-1 text-sm font-semibold">
            {products.length} Products Loaded
          </Badge>
          <ThemeToggle />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <Card
            key={product.id}
            className="group hover:border-primary/50 flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="relative overflow-hidden">
              <AspectRatio ratio={16 / 10}>
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </AspectRatio>
              <div className="absolute top-2 right-2">
                <Badge className="bg-background/80 text-foreground backdrop-blur-md">
                  <Star className="mr-1 size-3 fill-yellow-400 text-yellow-400" />
                  {product.rating}
                </Badge>
              </div>
            </div>

            <CardHeader className="p-4 pb-2">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-primary text-xs font-bold tracking-widest uppercase">{product.category}</p>
                <p className="text-lg font-black tracking-tight">${product.price}</p>
              </div>
              <CardTitle className="group-hover:text-primary line-clamp-1 transition-colors">{product.title}</CardTitle>
            </CardHeader>

            <CardContent className="grow p-4 pt-0">
              <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">{product.description}</p>
            </CardContent>

            <CardFooter className="p-4 pt-0">
              <button className="bg-primary text-primary-foreground flex h-9 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90">
                <ShoppingCart className="size-4" />
                Add to Cart
              </button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div ref={ref} className="flex min-h-[160px] items-center justify-center py-16">
        {isFetchingNextPage ? (
          <div className="flex flex-col items-center gap-4">
            <Spinner className="text-primary size-10" />
            <p className="text-muted-foreground animate-pulse text-sm font-bold tracking-widest uppercase">
              Fetching next batch...
            </p>
          </div>
        ) : hasNextPage ? (
          <div className="bg-muted h-1 w-32 animate-pulse rounded-full" />
        ) : (
          <div className="bg-primary text-primary-foreground group flex flex-col items-center gap-2 rounded-2xl px-12 py-6 text-center shadow-xl transition-all hover:scale-105">
            <p className="text-2xl font-black">All products loaded!</p>
            <p className="text-primary-foreground/80 text-sm">
              You&apos;ve reached the absolute end of the marketplace 🎉
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
