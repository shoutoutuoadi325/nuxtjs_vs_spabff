import express from 'express';
import { orderServiceClient } from '../grpc/mock-client.js';

const router = express.Router();

/**
 * GET /api/orders
 * 获取订单列表
 * Query: userId (可选) - 过滤特定用户的订单
 */
router.get('/', async (req, res, next) => {
  try {
    const userId = req.query.userId as string | undefined;
    
    console.log('[BFF] 调用 Order Service gRPC...');
    
    // 调用 gRPC 服务
    const orders = userId 
      ? await orderServiceClient.getOrdersByUserId(userId)
      : await orderServiceClient.getOrders();
    
    console.log(`[BFF] 成功获取 ${orders.length} 个订单`);
    
    // 返回 REST API 响应
    res.json({
      success: true,
      data: orders,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
