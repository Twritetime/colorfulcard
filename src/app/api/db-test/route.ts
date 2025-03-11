import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { db } from '@/lib/db';

// 使用Neon serverless驱动直接连接
export async function GET() {
  try {
    // 使用Neon驱动
    const sql = neon(process.env.POSTGRES_URL_NON_POOLING!);
    
    // 简单查询示例
    const testQuery = await sql`SELECT version();`;
    
    // 使用Prisma查询示例（如果表已存在）
    let userCount = 0;
    try {
      userCount = await db.user.count();
    } catch (error) {
      console.log('Prisma查询可能失败，数据表可能尚未创建');
    }
    
    return NextResponse.json({
      success: true,
      message: '数据库连接成功',
      neonResult: testQuery,
      userCount,
    });
  } catch (error: any) {
    console.error('数据库连接错误:', error);
    return NextResponse.json(
      {
        success: false,
        message: '数据库连接失败',
        error: error.message,
      },
      { status: 500 }
    );
  }
} 