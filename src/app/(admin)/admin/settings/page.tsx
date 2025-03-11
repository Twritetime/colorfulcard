"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Upload } from "@/components/ui/upload";
import { useFormState } from "@/hooks/use-form-state";

const siteSettingsSchema = z.object({
  siteName: z.string().min(1, "网站名称不能为空"),
  siteDescription: z.string().optional(),
  contactEmail: z.string().email("请输入有效的邮箱地址"),
  contactPhone: z.string().optional(),
  logo: z.string().optional(),
});

type SiteSettings = z.infer<typeof siteSettingsSchema>;

export default function SettingsPage() {
  const { error, success, isLoading, setError, setSuccess, setLoading } = useFormState();
  const [logo, setLogo] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SiteSettings>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      siteName: "彩色卡片",
      siteDescription: "彩色卡片 - 专业的外贸B2B平台",
      contactEmail: "contact@colorfulcard.com",
      contactPhone: "",
      logo: "",
    },
  });

  const onSubmit = async (data: SiteSettings) => {
    try {
      setLoading(true);
      // 在实际应用中，这里应该发送请求保存设置
      console.log("保存设置:", data);
      
      // 模拟保存延迟
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setSuccess("设置保存成功");
    } catch (error) {
      setError("保存设置失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">系统设置</h1>
      
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">基本设置</TabsTrigger>
          <TabsTrigger value="appearance">外观设置</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4 pt-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>基本设置</CardTitle>
                <CardDescription>
                  设置网站的基本信息
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">网站名称</Label>
                  <Input id="siteName" {...register("siteName")} />
                  {errors.siteName && (
                    <p className="text-sm text-red-500">{errors.siteName.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">网站描述</Label>
                  <Textarea id="siteDescription" {...register("siteDescription")} />
                  {errors.siteDescription && (
                    <p className="text-sm text-red-500">{errors.siteDescription.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">联系邮箱</Label>
                  <Input id="contactEmail" type="email" {...register("contactEmail")} />
                  {errors.contactEmail && (
                    <p className="text-sm text-red-500">{errors.contactEmail.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">联系电话</Label>
                  <Input id="contactPhone" {...register("contactPhone")} />
                  {errors.contactPhone && (
                    <p className="text-sm text-red-500">{errors.contactPhone.message}</p>
                  )}
                </div>
              </CardContent>
              
              <CardFooter>
                {error && <p className="text-sm text-red-500 mr-auto">{error}</p>}
                {success && <p className="text-sm text-green-500 mr-auto">{success}</p>}
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "保存中..." : "保存设置"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>外观设置</CardTitle>
              <CardDescription>
                自定义网站的外观
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>网站 Logo</Label>
                <Upload
                  value={logo}
                  onChange={setLogo}
                  onRemove={() => setLogo("")}
                />
              </div>
              
              <div className="space-y-2">
                <Label>主题颜色</Label>
                <div className="grid grid-cols-5 gap-2">
                  {["#ff0000", "#00ff00", "#0000ff", "#ff00ff", "#ffff00"].map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="w-8 h-8 rounded-full border"
                      style={{ backgroundColor: color }}
                      onClick={() => console.log("选择颜色:", color)}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button type="button">保存外观</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 