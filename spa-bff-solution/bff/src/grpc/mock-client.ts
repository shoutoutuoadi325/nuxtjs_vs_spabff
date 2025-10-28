/**
 * Mock gRPC 客户端
 * 在实际项目中，这里应该是真实的 gRPC 客户端
 */

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  productName: string;
  amount: number;
  status: string;
  createdAt: string;
}

export interface UserWithOrders extends User {
  orders: Order[];
}

// Mock 数据
const mockUsers: User[] = [
  { id: '1', name: '张三', email: 'zhangsan@example.com', createdAt: '2024-01-15' },
  { id: '2', name: '李四', email: 'lisi@example.com', createdAt: '2024-02-20' },
  { id: '3', name: '王五', email: 'wangwu@example.com', createdAt: '2024-03-10' },
];

const mockOrders: Order[] = [
  { id: 'O1', userId: '1', productName: 'MacBook Pro', amount: 12999, status: 'completed', createdAt: '2024-10-01' },
  { id: 'O2', userId: '1', productName: 'iPhone 15', amount: 7999, status: 'pending', createdAt: '2024-10-15' },
  { id: 'O3', userId: '2', productName: 'iPad Air', amount: 4999, status: 'completed', createdAt: '2024-10-10' },
  { id: 'O4', userId: '3', productName: 'AirPods Pro', amount: 1999, status: 'shipped', createdAt: '2024-10-20' },
];

/**
 * Mock gRPC 用户服务客户端
 */
export class UserServiceClient {
  async getUsers(): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log('[gRPC] UserService.getUsers() called');
    return mockUsers;
  }

  async getUserById(id: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 50));
    console.log(`[gRPC] UserService.getUserById(${id}) called`);
    return mockUsers.find(user => user.id === id) || null;
  }
}

/**
 * Mock gRPC 订单服务客户端
 */
export class OrderServiceClient {
  async getOrders(): Promise<Order[]> {
    await new Promise(resolve => setTimeout(resolve, 120));
    console.log('[gRPC] OrderService.getOrders() called');
    return mockOrders;
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    await new Promise(resolve => setTimeout(resolve, 80));
    console.log(`[gRPC] OrderService.getOrdersByUserId(${userId}) called`);
    return mockOrders.filter(order => order.userId === userId);
  }
}

// 导出单例实例
export const userServiceClient = new UserServiceClient();
export const orderServiceClient = new OrderServiceClient();
