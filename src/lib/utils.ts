import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 合并Tailwind CSS类名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 格式化价格为人民币格式
 */
export function formatPrice(price: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

/**
 * 生成URL友好的slug
 */
export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // 替换空格为 -
    .replace(/[^\w\-]+/g, "") // 移除非单词字符
    .replace(/\-\-+/g, "-") // 替换多个 - 为单个 -
    .replace(/^-+/, "") // 去除开头的 -
    .replace(/-+$/, ""); // 去除结尾的 -
}

/**
 * 截断文本
 */
export function truncateText(text: string, length: number) {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
} 