import express from 'express';
import { userServiceClient, orderServiceClient, type UserWithOrders } from '../grpc/mock-client.js';

const router = express.Router();

/**
 * GET /api/dashboard
 * 获取仪表盘数据（数据聚合）
 * 
 * 这个接口展示了 BFF 的核心价值：
 * 1. 并行调用多个 gRPC 服务
 * 2. 在服务端聚合数据
 * 3. 返回符合前端需求的数据结构
 */
router.get('/', async (req, res, next) => {
  try {
    console.log('[BFF] 开始数据聚合，调用多个 gRPC 服务...');
    
    // 并行调用多个 gRPC 服务
    const [users, orders] = await Promise.all([
      userServiceClient.getUsers(),
      orderServiceClient.getOrders(),
    ]);
    
    console.log('[BFF] gRPC 调用完成，开始数据聚合...');
    
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
    
    console.log('[BFF] 数据聚合完成');
    
    // 返回聚合后的数据
    res.json({
      success: true,
      data: {
        stats,
        usersWithOrders,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
