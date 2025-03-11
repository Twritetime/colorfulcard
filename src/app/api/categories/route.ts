import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { categories } from "@/lib/mock-db";
import { categorySchema } from "@/lib/validations";

// 获取分类列表
export async function GET(request: Request) {
  try {
    const categoriesWithCounts = categories.map(category => ({
      ...category,
      parent: categories.find(c => c.id === category.parentId),
      _count: {
        products: 0, // 在mock数据中，我们简化这个计数
      },
    }));

    return NextResponse.json({ categories: categoriesWithCounts });
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

    // 在mock数据中，我们只返回成功响应
    const mockCategory = {
      id: String(categories.length + 1),
      name: body.name,
      description: body.description,
      parentId: body.parentId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json(mockCategory);
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