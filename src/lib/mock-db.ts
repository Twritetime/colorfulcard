// 模拟用户数据
export const users = [
  {
    id: '1',
    name: '管理员',
    email: 'admin@example.com',
    password: 'hashed_password', // 实际应用中应该是加密的
    role: 'ADMIN',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: '测试用户',
    email: 'user@example.com',
    password: 'hashed_password',
    role: 'USER',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// 模拟分类数据
export const categories = [
  {
    id: 1,
    name: "电子产品",
    slug: "electronics",
    description: "各种电子产品和配件",
    imageUrl: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&h=300&fit=crop",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: "家居用品",
    slug: "home-goods",
    description: "高品质家居用品",
    imageUrl: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=500&h=300&fit=crop",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    name: "办公用品",
    slug: "office-supplies",
    description: "专业办公用品",
    imageUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=500&h=300&fit=crop",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// 模拟产品数据
export const products = [
  {
    id: 1,
    name: "高性能笔记本电脑",
    slug: "laptop",
    description: "最新型号的高性能笔记本电脑",
    price: 999900,
    minOrderQuantity: 1,
    categoryId: 1,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=300&fit=crop",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=300&fit=crop"
    ],
    priceTiers: [
      { minQuantity: 1, price: 999900 },
      { minQuantity: 5, price: 949900 },
      { minQuantity: 10, price: 899900 },
    ],
  },
  {
    id: 2,
    name: "智能手机",
    slug: "smartphone",
    description: "最新款智能手机",
    price: 799900,
    minOrderQuantity: 1,
    categoryId: 1,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=300&fit=crop",
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=300&fit=crop"
    ],
    priceTiers: [
      { minQuantity: 1, price: 799900 },
      { minQuantity: 5, price: 759900 },
      { minQuantity: 10, price: 719900 },
    ],
  },
  {
    id: 3,
    name: "无线耳机",
    slug: "wireless-earphones",
    description: "高品质无线耳机",
    price: 199900,
    minOrderQuantity: 2,
    categoryId: 1,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=300&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=300&fit=crop"
    ],
    priceTiers: [
      { minQuantity: 2, price: 199900 },
      { minQuantity: 5, price: 189900 },
      { minQuantity: 10, price: 179900 },
    ],
  },
];

// 模拟询价数据
export const inquiries = [
  {
    id: '1',
    productId: '1',
    userId: '2',
    quantity: 500,
    message: '我需要定制带公司logo的会员卡，请问有什么方案？',
    status: 'PENDING',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    productId: '2',
    userId: '2',
    quantity: 1000,
    message: '我们公司需要门禁卡系统，希望了解更多细节。',
    status: 'REPLIED',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// 模拟数据库接口
const mockDb = {
  user: {
    findUnique: async (args: any) => {
      const user = users.find(u => u.id === args.where.id || u.email === args.where.email);
      return user || null;
    },
    findMany: async () => users,
    count: async () => users.length,
    create: async (args: any) => ({ id: Date.now().toString(), ...args.data })
  },
  category: {
    findUnique: async (args: any) => {
      return categories.find(c => c.id === args.where.id || c.slug === args.where.slug) || null;
    },
    findMany: async () => categories,
    count: async () => categories.length
  },
  product: {
    findUnique: async (args: any) => {
      const product = products.find(p => p.id === args.where.id || p.slug === args.where.slug);
      if (!product) return null;
      
      if (args.include?.category) {
        const category = categories.find(c => c.id === product.categoryId);
        return { ...product, category };
      }
      
      if (args.include?.images) {
        return product; // 图片已包含在产品数据中
      }
      
      return product;
    },
    findMany: async (args: any) => {
      let result = [...products];
      
      // 分类过滤
      if (args?.where?.categoryId) {
        result = result.filter(p => p.categoryId === args.where.categoryId);
      }
      
      // 特色产品过滤
      if (args?.where?.featured !== undefined) {
        result = result.filter(p => p.featured === args.where.featured);
      }
      
      // 包含关联数据
      if (args?.include?.category) {
        result = result.map(product => ({
          ...product,
          category: categories.find(c => c.id === product.categoryId)
        }));
      }
      
      return result;
    },
    count: async () => products.length
  },
  inquiry: {
    findUnique: async (args: any) => {
      return inquiries.find(i => i.id === args.where.id) || null;
    },
    findMany: async (args: any) => {
      let result = [...inquiries];
      
      if (args?.where?.userId) {
        result = result.filter(i => i.userId === args.where.userId);
      }
      
      if (args?.where?.productId) {
        result = result.filter(i => i.productId === args.where.productId);
      }
      
      if (args?.where?.status) {
        result = result.filter(i => i.status === args.where.status);
      }
      
      return result;
    },
    count: async () => inquiries.length
  }
};

export default mockDb; 