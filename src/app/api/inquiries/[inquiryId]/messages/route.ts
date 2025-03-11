import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { inquiries } from "@/lib/mock-db";
import { z } from "zod";

interface RouteParams {
  params: {
    inquiryId: string;
  };
}

const messageSchema = z.object({
  content: z.string().min(1, "消息内容不能为空").max(1000, "消息内容不能超过1000个字符"),
  sender: z.enum(["admin", "customer"]),
});

// 获取询盘消息列表
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    // 查询字符串中的 email 参数用于验证公共访问
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    
    const inquiry = inquiries.find(i => i.id === params.inquiryId);

    if (!inquiry) {
      return NextResponse.json(
        { error: "询盘不存在" },
        { status: 404 }
      );
    }

    // 如果不是管理员，则需要验证email是否匹配询盘的email
    if (!session?.user) {
      if (!email) {
        return NextResponse.json(
          { error: "未授权访问" },
          { status: 401 }
        );
      }

      if (inquiry.email !== email) {
        return NextResponse.json(
          { error: "未授权访问" },
          { status: 401 }
        );
      }
    }

    const messages = inquiry.messages.sort((a, b) => 
      a.createdAt.getTime() - b.createdAt.getTime()
    );

    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json(
      { error: "获取消息列表失败" },
      { status: 500 }
    );
  }
}

// 发送新消息
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const json = await request.json();
    const { content, sender } = messageSchema.parse(json);
    
    const session = await getServerSession(authOptions);
    
    const inquiry = inquiries.find(i => i.id === params.inquiryId);

    if (!inquiry) {
      return NextResponse.json(
        { error: "询盘不存在" },
        { status: 404 }
      );
    }

    // 如果发送者是管理员，必须是已登录的用户
    if (sender === "admin" && !session?.user) {
      return NextResponse.json(
        { error: "未授权访问" },
        { status: 401 }
      );
    }
    
    // 如果发送者是客户，则需要验证email是否匹配询盘的email
    if (sender === "customer" && !session?.user) {
      const { email } = json;
      
      if (!email) {
        return NextResponse.json(
          { error: "未提供电子邮箱" },
          { status: 400 }
        );
      }
      
      if (inquiry.email !== email) {
        return NextResponse.json(
          { error: "电子邮箱不匹配" },
          { status: 401 }
        );
      }
    }

    // 创建新消息
    const mockMessage = {
      id: String(inquiry.messages.length + 1),
      content,
      sender,
      inquiryId: params.inquiryId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 如果询盘状态是待处理，且这是管理员的回复，则更新状态为处理中
    if (inquiry.status === "pending" && sender === "admin") {
      inquiry.status = "processing";
      inquiry.updatedAt = new Date();
    }

    return NextResponse.json(mockMessage);
  } catch (error) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "验证失败", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "发送消息失败" },
      { status: 500 }
    );
  }
} 