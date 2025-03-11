import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { db } from "@/lib/db";

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
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "该邮箱已被注册" },
        { status: 400 }
      );
    }

    // 创建新用户
    const hashedPassword = await hash(password, 10);
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        company,
        phone,
        country,
      },
    });

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("注册失败:", error);
    return NextResponse.json(
      { error: "注册失败，请稍后重试" },
      { status: 500 }
    );
  }
} 