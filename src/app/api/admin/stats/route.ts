import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "未授权访问" },
        { status: 401 }
      );
    }
    
    // 获取产品数量
    const productsCount = await db.product.count();
    
    // 获取分类数量
    const categoriesCount = await db.category.count();
    
    // 获取用户数量
    const usersCount = await db.user.count();
    
    // 获取询盘数量
    const inquiriesCount = await db.inquiry.count();
    
    return NextResponse.json({
      productsCount,
      categoriesCount,
      usersCount,
      inquiriesCount
    });
  } catch (error) {
    console.error("获取统计数据出错:", error);
    return NextResponse.json(
      { error: "获取统计数据失败" },
      { status: 500 }
    );
  }
} 