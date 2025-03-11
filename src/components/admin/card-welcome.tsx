"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";

export function CardWelcome() {
  const { data: session } = useSession();
  
  return (
    <Card className="col-span-full">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-2">
          <h2 className="text-2xl font-bold">
            欢迎回来，{session?.user?.name || session?.user?.email}
          </h2>
          <p className="text-muted-foreground">
            管理您的产品、分类、用户和询盘。查看最新动态和数据统计。
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 