/**
 * Nuxt Server API: 获取订单列表
 * 
 * URL: GET /api/orders
 * Query: userId (可选) - 过滤特定用户的订单
 */

import { orderServiceClient } from '../grpc/mock-client';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const userId = query.userId as string | undefined;
    
    console.log('[Nuxt API] 调用 Order Service gRPC...');
    
    // 调用 gRPC 服务
    const orders = userId 
      ? await orderServiceClient.getOrdersByUserId(userId)
      : await orderServiceClient.getOrders();
    
    console.log(`[Nuxt API] 成功获取 ${orders.length} 个订单`);
    
    return {
      success: true,
      data: orders,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[Nuxt API] 获取订单失败:', error);
    
    throw createError({
      statusCode: 500,
      statusMessage: '获取订单列表失败',
      message: error instanceof Error ? error.message : '未知错误',
    });
  }
});
