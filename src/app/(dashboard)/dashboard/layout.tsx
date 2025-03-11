import Link from "next/link";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* 侧边栏 */}
      <aside className="w-64 bg-slate-900 text-white">
        <div className="p-6">
          <Link href="/dashboard" className="text-xl font-bold">
            彩色卡片管理系统
          </Link>
        </div>
        <nav className="mt-6">
          <div className="px-4 py-2 text-xs text-slate-400 uppercase">主菜单</div>
          <Link href="/dashboard" className="flex items-center px-6 py-3 hover:bg-slate-800">
            仪表盘
          </Link>
          <Link href="/dashboard/products" className="flex items-center px-6 py-3 hover:bg-slate-800">
            产品管理
          </Link>
          <Link href="/dashboard/categories" className="flex items-center px-6 py-3 hover:bg-slate-800">
            分类管理
          </Link>
          <Link href="/dashboard/inquiries" className="flex items-center px-6 py-3 hover:bg-slate-800">
            询价管理
          </Link>
          <div className="px-4 py-2 mt-6 text-xs text-slate-400 uppercase">系统设置</div>
          <Link href="/dashboard/users" className="flex items-center px-6 py-3 hover:bg-slate-800">
            用户管理
          </Link>
          <Link href="/dashboard/settings" className="flex items-center px-6 py-3 hover:bg-slate-800">
            系统设置
          </Link>
        </nav>
      </aside>

      {/* 主内容区 */}
      <div className="flex-1">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-xl font-semibold">管理后台</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm">管理员</span>
              <button className="text-sm text-blue-600 hover:underline">
                退出登录
              </button>
            </div>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
} 