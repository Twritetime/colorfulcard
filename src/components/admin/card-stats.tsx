"use client";

import { useState, useEffect } from "react";
import { 
  ShoppingBag, 
  LayoutGrid, 
  Users, 
  MessagesSquare 
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Stats {
  productsCount: number;
  categoriesCount: number;
  usersCount: number;
  inquiriesCount: number;
}

export function CardStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/admin/stats");
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "获取统计数据失败");
        }
        
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  const renderStat = (
    title: string, 
    value: number | undefined, 
    description: string, 
    icon: React.ReactNode
  ) => {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-7 w-16" />
          ) : (
            <div className="text-2xl font-bold">{value || 0}</div>
          )}
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <>
      {renderStat(
        "产品总数", 
        stats?.productsCount, 
        "已上传的产品数量", 
        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
      )}
      
      {renderStat(
        "分类总数", 
        stats?.categoriesCount, 
        "已创建的产品分类", 
        <LayoutGrid className="h-4 w-4 text-muted-foreground" />
      )}
      
      {renderStat(
        "用户总数", 
        stats?.usersCount, 
        "注册用户数量", 
        <Users className="h-4 w-4 text-muted-foreground" />
      )}
      
      {renderStat(
        "询盘总数", 
        stats?.inquiriesCount, 
        "收到的产品询盘", 
        <MessagesSquare className="h-4 w-4 text-muted-foreground" />
      )}
    </>
  );
} 