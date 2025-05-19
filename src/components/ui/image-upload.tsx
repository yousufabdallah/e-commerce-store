'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  currentImage?: string;
}

export function ImageUpload({ onImageUpload, currentImage }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Create a preview URL for the selected image
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreviewUrl(result);

      // Store the data URL directly in localStorage
      // This way we can display the actual image without needing a server

      // Pass the data URL to the parent component
      onImageUpload(result);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // If currentImage is a data URL, use it directly
  useEffect(() => {
    if (currentImage && (currentImage.startsWith('data:') || currentImage === '/placeholder.png')) {
      setPreviewUrl(currentImage);
    }
  }, [currentImage]);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Button
          type="button"
          onClick={handleButtonClick}
          disabled={isUploading}
          variant="outline"
        >
          {isUploading ? 'Uploading...' : 'Select Image'}
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <p className="text-sm text-gray-500">
          {previewUrl ? 'Image selected' : 'No image selected'}
        </p>
      </div>

      {previewUrl && (
        <div className="relative w-full max-w-md h-48 border rounded-md overflow-hidden">
          <Image
            src={previewUrl}
            alt="Preview"
            fill
            style={{ objectFit: 'contain' }}
            unoptimized={previewUrl.startsWith('data:')}
          />
        </div>
      )}

      <p className="text-xs text-gray-500">
        Note: Images are stored directly in localStorage as data URLs.
        This means they will persist between sessions but may take up storage space.
      </p>
    </div>
  );
}
