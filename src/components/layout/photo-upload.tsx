'use client';

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import Image from 'next/image';
import { UploadCloud, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function PhotoUpload() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files?.[0] || null);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files?.[0] || null);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const onRemoveImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      setImagePreview(null);
      if(fileInputRef.current) {
          fileInputRef.current.value = '';
      }
  }

  const triggerFileSelect = () => fileInputRef.current?.click();
  
  const onButtonClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      triggerFileSelect();
  }

  return (
    <div
      className={cn(
        'relative flex items-center justify-center w-[563px] h-[120px] rounded-lg border-2 border-dashed border-border bg-muted/20 text-center transition-all duration-300 overflow-hidden group/upload',
        {
          'border-primary bg-primary/10': isDragging,
          'border-transparent p-0': imagePreview,
        }
      )}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={!imagePreview ? triggerFileSelect : undefined}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        className="hidden"
        accept="image/*"
      />
      
      {imagePreview ? (
        <div className="group/preview relative w-full h-full">
            <Image
                src={imagePreview}
                alt="Upload preview"
                fill
                className="object-cover transition-transform duration-300 group-hover/preview:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300">
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={onButtonClick} className="bg-white/20 border-white/40 text-white hover:bg-white/30 hover:text-white">
                        <Edit className="mr-2 h-4 w-4" />
                        Change
                    </Button>
                     <Button variant="destructive" size="sm" onClick={onRemoveImage}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                    </Button>
                </div>
            </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-2 cursor-pointer text-muted-foreground group-hover/upload:text-primary transition-colors">
          <UploadCloud className="h-8 w-8 text-primary/50 group-hover/upload:text-primary transition-colors" />
          <p className="font-semibold text-primary/80">
            Click to upload or drag & drop
          </p>
          <p className="text-xs">PNG, JPG, or GIF (max 5MB)</p>
        </div>
      )}
    </div>
  );
}
