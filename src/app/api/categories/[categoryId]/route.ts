import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { categorySchema } from "@/lib/validations";

interface RouteParams {
  params: {
    categoryId: string;
  };
}

// 获取单个分类
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const category = await db.category.findUnique({
      where: { id: params.categoryId },
      include: {
        parent: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "分类不存在" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
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

    const category = await db.category.update({
      where: { id: params.categoryId },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.description && { description: body.description }),
        ...(body.parentId !== undefined && { parentId: body.parentId }),
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

    // 检查分类是否有关联的产品
    const productsCount = await db.product.count({
      where: { categoryId: params.categoryId },
    });

    if (productsCount > 0) {
      return NextResponse.json(
        { error: "该分类下有关联的产品，无法删除" },
        { status: 400 }
      );
    }

    // 检查分类是否有子分类
    const childrenCount = await db.category.count({
      where: { parentId: params.categoryId },
    });

    if (childrenCount > 0) {
      return NextResponse.json(
        { error: "该分类有子分类，无法删除" },
        { status: 400 }
      );
    }

    await db.category.delete({
      where: { id: params.categoryId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "删除分类失败" },
      { status: 500 }
    );
  }
} 