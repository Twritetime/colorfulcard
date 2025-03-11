import Image from "next/image";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// 模拟产品数据
const mockProducts = [
  {
    id: "1",
    name: "高端定制会员卡",
    slug: "high-end-membership-card",
    price: 888,
    minOrder: 100,
    description: "高端定制会员卡，采用优质PVC材料，表面处理光滑细腻，手感舒适。可根据客户需求定制不同的外观和功能。",
    features: [
      "材质：进口PVC",
      "尺寸：85.5mm x 54mm x 0.76mm",
      "表面处理：磨砂/UV光油/过油亮膜",
      "印刷：四色印刷",
      "可定制功能：二维码/条形码/芯片/磁条等"
    ],
    specifications: {
      "材质": "进口PVC",
      "尺寸": "85.5mm x 54mm x 0.76mm",
      "厚度": "0.76mm",
      "表面处理": "光油/磨砂/亮膜",
      "印刷": "四色印刷",
    },
    images: ["/images/product1.jpg", "/images/product1-2.jpg", "/images/product1-3.jpg"],
    priceTiers: [
      { minQuantity: 100, price: 888 },
      { minQuantity: 500, price: 788 },
      { minQuantity: 1000, price: 688 },
      { minQuantity: 5000, price: 588 },
    ]
  },
  {
    id: "2",
    name: "智能IC芯片卡",
    slug: "smart-ic-chip-card",
    price: 1299,
    minOrder: 200,
    description: "智能IC芯片卡，采用高质量芯片，读取稳定可靠，适用于门禁、考勤、支付等多种场景。",
    features: [
      "芯片：进口高质量IC芯片",
      "频率：13.56MHz",
      "读写距离：3-10cm",
      "使用寿命：100,000次以上",
      "防水防尘"
    ],
    specifications: {
      "芯片类型": "M1/FM11RF08/NTAG213等",
      "频率": "13.56MHz",
      "存储容量": "1K/4K可选",
      "读写距离": "3-10cm",
      "材质": "PVC/ABS/纸质等"
    },
    images: ["/images/product2.jpg", "/images/product2-2.jpg"],
    priceTiers: [
      { minQuantity: 200, price: 1299 },
      { minQuantity: 500, price: 1199 },
      { minQuantity: 1000, price: 999 },
      { minQuantity: 5000, price: 899 },
    ]
  },
];

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = mockProducts.find((p) => p.slug === params.slug);
  
  if (!product) {
    notFound();
  }

  return (
    <div className="container py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* 产品图片 */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border bg-white">
            <Image
              src={product.images[0] || "/placeholder.png"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-md border bg-white">
                  <Image
                    src={image}
                    alt={`${product.name} - 图${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 产品信息 */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="mt-4">
              <p className="text-3xl font-bold text-blue-700">
                {formatPrice(product.price)}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                最小起订量: {product.minOrder}件
              </p>
            </div>
          </div>

          <div className="border-t border-b py-4">
            <h3 className="font-semibold text-lg mb-2">产品描述</h3>
            <p className="text-slate-600">{product.description}</p>
          </div>

          {product.features && (
            <div>
              <h3 className="font-semibold text-lg mb-2">产品特点</h3>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                {product.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-lg mb-4">批发价格表</h3>
            <Card>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">数量</th>
                      <th className="px-4 py-3 text-left font-medium">单价</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {product.priceTiers?.map((tier, i) => (
                      <tr key={i}>
                        <td className="px-4 py-3">{tier.minQuantity}+</td>
                        <td className="px-4 py-3 font-medium text-blue-700">
                          {formatPrice(tier.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>

          <div className="pt-4 space-x-4">
            <Button size="lg" className="w-full md:w-auto">立即询价</Button>
            <Button variant="outline" size="lg" className="w-full md:w-auto mt-2 md:mt-0">联系客服</Button>
          </div>
        </div>
      </div>

      {/* 产品规格 */}
      {product.specifications && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">产品规格</h2>
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <tbody className="divide-y">
                  {Object.entries(product.specifications).map(([key, value], i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-slate-50" : ""}>
                      <td className="px-4 py-3 font-medium w-1/3">{key}</td>
                      <td className="px-4 py-3 text-slate-600">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 