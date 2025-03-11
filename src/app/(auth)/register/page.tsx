"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { registerSchema } from "@/lib/validations";
import { useFormState } from "@/hooks/use-form-state";
import type { z } from "zod";

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { error, isLoading, setError, setLoading } = useFormState();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setLoading(true);
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "注册失败，请稍后重试");
        return;
      }

      router.push("/login");
    } catch (error) {
      setError("注册失败，请稍后重试");
    }
  };

  return (
    <div className="container max-w-md py-20">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">用户注册</CardTitle>
          <CardDescription className="text-center">
            请填写以下信息完成注册
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                placeholder="您的邮箱地址"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="设置密码"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认密码</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="再次输入密码"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">公司名称 (选填)</Label>
              <Input
                id="company"
                type="text"
                placeholder="您的公司名称"
                {...register("company")}
              />
              {errors.company && (
                <p className="text-sm text-red-500">{errors.company.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">联系电话 (选填)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="您的联系电话"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">所在国家 (选填)</Label>
              <Input
                id="country"
                type="text"
                placeholder="您所在的国家"
                {...register("country")}
              />
              {errors.country && (
                <p className="text-sm text-red-500">{errors.country.message}</p>
              )}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "注册中..." : "注册"}
            </Button>
          </CardContent>
        </form>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            已有账号?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              立即登录
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 