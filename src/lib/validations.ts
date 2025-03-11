import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(6, "密码至少需要6个字符"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "姓名至少需要2个字符"),
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(6, "密码至少需要6个字符"),
  confirmPassword: z.string(),
  company: z.string().optional(),
  phone: z.string().optional(),
  country: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "两次输入的密码不一致",
  path: ["confirmPassword"],
});

export const productSchema = z.object({
  name: z.string().min(2, "产品名称至少需要2个字符"),
  description: z.string().optional(),
  price: z.number().min(0, "价格不能为负数").optional(),
  minOrder: z.number().min(1, "最小订购量至少为1").optional(),
  categoryId: z.string().optional(),
  features: z.array(z.string()).optional(),
  specifications: z.record(z.string()).optional(),
  images: z.array(z.string()).optional(),
  isPublished: z.boolean().default(true),
});

export const categorySchema = z.object({
  name: z.string().min(2, "分类名称至少需要2个字符"),
  description: z.string().optional(),
  parentId: z.string().optional(),
  image: z.string().optional(),
});

export const inquirySchema = z.object({
  productId: z.string(),
  quantity: z.number().min(1, "数量至少为1"),
  message: z.string().optional(),
}); 