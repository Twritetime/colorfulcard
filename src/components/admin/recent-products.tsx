"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ShoppingBag } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  createdAt: string;
  category: {
    id: string;
    name: string;
  };
}

export function RecentProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/products?limit=5");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "获取最近产品失败");
        }

        setProducts(data.products);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentProducts();
  }, []);

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>最新产品</CardTitle>
          <CardDescription>
            您最近添加的产品列表
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/products">查看全部</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4 items-start">
                <Skeleton className="h-16 w-16 rounded-md" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-4 text-muted-foreground">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            暂无产品数据
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-start gap-4 rounded-lg border p-3"
              >
                {product.images?.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-16 w-16 rounded-md object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-md bg-primary/10">
                    <ShoppingBag className="h-8 w-8 text-primary" />
                  </div>
                )}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm font-medium">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{format(new Date(product.createdAt), "yyyy-MM-dd")}</span>
                    <span>•</span>
                    <span>{product.category?.name || "未分类"}</span>
                  </div>
                  <Button
                    variant="link"
                    size="sm"
                    className="px-0 h-auto"
                    asChild
                  >
                    <Link href={`/admin/products/${product.id}`}>
                      查看详情
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 