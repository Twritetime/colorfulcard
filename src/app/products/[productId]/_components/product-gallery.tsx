"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductImage {
  id: string;
  url: string;
  alt?: string;
}

interface ProductGalleryProps {
  images: ProductImage[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square w-full bg-muted flex items-center justify-center rounded-lg">
        <p className="text-muted-foreground">暂无图片</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-lg border">
        <Image
          src={images[selectedImage].url}
          alt={images[selectedImage].alt || "产品图片"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              className={cn(
                "relative h-20 w-20 cursor-pointer overflow-hidden rounded-md border",
                selectedImage === index && "ring-2 ring-primary"
              )}
              onClick={() => setSelectedImage(index)}
            >
              <Image
                src={image.url}
                alt={image.alt || `产品图片 ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 