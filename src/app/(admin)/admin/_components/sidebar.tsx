"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  BarChart3,
  Settings,
  ShoppingBag,
  LayoutGrid,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    title: "仪表盘",
    href: "/admin",
    icon: BarChart3,
  },
  {
    title: "产品管理",
    href: "/admin/products",
    icon: ShoppingBag,
  },
  {
    title: "分类管理",
    href: "/admin/categories",
    icon: LayoutGrid,
  },
  {
    title: "用户管理",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "系统设置",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <nav
        className={cn(
          "fixed h-full w-64 flex-col bg-muted p-4 transition-transform md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="w-8 h-8 rounded-full bg-primary" />
          <span className="text-xl font-bold">彩色卡片</span>
        </div>

        <div className="mt-8 flex flex-col gap-1.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted-foreground/10"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </div>

        <div className="mt-auto">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="h-4 w-4" />
            退出登录
          </Button>
        </div>
      </nav>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
} 