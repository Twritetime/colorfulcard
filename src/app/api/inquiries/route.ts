import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { inquiries, products } from "@/lib/mock-db";
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

    // 过滤询盘
    let filteredInquiries = inquiries;
    if (status) {
      filteredInquiries = inquiries.filter(i => i.status === status);
    }

    const total = filteredInquiries.length;

    // 获取询盘列表
    const paginatedInquiries = filteredInquiries
      .slice(skip, skip + limit)
      .map(inquiry => ({
        ...inquiry,
        product: products.find(p => p.id === inquiry.productId),
        messages: inquiry.messages.slice(-1),
      }));

    return NextResponse.json({
      inquiries: paginatedInquiries,
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
    const product = products.find(p => p.id === body.productId);

    if (!product) {
      return NextResponse.json(
        { error: "产品不存在" },
        { status: 404 }
      );
    }

    // 创建询盘
    const mockInquiry = {
      id: String(inquiries.length + 1),
      name: body.name,
      email: body.email,
      quantity: body.quantity,
      status: "pending",
      productId: body.productId,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [
        {
          id: "1",
          content: body.message,
          sender: "customer",
          inquiryId: String(inquiries.length + 1),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      product: {
        name: product.name,
      },
    };

    return NextResponse.json({ success: true, inquiry: mockInquiry });
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