"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface ProductImage {
  url: string;
  alt?: string;
}

interface ProductCategory {
  id: string;
  name: string;
}

interface ProductProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    minQuantity: number;
    images: ProductImage[];
    category: ProductCategory;
  };
}

export function ProductCard({ product }: ProductProps) {
  const { id, name, price, minQuantity, images, category } = product;
  const imageUrl = images[0]?.url || "/images/product-placeholder.png";
  
  return (
    <Card className="overflow-hidden h-full flex flex-col group">
      <Link href={`/products/${id}`} className="block overflow-hidden relative aspect-square">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform group-hover:scale-105"
        />
      </Link>
      <CardContent className="flex-1 p-4">
        <div className="space-y-1">
          <Link 
            href={`/categories/${category.id}`}
            className="text-xs text-muted-foreground hover:underline"
          >
            {category.name}
          </Link>
          <Link href={`/products/${id}`} className="block">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary">
              {name}
            </h3>
          </Link>
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-lg">{formatPrice(price)}</span>
            <span className="text-xs text-muted-foreground">
              最小订量: {minQuantity}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="w-full flex items-center gap-2">
          <Button asChild variant="outline" className="w-full">
            <Link href={`/products/${id}`}>了解详情</Link>
          </Button>
          <Button asChild className="w-full">
            <Link href={`/inquiry?productId=${id}`}>立即询盘</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
} 