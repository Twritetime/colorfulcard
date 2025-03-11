import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

interface RouteParams {
  params: {
    inquiryId: string;
  };
}

// 获取单个询盘详情
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "未授权访问" },
        { status: 401 }
      );
    }

    const inquiry = await db.inquiry.findUnique({
      where: { id: params.inquiryId },
      include: {
        product: true,
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!inquiry) {
      return NextResponse.json(
        { error: "询盘不存在" },
        { status: 404 }
      );
    }

    return NextResponse.json(inquiry);
  } catch (error) {
    return NextResponse.json(
      { error: "获取询盘详情失败" },
      { status: 500 }
    );
  }
}

// 更新询盘状态
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "未授权访问" },
        { status: 401 }
      );
    }

    const json = await request.json();
    const { status } = json;

    if (!status || !["pending", "processing", "completed", "cancelled"].includes(status)) {
      return NextResponse.json(
        { error: "无效的状态值" },
        { status: 400 }
      );
    }

    const inquiry = await db.inquiry.update({
      where: { id: params.inquiryId },
      data: { status },
    });

    return NextResponse.json(inquiry);
  } catch (error) {
    return NextResponse.json(
      { error: "更新询盘状态失败" },
      { status: 500 }
    );
  }
} 