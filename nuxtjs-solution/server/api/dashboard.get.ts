/**
 * Nuxt Server API: 获取仪表盘数据（数据聚合示例）
 * 
 * 这个 API 展示了如何在服务端聚合多个 gRPC 服务的数据
 * URL: GET /api/dashboard
 */

import { userServiceClient, orderServiceClient } from '../grpc/mock-client';
import type { UserWithOrders } from '../grpc/mock-client';

export default defineEventHandler(async (event) => {
  try {
    console.log('[Nuxt API] 调用多个 gRPC 服务进行数据聚合...');
    
    // 并行调用多个 gRPC 服务
    const [users, orders] = await Promise.all([
      userServiceClient.getUsers(),
      orderServiceClient.getOrders(),
    ]);
    
    // 数据聚合：将用户和订单数据组合
    const usersWithOrders: UserWithOrders[] = users.map(user => ({
      ...user,
      orders: orders.filter(order => order.userId === user.id),
    }));
    
    // 计算统计数据
    const stats = {
      totalUsers: users.length,
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.amount, 0),
      pendingOrders: orders.filter(o => o.status === 'pending').length,
    };
    
    console.log('[Nuxt API] 数据聚合完成');
    
    return {
      success: true,
      data: {
        stats,
        usersWithOrders,
      },
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[Nuxt API] 获取仪表盘数据失败:', error);
    
    throw createError({
      statusCode: 500,
      statusMessage: '获取仪表盘数据失败',
      message: error instanceof Error ? error.message : '未知错误',
    });
  }
});
