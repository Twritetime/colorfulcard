import { ProductCard } from "@/components/product-card";

// 模拟产品数据
const mockProducts = [
  {
    id: "1",
    name: "高端定制会员卡",
    slug: "high-end-membership-card",
    price: 888,
    minOrder: 100,
    images: ["/images/product1.jpg"],
  },
  {
    id: "2",
    name: "智能IC芯片卡",
    slug: "smart-ic-chip-card",
    price: 1299,
    minOrder: 200,
    images: ["/images/product2.jpg"],
  },
  {
    id: "3",
    name: "金属拉丝贵宾卡",
    slug: "metal-brushed-vip-card",
    price: 2999,
    minOrder: 50,
    images: ["/images/product3.jpg"],
  },
  {
    id: "4",
    name: "NFC智能卡",
    slug: "nfc-smart-card",
    price: 1999,
    minOrder: 100,
    images: ["/images/product4.jpg"],
  },
  {
    id: "5",
    name: "定制印刷PVC卡",
    slug: "custom-printed-pvc-card",
    price: 599,
    minOrder: 300,
    images: ["/images/product5.jpg"],
  },
  {
    id: "6",
    name: "商务礼品卡",
    slug: "business-gift-card",
    price: 1599,
    minOrder: 100,
    images: ["/images/product6.jpg"],
  },
];

export default function ProductsPage() {
  return (
    <div className="container py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-4">全部产品</h1>
        <p className="text-slate-600">
          我们提供各种高质量的卡片产品，满足不同行业和场景的需求。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
} 