"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { MessageSquare } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InquiryStatusBadge } from "@/components/inquiry-status-badge";
import { Skeleton } from "@/components/ui/skeleton";

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

export function RecentInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentInquiries = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/inquiries?limit=5");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "获取最近询盘失败");
        }

        setInquiries(data.inquiries);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentInquiries();
  }, []);

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>最近询盘</CardTitle>
          <CardDescription>
            查看最近收到的产品询盘和客户沟通
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/inquiries">查看全部</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4 items-start">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-4 text-muted-foreground">
            {error}
          </div>
        ) : inquiries.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            暂无询盘数据
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="flex items-start gap-4 rounded-lg border p-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{inquiry.name}</p>
                    <InquiryStatusBadge status={inquiry.status} />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{format(new Date(inquiry.createdAt), "yyyy-MM-dd HH:mm")}</span>
                    <span>•</span>
                    <span className="truncate max-w-[200px]">
                      {inquiry.product.name}
                    </span>
                  </div>
                  {inquiry.messages.length > 0 && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {inquiry.messages[inquiry.messages.length - 1].content}
                    </p>
                  )}
                  <Button
                    variant="link"
                    size="sm"
                    className="px-0 h-auto"
                    asChild
                  >
                    <Link href={`/admin/inquiries/${inquiry.id}`}>
                      查看详情
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 