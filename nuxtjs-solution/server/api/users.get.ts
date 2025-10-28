/**
 * Nuxt Server API: 获取用户列表
 * 
 * 这个 API 在服务端直接调用 gRPC 服务
 * URL: GET /api/users
 */

import { userServiceClient } from '../grpc/mock-client';

export default defineEventHandler(async (event) => {
  try {
    console.log('[Nuxt API] 调用 User Service gRPC...');
    
    // 直接在服务端调用 gRPC 服务
    const users = await userServiceClient.getUsers();
    
    console.log(`[Nuxt API] 成功获取 ${users.length} 个用户`);
    
    return {
      success: true,
      data: users,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[Nuxt API] 获取用户失败:', error);
    
    throw createError({
      statusCode: 500,
      statusMessage: '获取用户列表失败',
      message: error instanceof Error ? error.message : '未知错误',
    });
  }
});
