import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { CategoryList } from "@/components/category-list";

export default async function HomePage() {
  // 获取最新产品
  const latestProducts = await db.product.findMany({
    take: 8,
    orderBy: {
      createdAt: "desc",
    },
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
      parentId: null,
    },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
    take: 6,
  });

  return (
    <div className="container py-8 space-y-16">
      {/* 顶部横幅 */}
      <section className="relative h-[500px] rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/20" />
        <div className="relative z-10 flex flex-col justify-center h-full p-8 md:p-16 text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">彩色卡片</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            专业的外贸B2B平台，连接全球买家和优质供应商
          </p>
          <div className="flex gap-4">
            <Button size="lg" asChild>
              <Link href="/products">浏览产品</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white" asChild>
              <Link href="/contact">联系我们</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 产品分类 */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">产品分类</h2>
          <Link href="/categories" className="flex items-center text-primary">
            查看全部 <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        <CategoryList categories={categories} />
      </section>

      {/* 最新产品 */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">最新产品</h2>
          <Link href="/products" className="flex items-center text-primary">
            查看全部 <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 关于我们 */}
      <section className="py-16 bg-muted rounded-xl">
        <div className="container text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">关于彩色卡片</h2>
          <p className="text-lg mb-8">
            彩色卡片是一家专业的外贸B2B平台，致力于为全球买家和优质供应商提供便捷、高效的对接服务。我们的平台汇聚了来自各行各业的优质产品，帮助企业拓展全球市场。
          </p>
          <Button size="lg" asChild>
            <Link href="/about">了解更多</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
