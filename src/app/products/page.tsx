import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Filter } from "lucide-react";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const metadata: Metadata = {
  title: "产品列表 - 彩色卡片",
  description: "浏览彩色卡片提供的各种产品",
};

interface ProductsPageProps {
  searchParams: {
    page?: string;
    category?: string;
    sort?: string;
  };
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const page = Number(searchParams.page) || 1;
  const limit = 12;
  const categoryId = searchParams.category || undefined;
  const sortOrder = searchParams.sort || "newest";

  // 构建查询条件
  const where = {
    ...(categoryId && { categoryId }),
  };

  // 构建排序条件
  const orderBy = {
    ...(sortOrder === "newest" && { createdAt: "desc" }),
    ...(sortOrder === "price-asc" && { price: "asc" }),
    ...(sortOrder === "price-desc" && { price: "desc" }),
  };

  // 获取产品总数
  const productsCount = await db.product.count({ where });
  const totalPages = Math.ceil(productsCount / limit);

  // 获取产品列表
  const products = await db.product.findMany({
    where,
    orderBy,
    skip: (page - 1) * limit,
    take: limit,
    include: {
      category: true,
      images: {
        take: 1,
      },
    },
  });

  // 获取分类列表
  const categories = await db.category.findMany({
    where: {
      parent: null,
    },
    orderBy: {
      name: "asc",
    },
  });

  // 创建分页链接
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams();
    params.set("page", pageNumber.toString());
    if (categoryId) params.set("category", categoryId);
    if (sortOrder) params.set("sort", sortOrder);
    return `/products?${params.toString()}`;
  };

  return (
    <div className="container py-8">
      <div className="flex items-center mb-6 text-sm">
        <Link href="/" className="hover:underline">
          首页
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span>产品列表</span>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">产品列表</h1>
          <div className="flex gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  分类筛选
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>选择分类</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/products">全部分类</Link>
                  </DropdownMenuItem>
                  {categories.map((category) => (
                    <DropdownMenuItem key={category.id} asChild>
                      <Link
                        href={`/products?category=${category.id}`}
                        className={
                          categoryId === category.id
                            ? "bg-primary/10 font-medium"
                            : ""
                        }
                      >
                        {category.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  排序方式
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link
                    href={`/products?${
                      categoryId ? `category=${categoryId}&` : ""
                    }sort=newest`}
                    className={sortOrder === "newest" ? "font-medium" : ""}
                  >
                    最新上架
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/products?${
                      categoryId ? `category=${categoryId}&` : ""
                    }sort=price-asc`}
                    className={sortOrder === "price-asc" ? "font-medium" : ""}
                  >
                    价格低到高
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/products?${
                      categoryId ? `category=${categoryId}&` : ""
                    }sort=price-desc`}
                    className={sortOrder === "price-desc" ? "font-medium" : ""}
                  >
                    价格高到低
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">暂无产品</h2>
            <p className="text-muted-foreground mb-6">
              暂时没有符合条件的产品，请尝试其他分类或搜索条件
            </p>
            <Button asChild>
              <Link href="/products">查看全部产品</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <Pagination className="mt-8">
            <PaginationContent>
              {page > 1 && (
                <PaginationItem>
                  <PaginationPrevious href={createPageURL(page - 1)} />
                </PaginationItem>
              )}

              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (page <= 3) {
                  pageNumber = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = page - 2 + i;
                }

                if (
                  totalPages > 5 &&
                  ((pageNumber === 1 && page > 3) ||
                    (pageNumber === totalPages && page < totalPages - 2))
                ) {
                  return (
                    <PaginationItem key={i}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                return (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href={createPageURL(pageNumber)}
                      isActive={page === pageNumber}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              {page < totalPages && (
                <PaginationItem>
                  <PaginationNext href={createPageURL(page + 1)} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
} 