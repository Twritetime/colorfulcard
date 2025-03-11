"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categorySchema } from "@/lib/validations";
import { useFormState } from "@/hooks/use-form-state";
import type { z } from "zod";

interface Category {
  id: string;
  name: string;
  description: string | null;
  parentId: string | null;
}

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Category;
}

type CategoryForm = z.infer<typeof categorySchema>;

export function CategoryForm({
  open,
  onOpenChange,
  initialData,
}: CategoryFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const { error, isLoading, setError, setLoading, reset } = useFormState();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset: resetForm,
    formState: { errors },
  } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      parentId: null,
    },
  });

  useEffect(() => {
    if (open) {
      fetchCategories();
      if (initialData) {
        resetForm(initialData);
      } else {
        resetForm({
          name: "",
          description: "",
          parentId: null,
        });
      }
    } else {
      reset();
    }
  }, [open, initialData]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/categories");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "获取分类列表失败");
      }

      // 过滤掉当前编辑的分类（避免选择自己作为父分类）
      const filtered = initialData
        ? data.categories.filter((c) => c.id !== initialData.id)
        : data.categories;

      setCategories(filtered);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: CategoryForm) => {
    try {
      setLoading(true);
      const response = await fetch(
        initialData
          ? `/api/categories/${initialData.id}`
          : "/api/categories",
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
        throw new Error(result.error || "保存分类失败");
      }

      onOpenChange(false);
      // 刷新父组件中的分类列表
      window.location.reload();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "编辑分类" : "添加分类"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">分类名称</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">分类描述</Label>
            <Textarea id="description" {...register("description")} />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="parentId">父分类</Label>
            <Select
              value={watch("parentId") || ""}
              onValueChange={(value) =>
                setValue("parentId", value === "" ? null : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="选择父分类（可选）" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">无父分类</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.parentId && (
              <p className="text-sm text-red-500">{errors.parentId.message}</p>
            )}
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "保存中..." : "保存"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 