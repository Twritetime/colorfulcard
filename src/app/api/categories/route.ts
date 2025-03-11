import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { categorySchema } from "@/lib/validations";

// 获取分类列表
export async function GET(request: Request) {
  try {
    const categories = await db.category.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json(
      { error: "获取分类列表失败" },
      { status: 500 }
    );
  }
}

// 创建新分类
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "未授权访问" },
        { status: 401 }
      );
    }

    const json = await request.json();
    const body = categorySchema.parse(json);

    const category = await db.category.create({
      data: {
        name: body.name,
        description: body.description,
        parentId: body.parentId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "分类名称已存在" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "创建分类失败" },
      { status: 500 }
    );
  }
} 