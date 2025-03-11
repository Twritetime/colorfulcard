"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
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
import { loginSchema } from "@/lib/validations";
import { useFormState } from "@/hooks/use-form-state";
import type { z } from "zod";

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { error, isLoading, setError, setLoading } = useFormState();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true);
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("邮箱或密码错误");
        return;
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      setError("登录失败，请稍后重试");
    }
  };

  return (
    <div className="container max-w-md py-20">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">用户登录</CardTitle>
          <CardDescription className="text-center">
            请输入您的账号密码登录系统
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">密码</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:underline"
                >
                  忘记密码?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="您的密码"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "登录中..." : "登录"}
            </Button>
          </CardContent>
        </form>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            还没有账号?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              立即注册
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 