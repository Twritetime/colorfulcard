"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type InquiryStatus = "pending" | "processing" | "completed" | "cancelled";

interface InquiryStatusBadgeProps {
  status: InquiryStatus;
}

const statusConfig = {
  pending: {
    label: "待处理",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  processing: {
    label: "处理中",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  completed: {
    label: "已完成",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  cancelled: {
    label: "已取消",
    className: "bg-red-100 text-red-800 border-red-200",
  },
};

export function InquiryStatusBadge({ status }: InquiryStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Badge variant="outline" className={cn("font-normal", config.className)}>
      {config.label}
    </Badge>
  );
} 