import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">彩色卡片</h3>
            <p className="text-slate-300">
              专业的卡片产品制造商，提供高质量的定制卡片解决方案
            </p>
          </div>
          <div>
            <h4 className="font-medium text-lg mb-4">产品</h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <Link href="/products" className="hover:text-white">
                  全部产品
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-white">
                  产品分类
                </Link>
              </li>
              <li>
                <Link href="/custom" className="hover:text-white">
                  定制服务
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-lg mb-4">公司</h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <Link href="/about" className="hover:text-white">
                  关于我们
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  联系方式
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white">
                  常见问题
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-lg mb-4">联系我们</h4>
            <address className="not-italic text-slate-300 space-y-2">
              <p>电话: +86 123 4567 8910</p>
              <p>邮箱: info@colorfulcard.com</p>
              <p>地址: 中国广东省广州市</p>
            </address>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
          <p>&copy; {new Date().getFullYear()} 彩色卡片 版权所有</p>
        </div>
      </div>
    </footer>
  );
} 