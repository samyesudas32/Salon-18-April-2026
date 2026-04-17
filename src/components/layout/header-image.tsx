'use client';

import Image from 'next/image';
import { useApp } from '@/app/lib/store';
import { Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function HeaderImage() {
  const { uploadedPhoto, businessName } = useApp();

  return (
    <div className={cn(
        'relative flex items-center justify-center w-[563px] h-[120px] rounded-lg overflow-hidden',
        !uploadedPhoto && 'bg-muted/20 border-2 border-dashed border-border'
    )}>
      {uploadedPhoto ? (
        <Image
          src={uploadedPhoto}
          alt={`${businessName} header image`}
          fill
          className="object-cover"
        />
      ) : (
        <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
          <ImageIcon className="h-8 w-8 text-primary/30" />
          <p className="text-xs">
            No header image set. Upload one in Settings.
          </p>
        </div>
      )}
    </div>
  );
}
