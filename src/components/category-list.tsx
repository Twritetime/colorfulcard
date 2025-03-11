"use client";

import Link from "next/link";
import { Grid3X3, ShoppingBag } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

interface Category {
  id: string;
  name: string;
  description?: string | null;
  _count: {
    products: number;
  };
}

interface CategoryListProps {
  categories: Category[];
}

export function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Card key={category.id} className="group hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
              <Grid3X3 />
            </div>
            <CardTitle>{category.name}</CardTitle>
            {category.description && (
              <CardDescription className="line-clamp-2">
                {category.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <ShoppingBag className="mr-2 h-4 w-4" />
              <span>{category._count.products} 个产品</span>
            </div>
          </CardContent>
          <CardFooter>
            <Link 
              href={`/categories/${category.id}`}
              className="text-sm text-primary group-hover:underline"
            >
              浏览产品 →
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
} 