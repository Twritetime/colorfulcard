import { NextResponse } from 'next/server';
import { sql, db } from '@/lib/db';
import { users, products, categories } from '@/lib/mock-db';

// 使用Neon serverless驱动直接连接
export async function GET() {
  try {
    // 使用模拟SQL查询
    const testQuery = await sql`SELECT version();`;
    
    // 使用模拟数据库查询
    const userCount = await db.user.count();
    const productCount = await db.product.count();
    const categoryCount = await db.category.count();
    
    return NextResponse.json({
      success: true,
      message: '模拟数据库连接成功',
      neonResult: testQuery,
      counts: {
        users: userCount,
        products: productCount,
        categories: categoryCount
      },
      sampleData: {
        users: users.slice(0, 1),
        products: products.slice(0, 1),
        categories: categories.slice(0, 1)
      }
    });
  } catch (error: any) {
    console.error('模拟数据库查询错误:', error);
    return NextResponse.json(
      {
        success: false,
        message: '模拟数据库查询失败',
        error: error.message,
      },
      { status: 500 }
    );
  }
} 