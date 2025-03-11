import { Metadata } from "next";
import { notFound } from "next/navigation";
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
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CategoryPageProps {
  params: {
    categoryId: string;
  };
  searchParams: {
    page?: string;
    sort?: string;
  };
}

async function getCategory(categoryId: string) {
  return db.category.findUnique({
    where: { id: categoryId },
    include: {
      parent: true,
    },
  });
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const category = await getCategory(params.categoryId);

  if (!category) {
    return {
      title: "分类未找到",
    };
  }

  return {
    title: `${category.name} - 彩色卡片`,
    description: category.description || `浏览${category.name}分类下的所有产品`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const category = await getCategory(params.categoryId);

  if (!category) {
    notFound();
  }

  const page = Number(searchParams.page) || 1;
  const limit = 12;
  const sortOrder = searchParams.sort || "newest";

  // 构建排序条件
  const orderBy = {
    ...(sortOrder === "newest" && { createdAt: "desc" }),
    ...(sortOrder === "price-asc" && { price: "asc" }),
    ...(sortOrder === "price-desc" && { price: "desc" }),
  };

  // 获取产品总数
  const productsCount = await db.product.count({
    where: { categoryId: params.categoryId },
  });
  const totalPages = Math.ceil(productsCount / limit);

  // 获取产品列表
  const products = await db.product.findMany({
    where: { categoryId: params.categoryId },
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

  // 获取子分类
  const subcategories = await db.category.findMany({
    where: { parentId: params.categoryId },
    orderBy: {
      name: "asc",
    },
  });

  // 创建分页链接
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams();
    params.set("page", pageNumber.toString());
    if (sortOrder) params.set("sort", sortOrder);
    return `/categories/${category.id}?${params.toString()}`;
  };

  return (
    <div className="container py-8">
      <div className="flex items-center mb-6 text-sm">
        <Link href="/" className="hover:underline">
          首页
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/products" className="hover:underline">
          产品列表
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        {category.parent && (
          <>
            <Link
              href={`/categories/${category.parent.id}`}
              className="hover:underline"
            >
              {category.parent.name}
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
          </>
        )}
        <span>{category.name}</span>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{category.name}</h1>
            {category.description && (
              <p className="text-muted-foreground mt-2">{category.description}</p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                排序方式
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  href={`/categories/${category.id}?sort=newest`}
                  className={sortOrder === "newest" ? "font-medium" : ""}
                >
                  最新上架
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/categories/${category.id}?sort=price-asc`}
                  className={sortOrder === "price-asc" ? "font-medium" : ""}
                >
                  价格低到高
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/categories/${category.id}?sort=price-desc`}
                  className={sortOrder === "price-desc" ? "font-medium" : ""}
                >
                  价格高到低
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {subcategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {subcategories.map((subcat) => (
              <Link
                key={subcat.id}
                href={`/categories/${subcat.id}`}
                className="px-4 py-2 bg-muted rounded-full text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {subcat.name}
              </Link>
            ))}
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">暂无产品</h2>
            <p className="text-muted-foreground mb-6">
              该分类下暂时没有产品，请尝试其他分类
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