import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/mock-db";

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
    const total = users.length;

    // 获取用户列表
    const paginatedUsers = users
      .slice(skip, skip + limit)
      .map(({ password, ...user }) => user);

    return NextResponse.json({
      users: paginatedUsers,
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