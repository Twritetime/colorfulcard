import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { inquirySchema } from "@/lib/validations";

// 获取询盘列表 (仅管理员)
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
    const status = searchParams.get("status");

    const skip = (page - 1) * limit;

    // 构建查询条件
    const where = {
      ...(status && { status }),
    };

    // 获取询盘总数
    const total = await db.inquiry.count({ where });

    // 获取询盘列表
    const inquiries = await db.inquiry.findMany({
      where,
      include: {
        product: {
          select: {
            name: true,
            id: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    return NextResponse.json({
      inquiries,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "获取询盘列表失败" },
      { status: 500 }
    );
  }
}

// 创建新询盘
export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = inquirySchema.parse(json);

    // 验证产品是否存在
    const product = await db.product.findUnique({
      where: { id: body.productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "产品不存在" },
        { status: 404 }
      );
    }

    // 创建询盘
    const inquiry = await db.inquiry.create({
      data: {
        name: body.name,
        email: body.email,
        quantity: body.quantity,
        status: "pending", // 默认状态为待处理
        productId: body.productId,
        messages: {
          create: {
            content: body.message,
            sender: "customer", // 默认是客户发送的消息
          },
        },
      },
      include: {
        product: {
          select: {
            name: true,
          },
        },
        messages: true,
      },
    });

    // 可以在这里添加发送邮件通知管理员的逻辑

    return NextResponse.json({ success: true, inquiry });
  } catch (error) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "表单验证失败", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "创建询盘失败" },
      { status: 500 }
    );
  }
} 