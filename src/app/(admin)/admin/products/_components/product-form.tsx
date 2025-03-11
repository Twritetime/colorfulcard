"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload } from "@/components/ui/upload";
import { productSchema } from "@/lib/validations";
import { useFormState } from "@/hooks/use-form-state";
import type { z } from "zod";

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  initialData?: any;
}

type ProductForm = z.infer<typeof productSchema>;

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const { error, isLoading, setError, setLoading } = useFormState();
  const [categories, setCategories] = useState<Category[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      images: [],
    },
  });

  const images = watch("images") || [];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "获取分类列表失败");
      }

      setCategories(data.categories);
    } catch (error) {
      setError(error.message);
    }
  };

  const onSubmit = async (data: ProductForm) => {
    try {
      setLoading(true);
      const response = await fetch(
        initialData ? `/api/products/${initialData.id}` : "/api/products",
        {
          method: initialData ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "保存产品失败");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleImageUpload = (url: string) => {
    setValue("images", [...images, { url, alt: "" }]);
  };

  const handleImageRemove = (index: number) => {
    setValue(
      "images",
      images.filter((_, i) => i !== index)
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">产品名称</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryId">产品分类</Label>
            <Select
              value={watch("categoryId")}
              onValueChange={(value) => setValue("categoryId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-sm text-red-500">{errors.categoryId.message}</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">产品描述</Label>
          <Textarea id="description" {...register("description")} />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">价格</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="minQuantity">最小订量</Label>
            <Input
              id="minQuantity"
              type="number"
              {...register("minQuantity", { valueAsNumber: true })}
            />
            {errors.minQuantity && (
              <p className="text-sm text-red-500">{errors.minQuantity.message}</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="features">产品特点</Label>
          <Textarea id="features" {...register("features")} />
          {errors.features && (
            <p className="text-sm text-red-500">{errors.features.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>产品图片</Label>
          <div className="grid grid-cols-3 gap-4">
            {images.map((image, index) => (
              <Upload
                key={index}
                value={image.url}
                onChange={(url) =>
                  setValue(
                    "images",
                    images.map((img, i) =>
                      i === index ? { ...img, url } : img
                    )
                  )
                }
                onRemove={() => handleImageRemove(index)}
              />
            ))}
            {images.length < 5 && (
              <Upload onChange={handleImageUpload} />
            )}
          </div>
          {errors.images && (
            <p className="text-sm text-red-500">{errors.images.message}</p>
          )}
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "保存中..." : "保存产品"}
      </Button>
    </form>
  );
} 