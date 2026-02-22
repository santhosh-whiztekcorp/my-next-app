'use client';

import * as React from 'react';
import {
  Upload,
  X,
  File,
  FileText,
  Image as ImageIcon,
  Music,
  Video,
  AlertCircle,
  FileArchive,
  Terminal,
  ExternalLink,
  Play,
  Pause,
} from 'lucide-react';
import Image from 'next/image';

const formatBytes = (bytes: number, decimals: number = 1) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export type FileExtension =
  | '.jpg'
  | '.jpeg'
  | '.png'
  | '.gif'
  | '.svg'
  | '.webp'
  | '.pdf'
  | '.doc'
  | '.docx'
  | '.xls'
  | '.xlsx'
  | '.ppt'
  | '.pptx'
  | '.txt'
  | '.csv'
  | '.zip'
  | '.rar'
  | '.7z'
  | '.tar'
  | '.mp3'
  | '.wav'
  | '.mp4'
  | '.mov'
  | '.avi'
  | '.json'
  | '.js'
  | '.ts'
  | '.tsx'
  | '.css'
  | '.html'
  | (string & {});

export interface FileUploaderProps {
  accept?: string;
  extensions?: FileExtension[];
  multiple?: boolean;
  maxSize?: number;
  onFilesChange?: (files: File[]) => void;
  className?: string;
  title?: string;
  description?: string;
  value?: File[];
  classNames?: {
    dropzone?: string;
    fileList?: string;
    fileItem?: string;
    fileItemInfo?: string;
    fileItemName?: string;
    fileItemSize?: string;
    fileItemPreview?: string;
    fileItemActions?: string;
    iconContainer?: string;
    icon?: string;
    previewContainer?: string;
    previewInfo?: string;
    previewName?: string;
    previewSize?: string;
    previewActions?: string;
    previewChangeButton?: string;
    previewRemoveButton?: string;
  };
  icon?: React.ElementType;
}

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const FilePreview = ({ file, className }: { file: File; className?: string }) => {
  const [preview, setPreview] = React.useState<string | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  React.useEffect(() => {
    const isMedia = file.type.startsWith('image/') || file.type.startsWith('video/') || file.type.startsWith('audio/');

    if (isMedia) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const togglePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (preview) {
    if (file.type.startsWith('image/')) {
      return (
        <div className={cn('relative size-full overflow-hidden rounded-lg', className)}>
          <Image src={preview} alt={file.name} fill className="object-cover" unoptimized />
        </div>
      );
    }

    if (file.type.startsWith('video/')) {
      return (
        <video
          src={preview}
          className={cn('size-full rounded-lg object-cover', className)}
          controls={true}
          muted
          autoPlay
          loop
        />
      );
    }

    if (file.type.startsWith('audio/')) {
      return (
        <div className={cn('relative flex size-full flex-col items-center justify-center gap-6 px-8', className)}>
          <div className="group/audio relative flex flex-col items-center gap-4">
            <div className="relative">
              <div
                className={cn(
                  'bg-primary/10 absolute -inset-4 rounded-full blur-2xl transition-all duration-500',
                  isPlaying ? 'scale-150 animate-pulse opacity-100' : 'scale-100 opacity-0',
                )}
              />
              <div
                className={cn(
                  'bg-primary/10 text-primary flex size-16 items-center justify-center rounded-full transition-all duration-300',
                  isPlaying ? 'scale-110 shadow-[0_0_30px_rgba(var(--primary),0.2)]' : 'hover:bg-primary/20',
                )}
              >
                <Music className={cn('size-8', isPlaying && 'animate-bounce')} />
              </div>
              <Button
                size="icon"
                variant="default"
                className="absolute -right-1 -bottom-1 size-8 rounded-full shadow-lg transition-transform active:scale-90"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
              </Button>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2" onClick={(e) => e.stopPropagation()}>
            <Slider
              value={[currentTime]}
              max={duration}
              step={0.1}
              onValueChange={(vals) => {
                if (audioRef.current) {
                  audioRef.current.currentTime = vals[0];
                  setCurrentTime(vals[0]);
                }
              }}
              className="w-full"
            />
            <div className="text-muted-foreground flex items-center justify-between text-[10px] font-medium tracking-widest uppercase">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <audio
            ref={audioRef}
            src={preview}
            className="hidden"
            onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
            onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
            onEnded={() => setIsPlaying(false)}
          />
        </div>
      );
    }
  }

  const extension = `.${file.name.split('.').pop()?.toLowerCase()}`;
  return (
    <div className={cn('flex size-full items-center justify-center', className)}>
      <FileIcon type={file.type} extension={extension} />
    </div>
  );
};

const FileIcon = ({ type, extension }: { type: string; extension: string }) => {
  const size = 'size-5';
  if (type.startsWith('image/')) return <ImageIcon className={cn(size, 'text-blue-500')} />;
  if (type.startsWith('video/')) return <Video className={cn(size, 'text-purple-500')} />;
  if (type.startsWith('audio/')) return <Music className={cn(size, 'text-pink-500')} />;
  if (type === 'application/pdf') return <FileText className={cn(size, 'text-red-500')} />;
  if (['.zip', '.rar', '.7z', '.tar'].includes(extension))
    return <FileArchive className={cn(size, 'text-orange-500')} />;
  if (['.js', '.ts', '.tsx', '.py', '.rb', '.go'].includes(extension))
    return <Terminal className={cn(size, 'text-green-500')} />;
  return <File className={cn(size, 'text-gray-400')} />;
};

export function FileUploader({
  accept,
  extensions,
  multiple = false,
  maxSize,
  onFilesChange,
  className,
  title = 'Select files to upload',
  description = 'Drag and drop or click to browse',
  value,
  classNames,
  icon: Icon = Upload,
}: FileUploaderProps) {
  const [internalFiles, setInternalFiles] = React.useState<File[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const files = value !== undefined ? value : internalFiles;

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize) {
      return `File "${file.name}" is too large (${formatBytes(file.size)}). Max limit: ${formatBytes(maxSize)}`;
    }

    if (extensions && extensions.length > 0) {
      const ext = `.${file.name.split('.').pop()?.toLowerCase()}`;
      const normalizedExtensions = extensions.map((e) => (e.startsWith('.') ? e : `.${e}`).toLowerCase());
      if (!normalizedExtensions.includes(ext)) {
        return `File "${file.name}" has invalid extension. Allowed: ${extensions.join(', ')}`;
      }
    }

    return null;
  };

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles || newFiles.length === 0) return;
    setError(null);

    const fileList = Array.from(newFiles);
    const validFiles: File[] = [];
    let firstError: string | null = null;

    for (const file of fileList) {
      const errorMsg = validateFile(file);
      if (errorMsg) {
        if (!firstError) firstError = errorMsg;
      } else {
        validFiles.push(file);
      }
    }

    if (firstError) setError(firstError);

    const finalFiles = multiple ? [...files, ...validFiles] : validFiles;
    if (value === undefined) {
      setInternalFiles(finalFiles);
    }
    onFilesChange?.(finalFiles);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    const finalFiles = files.filter((_, i) => i !== index);
    if (value === undefined) {
      setInternalFiles(finalFiles);
    }
    onFilesChange?.(finalFiles);
  };

  const clearAll = () => {
    if (value === undefined) {
      setInternalFiles([]);
    }
    onFilesChange?.([]);
  };

  const isSingleAndSelected = !multiple && files.length > 0;

  return (
    <div className={cn('flex w-full flex-col gap-4', className)}>
      <div
        className={cn(
          'ring-offset-background group border-border relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-10 transition-all duration-300',
          isDragging
            ? 'border-primary bg-primary/5 ring-primary/20 scale-[0.99] ring-2'
            : 'hover:border-primary/40 hover:bg-accent/30',
          isSingleAndSelected ? 'cursor-default border border-solid p-0' : 'cursor-pointer',
          error && 'border-destructive/30 bg-destructive/5',
          classNames?.dropzone,
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => {
          if (!isSingleAndSelected) {
            fileInputRef.current?.click();
          }
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple={multiple}
          accept={accept}
          onChange={(e) => handleFiles(e.target.files)}
        />

        {isSingleAndSelected ? (
          <div className="flex w-full flex-col items-center">
            <div
              className={cn(
                'relative flex aspect-video w-full items-center justify-center overflow-hidden p-4 transition-all',
                classNames?.previewContainer,
              )}
            >
              <FilePreview file={files[0]} />
            </div>

            <div className="flex w-full items-center justify-between gap-4 border-t p-4">
              <div className={cn('flex min-w-0 flex-col gap-1 text-left', classNames?.previewInfo)}>
                <h4 className={cn('truncate text-sm leading-tight font-semibold', classNames?.previewName)}>
                  {files[0].name}
                </h4>
                <p
                  className={cn(
                    'text-muted-foreground text-[10px] font-medium tracking-wider uppercase',
                    classNames?.previewSize,
                  )}
                >
                  {formatBytes(files[0].size)} • {files[0].name.split('.').pop()?.toUpperCase()}
                </p>
              </div>

              <div className={cn('flex shrink-0 items-center gap-2', classNames?.previewActions)}>
                <Button
                  variant="outline"
                  size="default"
                  className={cn('text-xs', classNames?.previewChangeButton)}
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  Change
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className={cn('', classNames?.previewRemoveButton)}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(0);
                  }}
                >
                  <X className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div
              className={cn(
                'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex size-14 items-center justify-center rounded-2xl shadow-[0_0_20px_rgba(var(--primary),0.1)] transition-transform duration-300 group-hover:scale-110',
                classNames?.iconContainer,
              )}
            >
              <Icon className={cn('size-6 transition-all group-hover:-translate-y-1', classNames?.icon)} />
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <h3 className="text-foreground text-sm font-semibold tracking-tight">{title}</h3>
              <p className="text-muted-foreground text-xs leading-none">{description}</p>
            </div>
          </>
        )}

        {error && (
          <div className="animate-in fade-in slide-in-from-top-2 bg-destructive/10 text-destructive ring-destructive/20 mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-medium ring-1">
            <AlertCircle className="size-3.5" />
            {error}
          </div>
        )}
      </div>

      {multiple && files.length > 0 && (
        <div className={cn('animate-in fade-in slide-in-from-bottom-2 flex flex-col gap-2', classNames?.fileList)}>
          <div className="flex items-center justify-between px-1">
            <span className="text-muted-foreground/70 text-[11px] font-bold">Selected Files ({files.length})</span>
            <Button
              variant="ghost"
              size="xs"
              onClick={clearAll}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive h-6 text-[10px] font-bold tracking-wider uppercase"
            >
              Clear All
            </Button>
          </div>

          <div className="grid gap-2">
            {files.map((file, i) => {
              const extension = `.${file.name.split('.').pop()?.toLowerCase()}`;
              return (
                <div
                  key={`${file.name}-${i}`}
                  className={cn(
                    'group border-border/50 bg-background/50 hover:border-primary/20 hover:bg-accent/20 relative flex items-center justify-between rounded-xl border p-3 backdrop-blur-sm transition-all',
                    classNames?.fileItem,
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'bg-accent group-hover:bg-primary/10 flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg transition-colors',
                        classNames?.fileItemPreview,
                      )}
                    >
                      <FilePreview file={file} />
                    </div>
                    <div className={cn('flex flex-col gap-0.5', classNames?.fileItemInfo)}>
                      <span
                        className={cn(
                          'max-w-[180px] truncate text-sm leading-none font-medium sm:max-w-[300px]',
                          classNames?.fileItemName,
                        )}
                      >
                        {file.name}
                      </span>
                      <span className={cn('text-muted-foreground text-[10px] font-medium', classNames?.fileItemSize)}>
                        {formatBytes(file.size)} • {extension.toUpperCase().slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className={cn('flex items-center gap-1', classNames?.fileItemActions)}>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      asChild
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <a href={URL.createObjectURL(file)} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="size-3" />
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(i);
                      }}
                      className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      <X className="size-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
