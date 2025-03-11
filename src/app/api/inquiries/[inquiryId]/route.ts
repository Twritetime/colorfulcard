import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { inquiries, products } from "@/lib/mock-db";

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

    const inquiry = inquiries.find(i => i.id === params.inquiryId);

    if (!inquiry) {
      return NextResponse.json(
        { error: "询盘不存在" },
        { status: 404 }
      );
    }

    const inquiryWithProduct = {
      ...inquiry,
      product: products.find(p => p.id === inquiry.productId),
      messages: inquiry.messages.sort((a, b) => 
        a.createdAt.getTime() - b.createdAt.getTime()
      ),
    };

    return NextResponse.json(inquiryWithProduct);
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

    const inquiry = inquiries.find(i => i.id === params.inquiryId);

    if (!inquiry) {
      return NextResponse.json(
        { error: "询盘不存在" },
        { status: 404 }
      );
    }

    const updatedInquiry = {
      ...inquiry,
      status,
      updatedAt: new Date(),
    };

    return NextResponse.json(updatedInquiry);
  } catch (error) {
    return NextResponse.json(
      { error: "更新询盘状态失败" },
      { status: 500 }
    );
  }
} 