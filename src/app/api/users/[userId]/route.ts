import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

interface RouteParams {
  params: {
    userId: string;
  };
}

// 获取单个用户详情
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "未授权访问" },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: params.userId },
      select: {
        id: true,
        email: true,
        company: true,
        phone: true,
        country: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "用户不存在" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "获取用户详情失败" },
      { status: 500 }
    );
  }
}

// 删除用户
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "未授权访问" },
        { status: 401 }
      );
    }

    // 防止删除当前登录的用户
    if (session.user.id === params.userId) {
      return NextResponse.json(
        { error: "不能删除当前登录的用户" },
        { status: 400 }
      );
    }

    await db.user.delete({
      where: { id: params.userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "删除用户失败" },
      { status: 500 }
    );
  }
} 