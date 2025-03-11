"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Eye, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { InquiryStatusBadge } from "@/components/inquiry-status-badge";
import { useFormState } from "@/hooks/use-form-state";

interface InquiryMessage {
  id: string;
  content: string;
  sender: "admin" | "customer";
  createdAt: string;
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  quantity: number;
  createdAt: string;
  product: {
    id: string;
    name: string;
  };
  messages: InquiryMessage[];
}

export default function InquiriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { error, isLoading, setError, setLoading } = useFormState();
  
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  const page = parseInt(searchParams.get("page") || "1");
  const status = searchParams.get("status") || "";
  
  useEffect(() => {
    fetchInquiries();
  }, [page, status]);
  
  const fetchInquiries = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      params.set("page", page.toString());
      if (status) params.set("status", status);
      
      const response = await fetch(`/api/inquiries?${params.toString()}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "获取询盘列表失败");
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
  
  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("status", value);
    } else {
      params.delete("status");
    }
    params.set("page", "1"); // 重置页码
    router.push(`/admin/inquiries?${params.toString()}`);
  };
  
  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", p.toString());
    router.push(`/admin/inquiries?${params.toString()}`);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">询盘管理</h1>
        <div className="flex gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索询盘..."
              className="pl-8"
              // 这里可以实现搜索功能
            />
          </div>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="所有状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">所有状态</SelectItem>
              <SelectItem value="pending">待处理</SelectItem>
              <SelectItem value="processing">处理中</SelectItem>
              <SelectItem value="completed">已完成</SelectItem>
              <SelectItem value="cancelled">已取消</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>询盘ID</TableHead>
              <TableHead>客户名称</TableHead>
              <TableHead>电子邮箱</TableHead>
              <TableHead>产品</TableHead>
              <TableHead>数量</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="w-[80px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  {isLoading ? "加载中..." : "暂无询盘数据"}
                </TableCell>
              </TableRow>
            ) : (
              inquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell className="font-medium">{inquiry.id.substring(0, 8)}</TableCell>
                  <TableCell>{inquiry.name}</TableCell>
                  <TableCell>{inquiry.email}</TableCell>
                  <TableCell>
                    <Link
                      href={`/products/${inquiry.product.id}`}
                      className="hover:underline text-primary"
                      target="_blank"
                    >
                      {inquiry.product.name}
                    </Link>
                  </TableCell>
                  <TableCell>{inquiry.quantity}</TableCell>
                  <TableCell>
                    <InquiryStatusBadge status={inquiry.status} />
                  </TableCell>
                  <TableCell>{format(new Date(inquiry.createdAt), "yyyy-MM-dd HH:mm")}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                    >
                      <Link href={`/admin/inquiries/${inquiry.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
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