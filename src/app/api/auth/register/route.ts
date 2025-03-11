import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { users } from "@/lib/mock-db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, company, phone, country } = body;

    // 检查必填字段
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "请填写必要的注册信息" },
        { status: 400 }
      );
    }

    // 检查邮箱是否已被注册
    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
      return NextResponse.json(
        { error: "该邮箱已被注册" },
        { status: 400 }
      );
    }

    // 创建新用户
    const hashedPassword = await hash(password, 10);
    const mockUser = {
      id: String(users.length + 1),
      name,
      email,
      password: hashedPassword,
      company,
      phone,
      country,
      role: "USER",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = mockUser;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("注册失败:", error);
    return NextResponse.json(
      { error: "注册失败，请稍后重试" },
      { status: 500 }
    );
  }
} 