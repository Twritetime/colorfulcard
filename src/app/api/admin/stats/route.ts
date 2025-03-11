import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { users, products, categories, inquiries } from "@/lib/mock-db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "未授权访问" },
        { status: 401 }
      );
    }
    
    // 获取各项统计数据
    const productsCount = products.length;
    const categoriesCount = categories.length;
    const usersCount = users.length;
    const inquiriesCount = inquiries.length;
    
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