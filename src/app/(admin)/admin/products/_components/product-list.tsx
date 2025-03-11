"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
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
import { useFormState } from "@/hooks/use-form-state";

interface Product {
  id: string;
  name: string;
  price: number;
  minQuantity: number;
  category: {
    name: string;
  };
  images: {
    url: string;
  }[];
  createdAt: string;
}

export function ProductList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const { error, isLoading, setError, setLoading } = useFormState();

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search");
  const category = searchParams.get("category");

  useEffect(() => {
    fetchProducts();
  }, [page, limit, search, category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(category && { category }),
      });

      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "获取产品列表失败");
      }

      setProducts(data.products);
      setTotal(data.total);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("删除产品失败");
      }

      await fetchProducts();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>产品图片</TableHead>
              <TableHead>产品名称</TableHead>
              <TableHead>价格</TableHead>
              <TableHead>最小订量</TableHead>
              <TableHead>分类</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="w-[100px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {product.images[0] && (
                    <div className="relative h-10 w-10 overflow-hidden rounded">
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        className="object-cover"
                        fill
                        sizes="40px"
                      />
                    </div>
                  )}
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.minQuantity}</TableCell>
                <TableCell>{product.category?.name}</TableCell>
                <TableCell>
                  {new Date(product.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/admin/products/${product.id}/edit`)
                        }
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        编辑
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
} 