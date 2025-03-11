"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/utils";
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

export default function UserInquiryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const inquiryId = params.inquiryId as string;
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  const { error, success, isLoading, setError, setSuccess, setLoading } = useFormState();
  
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [messageContent, setMessageContent] = useState("");
  
  useEffect(() => {
    fetchInquiryDetail();
  }, [inquiryId]);
  
  useEffect(() => {
    scrollToBottom();
  }, [inquiry?.messages]);
  
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const fetchInquiryDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/inquiries/${inquiryId}?email=${encodeURIComponent(inquiry?.email || "")}`);
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
          sender: "customer"
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
    return <div className="container py-10 flex justify-center">加载中...</div>;
  }

  if (!inquiry) {
    return (
      <div className="container py-10 space-y-4">
        <div className="text-center">
          <p className="text-xl">询盘不存在或您没有权限查看</p>
          <Button asChild className="mt-4">
            <Link href="/inquiries">返回询盘列表</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/inquiries">
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
                    message.sender === "customer" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "customer"
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
                placeholder="输入你的消息..."
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
                  disabled={isLoading || inquiry.status === "completed" || inquiry.status === "cancelled"}
                  className="flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  发送消息
                </Button>
              </div>
              
              {(inquiry.status === "completed" || inquiry.status === "cancelled") && (
                <p className="text-sm text-muted-foreground text-center">
                  此询盘已{inquiry.status === "completed" ? "完成" : "取消"}，无法继续发送消息
                </p>
              )}
            </form>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>产品信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {inquiry.product.images?.length > 0 && (
                <img
                  src={inquiry.product.images[0]}
                  alt={inquiry.product.name}
                  className="w-full aspect-square object-cover rounded-md"
                />
              )}
              
              <div className="space-y-2">
                <div>
                  <div className="text-sm font-medium">产品名称</div>
                  <Link
                    href={`/products/${inquiry.product.id}`}
                    className="hover:underline text-primary"
                  >
                    {inquiry.product.name}
                  </Link>
                </div>
                
                <div>
                  <div className="text-sm font-medium">单价</div>
                  <div>{formatPrice(inquiry.product.price)}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium">询价数量</div>
                  <div>{inquiry.quantity}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium">创建时间</div>
                  <div>{format(new Date(inquiry.createdAt), "yyyy-MM-dd HH:mm")}</div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/products/${inquiry.product.id}`}>查看产品详情</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>询盘状态</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-center">
                  <InquiryStatusBadge status={inquiry.status} />
                </div>
                
                <p className="text-sm text-center text-muted-foreground">
                  {inquiry.status === "pending" && "您的询盘已提交，正在等待供应商回复"}
                  {inquiry.status === "processing" && "供应商正在处理您的询盘，请继续沟通"}
                  {inquiry.status === "completed" && "此询盘已完成，感谢您的询价"}
                  {inquiry.status === "cancelled" && "此询盘已取消"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 