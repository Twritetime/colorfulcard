import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { 
  BarChart3,
  ShoppingBag,
  Users,
  LayoutGrid
} from "lucide-react";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentProducts } from "@/components/admin/recent-products";
import { RecentInquiries } from "@/components/admin/recent-inquiries";
import { CardStats } from "@/components/admin/card-stats";
import { CardWelcome } from "@/components/admin/card-welcome";

export const metadata: Metadata = {
  title: "管理仪表盘 - 彩色卡片",
};

async function getStats() {
  const stats = await Promise.all([
    db.product.count(),
    db.category.count(),
    db.user.count(),
    // 可以添加更多统计，如订单数等
  ]);

  return {
    productsCount: stats[0],
    categoriesCount: stats[1],
    usersCount: stats[2],
  };
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const stats = await getStats();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">管理员仪表盘</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <CardWelcome />
        <CardStats />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <RecentInquiries />
        <RecentProducts />
      </div>
    </div>
  );
} 