"use client";

import { useEffect, useState } from "react";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useFormState } from "@/hooks/use-form-state";

interface Category {
  id: string;
  name: string;
  description: string | null;
  parent: {
    id: string;
    name: string;
  } | null;
  _count: {
    products: number;
  };
}

interface CategoryListProps {
  onEdit: (category: Category) => void;
}

export function CategoryList({ onEdit }: CategoryListProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { error, isLoading, setError, setLoading } = useFormState();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/categories");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "获取分类列表失败");
      }

      setCategories(data.categories);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/categories/${deleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "删除分类失败");
      }

      await fetchCategories();
      setDeleteId(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>分类名称</TableHead>
              <TableHead>描述</TableHead>
              <TableHead>父分类</TableHead>
              <TableHead>产品数量</TableHead>
              <TableHead className="w-[100px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.description || "-"}</TableCell>
                <TableCell>{category.parent?.name || "-"}</TableCell>
                <TableCell>{category._count.products}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(category)}>
                        <Edit className="mr-2 h-4 w-4" />
                        编辑
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => setDeleteId(category.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  暂无分类数据
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除这个分类吗？此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
              {isLoading ? "删除中..." : "确认删除"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 