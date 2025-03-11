import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { categories } from "@/lib/mock-db";
import { categorySchema } from "@/lib/validations";

interface RouteParams {
  params: {
    categoryId: string;
  };
}

// 获取单个分类
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const category = categories.find(c => c.id === params.categoryId);

    if (!category) {
      return NextResponse.json(
        { error: "分类不存在" },
        { status: 404 }
      );
    }

    const categoryWithParent = {
      ...category,
      parent: categories.find(c => c.id === category.parentId),
    };

    return NextResponse.json(categoryWithParent);
  } catch (error) {
    return NextResponse.json(
      { error: "获取分类详情失败" },
      { status: 500 }
    );
  }
}

// 更新分类
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
    const body = categorySchema.partial().parse(json);

    // 检查是否将自身设为父类别
    if (body.parentId === params.categoryId) {
      return NextResponse.json(
        { error: "不能将自身设为父类别" },
        { status: 400 }
      );
    }

    // 在mock数据中，我们只返回更新后的模拟数据
    const category = categories.find(c => c.id === params.categoryId);
    
    if (!category) {
      return NextResponse.json(
        { error: "分类不存在" },
        { status: 404 }
      );
    }

    const updatedCategory = {
      ...category,
      ...(body.name && { name: body.name }),
      ...(body.description && { description: body.description }),
      ...(body.parentId !== undefined && { parentId: body.parentId }),
      updatedAt: new Date(),
    };

    return NextResponse.json(updatedCategory);
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "分类名称已存在" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "更新分类失败" },
      { status: 500 }
    );
  }
}

// 删除分类
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "未授权访问" },
        { status: 401 }
      );
    }

    // 在mock数据中，我们只返回成功响应
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "删除分类失败" },
      { status: 500 }
    );
  }
} 