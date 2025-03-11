import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { ProductGallery } from "./_components/product-gallery";
import { ProductInfo } from "./_components/product-info";
import { ProductInquiryForm } from "./_components/product-inquiry-form";
import { RelatedProducts } from "./_components/related-products";

interface ProductPageProps {
  params: {
    productId: string;
  };
}

async function getProduct(productId: string) {
  return db.product.findUnique({
    where: { id: productId },
    include: {
      category: true,
      images: true,
    },
  });
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.productId);

  if (!product) {
    return {
      title: "产品未找到",
    };
  }

  return {
    title: `${product.name} - 彩色卡片`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.productId);

  if (!product) {
    notFound();
  }

  // 获取相关产品
  const relatedProducts = await db.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    take: 4,
    include: {
      category: true,
      images: {
        take: 1,
      },
    },
  });

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
        <Link
          href={`/categories/${product.categoryId}`}
          className="hover:underline"
        >
          {product.category.name}
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span>{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <ProductGallery images={product.images} />
        <div className="space-y-8">
          <ProductInfo product={product} />
          <ProductInquiryForm productId={product.id} productName={product.name} />
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <RelatedProducts products={relatedProducts} />
      )}
    </div>
  );
} 