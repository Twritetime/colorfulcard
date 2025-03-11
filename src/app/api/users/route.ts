import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// 获取用户列表
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "未授权访问" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    // 获取用户总数
    const total = await db.user.count();

    // 获取用户列表
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        company: true,
        phone: true,
        country: true,
        createdAt: true,
        updatedAt: true,
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "获取用户列表失败" },
      { status: 500 }
    );
  }
} 