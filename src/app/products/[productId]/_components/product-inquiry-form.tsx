"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFormState } from "@/hooks/use-form-state";
import { inquirySchema } from "@/lib/validations";

interface ProductInquiryFormProps {
  productId: string;
  productName: string;
}

type InquiryForm = z.infer<typeof inquirySchema>;

export function ProductInquiryForm({
  productId,
  productName,
}: ProductInquiryFormProps) {
  const { error, success, isLoading, setError, setSuccess, setLoading } = useFormState();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryForm>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      productId,
      email: "",
      name: "",
      message: `您好，我对产品"${productName}"很感兴趣，请提供更多信息。`,
      quantity: 0,
    },
  });

  const onSubmit = async (data: InquiryForm) => {
    try {
      setLoading(true);
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "提交询盘失败");
      }

      setSuccess("询盘提交成功，我们将尽快与您联系");
      reset();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>产品询盘</CardTitle>
        <CardDescription>
          填写以下信息获取产品报价或更多详情
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">您的姓名</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">电子邮箱</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">询盘数量</Label>
            <Input
              id="quantity"
              type="number"
              {...register("quantity", { valueAsNumber: true })}
            />
            {errors.quantity && (
              <p className="text-sm text-red-500">{errors.quantity.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">留言</Label>
            <Textarea id="message" rows={3} {...register("message")} />
            {errors.message && (
              <p className="text-sm text-red-500">{errors.message.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start space-y-2">
          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-500">{success}</p>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              "提交中..."
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                发送询盘
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 