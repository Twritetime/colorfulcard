import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-2xl">彩色卡片</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link href="/products" className="flex items-center text-lg font-medium transition-colors hover:text-primary">
              全部产品
            </Link>
            <Link href="/categories" className="flex items-center text-lg font-medium transition-colors hover:text-primary">
              产品分类
            </Link>
            <Link href="/about" className="flex items-center text-lg font-medium transition-colors hover:text-primary">
              关于我们
            </Link>
            <Link href="/contact" className="flex items-center text-lg font-medium transition-colors hover:text-primary">
              联系方式
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="outline" size="sm">登录</Button>
          </Link>
          <Link href="/register">
            <Button variant="primary" size="sm">注册</Button>
          </Link>
        </div>
      </div>
    </header>
  );
} 