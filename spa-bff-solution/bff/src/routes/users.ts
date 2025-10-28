import express from 'express';
import { userServiceClient } from '../grpc/mock-client.js';

const router = express.Router();

/**
 * GET /api/users
 * 获取用户列表
 */
router.get('/', async (req, res, next) => {
  try {
    console.log('[BFF] 调用 User Service gRPC...');
    
    // 调用 gRPC 服务
    const users = await userServiceClient.getUsers();
    
    console.log(`[BFF] 成功获取 ${users.length} 个用户`);
    
    // 返回 REST API 响应
    res.json({
      success: true,
      data: users,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/users/:id
 * 根据 ID 获取用户
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`[BFF] 调用 User Service gRPC 获取用户 ${id}...`);
    
    const user = await userServiceClient.getUserById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: '用户不存在',
      });
    }
    
    res.json({
      success: true,
      data: user,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
