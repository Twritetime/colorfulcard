import mockDb from './mock-db';

// 导出模拟数据库作为db对象
export const db = mockDb;

// 模拟SQL函数
export const sql = async (query: string, ...params: any[]) => {
  console.log('模拟SQL查询:', query, params);
  return [{ version: 'Mock Database 1.0' }];
}; 