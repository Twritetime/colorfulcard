"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { InquiryStatusBadge } from "@/components/inquiry-status-badge";
import { useFormState } from "@/hooks/use-form-state";

interface Product {
  id: string;
  name: string;
}

interface Inquiry {
  id: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  quantity: number;
  createdAt: string;
  product: Product;
}

export default function UserInquiriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { error, isLoading, setError, setLoading } = useFormState();
  
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  const page = parseInt(searchParams.get("page") || "1");
  
  useEffect(() => {
    fetchInquiries();
  }, [page]);
  
  const fetchInquiries = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      params.set("page", page.toString());
      
      const response = await fetch(`/api/inquiries?${params.toString()}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "获取询盘历史失败");
      }
      
      setInquiries(data.inquiries);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", p.toString());
    router.push(`/inquiries?${params.toString()}`);
  };

  return (
    <div className="container py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">我的询盘</h1>
        <p className="text-muted-foreground mt-2">
          查看您提交的所有产品询盘和与供应商的沟通历史
        </p>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>询盘编号</TableHead>
              <TableHead>产品</TableHead>
              <TableHead>数量</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="w-[100px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {isLoading ? "加载中..." : "您还没有提交过询盘"}
                </TableCell>
              </TableRow>
            ) : (
              inquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell className="font-medium">
                    {inquiry.id.substring(0, 8)}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/products/${inquiry.product.id}`}
                      className="hover:underline text-primary"
                    >
                      {inquiry.product.name}
                    </Link>
                  </TableCell>
                  <TableCell>{inquiry.quantity}</TableCell>
                  <TableCell>
                    <InquiryStatusBadge status={inquiry.status} />
                  </TableCell>
                  <TableCell>
                    {format(new Date(inquiry.createdAt), "yyyy-MM-dd HH:mm")}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/inquiries/${inquiry.id}`}>查看详情</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {error && <p className="text-sm text-red-500">{error}</p>}
      
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => page > 1 && goToPage(page - 1)}
                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => goToPage(i + 1)}
                  isActive={page === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => page < totalPages && goToPage(page + 1)}
                className={
                  page >= totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
} 