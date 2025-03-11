import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProductForm } from "../../_components/product-form";

interface EditProductPageProps {
  params: {
    productId: string;
  };
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const product = await db.product.findUnique({
    where: { id: params.productId },
    include: {
      images: true,
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">编辑产品</h1>
      <ProductForm initialData={product} />
    </div>
  );
} 