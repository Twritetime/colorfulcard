"use client";

import { ProductForm } from "../_components/product-form";

export default function NewProductPage() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">添加产品</h1>
      <ProductForm />
    </div>
  );
} 