"use client";

import Link from "next/link";
import { ListChecks, Tag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  minQuantity: number;
  features: string | null;
  category: {
    id: string;
    name: string;
  };
}

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  // 解析产品特点，假设以逗号分隔
  const productFeatures = product.features
    ? product.features.split(",").map((feature) => feature.trim())
    : [];

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/categories/${product.category.id}`}
          className="text-sm font-medium text-muted-foreground hover:text-primary"
        >
          {product.category.name}
        </Link>
        <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
        <Badge variant="secondary">最小订量: {product.minQuantity}</Badge>
      </div>

      <Separator />

      <div>
        <h2 className="text-lg font-semibold mb-3">产品描述</h2>
        <p className="text-muted-foreground">{product.description}</p>
      </div>

      {productFeatures.length > 0 && (
        <>
          <Separator />
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center">
              <ListChecks className="mr-2 h-5 w-5" />
              产品特点
            </h2>
            <ul className="space-y-2">
              {productFeatures.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      <Separator />

      <div className="space-y-2">
        <div className="flex items-center text-sm">
          <Tag className="mr-2 h-4 w-4" />
          <span className="text-muted-foreground">产品编号：</span>
          <span className="ml-2 font-medium">{product.id.substring(0, 8)}</span>
        </div>
      </div>
    </div>
  );
} 