import React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '../ui/button';
import { ExpandIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ImagePreviewerProps {
  src: string | string[] | { url: string; alt?: string }[];
  alt?: string;
  classNames?: {
    container?: string;
    image?: string;
  };
}

export const ImagePreviewer = ({ src, alt, classNames }: ImagePreviewerProps) => {
  const [open, setOpen] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [thumbnailApi, setThumbnailApi] = React.useState<CarouselApi>();

  React.useEffect(() => {
    if (!thumbnailApi) return;
    const onSelect = () => setCurrentIndex(thumbnailApi.selectedScrollSnap());
    thumbnailApi.on('select', onSelect);
    return () => {
      thumbnailApi.off('select', onSelect);
    };
  }, [thumbnailApi]);

  const isSingleImage = typeof src === 'string';
  const isStringArrayImages = Array.isArray(src) && typeof src[0] === 'string';
  const isStructuredArrayImages = Array.isArray(src) && typeof src[0] === 'object';

  const images = isStringArrayImages ? (src as string[]) : ([] as string[]);
  const structuredImages = isStructuredArrayImages
    ? (src as { url: string; alt?: string }[])
    : ([] as { url: string; alt?: string }[]);

  const showFullScreen = () => setOpen(true);

  return (
    <>
      <div className={cn('group relative overflow-hidden rounded-xl border-2', classNames?.container)}>
        {isSingleImage ? (
          <Image
            src={src}
            alt={alt || 'Image'}
            width={500}
            height={500}
            className={cn('h-auto w-auto object-contain', classNames?.image)}
          />
        ) : null}
        {isStructuredArrayImages || isStringArrayImages ? (
          <Carousel className="w-full" setApi={setThumbnailApi}>
            <CarouselContent>
              {isStringArrayImages
                ? images.map((image, index) => (
                    <CarouselItem key={index}>
                      <Image
                        src={image}
                        alt={alt || 'Image'}
                        width={500}
                        height={500}
                        className={cn('aspect-video h-auto w-auto object-cover', classNames?.image)}
                      />
                    </CarouselItem>
                  ))
                : null}
              {isStructuredArrayImages
                ? structuredImages.map((image, index) => (
                    <CarouselItem key={index}>
                      <Image
                        src={image.url}
                        alt={image.alt || 'Image'}
                        width={500}
                        height={500}
                        className={cn('aspect-video h-auto w-auto object-cover', classNames?.image)}
                      />
                    </CarouselItem>
                  ))
                : null}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        ) : null}
        <div className="absolute right-4 bottom-4 hidden group-hover:block">
          <Button variant="ghost" size="icon" onClick={showFullScreen}>
            <ExpandIcon />
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="h-full w-full gap-0 overflow-hidden border-none bg-transparent p-0 shadow-none sm:max-h-screen! sm:max-w-[100vw]!">
          <DialogHeader>
            <DialogTitle className="sr-only">Are you absolutely sure?</DialogTitle>
            <DialogDescription className="sr-only">
              This action cannot be undone. This will permanently delete your account and remove your data from our
              servers.
            </DialogDescription>
          </DialogHeader>
          {isSingleImage ? (
            <Image
              src={src}
              alt={alt || 'Image'}
              width={1920}
              height={1080}
              className={cn('h-auto w-full object-contain', classNames?.image)}
              unoptimized
            />
          ) : null}
          <div className="mx-auto h-full max-h-[90vh]! w-full max-w-[90vw] overflow-hidden rounded-xl">
            {isStructuredArrayImages || isStringArrayImages ? (
              <Carousel className="w-full" opts={{ startIndex: currentIndex }}>
                <CarouselContent>
                  {isStringArrayImages
                    ? images.map((image, index) => (
                        <CarouselItem key={index}>
                          <Image
                            src={image}
                            alt={alt || 'Image'}
                            width={1920}
                            height={1080}
                            className={cn('aspect-video w-full object-cover', classNames?.image)}
                            unoptimized
                          />
                        </CarouselItem>
                      ))
                    : null}
                  {isStructuredArrayImages
                    ? structuredImages.map((image, index) => (
                        <CarouselItem key={index}>
                          <Image
                            src={image.url}
                            alt={image.alt || 'Image'}
                            width={1920}
                            height={1080}
                            className={cn('aspect-video w-full object-cover', classNames?.image)}
                            unoptimized
                          />
                        </CarouselItem>
                      ))
                    : null}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
