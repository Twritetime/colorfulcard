"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product-card";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  minQuantity: number;
  images: {
    id: string;
    url: string;
    alt?: string;
  }[];
  category: {
    id: string;
    name: string;
  };
}

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">相关产品</h2>
        <Link
          href={`/categories/${products[0].category.id}`}
          className="flex items-center text-primary"
        >
          查看更多 <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
} 