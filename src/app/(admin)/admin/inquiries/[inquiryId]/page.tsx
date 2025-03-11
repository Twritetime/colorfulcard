"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Send, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
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
    price: number;
    images: string[];
  };
  messages: InquiryMessage[];
}

export default function InquiryDetailPage() {
  const params = useParams();
  const inquiryId = params.inquiryId as string;
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  const { error, success, isLoading, setError, setSuccess, setLoading } = useFormState();
  
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [messageContent, setMessageContent] = useState("");
  const [status, setStatus] = useState<string>("");
  
  useEffect(() => {
    fetchInquiryDetail();
  }, [inquiryId]);
  
  useEffect(() => {
    if (inquiry) {
      setStatus(inquiry.status);
    }
  }, [inquiry]);
  
  useEffect(() => {
    scrollToBottom();
  }, [inquiry?.messages]);
  
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const fetchInquiryDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/inquiries/${inquiryId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "获取询盘详情失败");
      }
      
      setInquiry(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleStatusChange = async (newStatus: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "更新询盘状态失败");
      }
      
      setInquiry(data);
      setStatus(data.status);
      setSuccess("询盘状态已更新");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageContent.trim()) {
      setError("消息内容不能为空");
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`/api/inquiries/${inquiryId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: messageContent,
          sender: "admin"
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "发送消息失败");
      }
      
      setMessageContent("");
      fetchInquiryDetail(); // 重新获取询盘详情，包括最新消息
      setSuccess("消息已发送");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading && !inquiry) {
    return <div className="flex justify-center p-12">加载中...</div>;
  }

  if (!inquiry) {
    return <div className="flex justify-center p-12">询盘不存在或已被删除</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/inquiries">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">询盘详情</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>消息记录</CardTitle>
            <CardDescription>
              询盘ID: {inquiry.id} | 状态: <InquiryStatusBadge status={inquiry.status} />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] overflow-y-auto space-y-4 mb-4 p-2">
              {inquiry.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "admin" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "admin"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <div className="text-sm">{message.content}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {format(new Date(message.createdAt), "yyyy-MM-dd HH:mm")}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>
            
            <form onSubmit={handleSendMessage} className="space-y-2">
              <Textarea
                placeholder="输入回复内容..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-between items-center">
                <div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  {success && <p className="text-sm text-green-500">{success}</p>}
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  发送回复
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>客户信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <div className="text-sm font-medium">名称</div>
                <div>{inquiry.name}</div>
              </div>
              <div>
                <div className="text-sm font-medium">邮箱</div>
                <div>{inquiry.email}</div>
              </div>
              <div>
                <div className="text-sm font-medium">创建时间</div>
                <div>{format(new Date(inquiry.createdAt), "yyyy-MM-dd HH:mm")}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>产品信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <div className="text-sm font-medium">产品名称</div>
                <Link
                  href={`/products/${inquiry.product.id}`}
                  className="hover:underline text-primary"
                  target="_blank"
                >
                  {inquiry.product.name}
                </Link>
              </div>
              {inquiry.product.images?.length > 0 && (
                <div>
                  <div className="text-sm font-medium">产品图片</div>
                  <img
                    src={inquiry.product.images[0]}
                    alt={inquiry.product.name}
                    className="w-full h-32 object-cover rounded-md mt-1"
                  />
                </div>
              )}
              <div>
                <div className="text-sm font-medium">询价数量</div>
                <div>{inquiry.quantity}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>询盘状态</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">待处理</SelectItem>
                  <SelectItem value="processing">处理中</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                  <SelectItem value="cancelled">已取消</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 