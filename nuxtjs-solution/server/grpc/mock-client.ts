/**
 * Mock gRPC 客户端
 * 在实际项目中，这里应该是真实的 gRPC 客户端
 * 
 * 真实实现示例：
 * import * as grpc from '@grpc/grpc-js';
 * import * as protoLoader from '@grpc/proto-loader';
 * 
 * const packageDefinition = protoLoader.loadSync('user.proto');
 * const proto = grpc.loadPackageDefinition(packageDefinition);
 * const client = new proto.UserService(address, grpc.credentials.createInsecure());
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
  /**
   * 获取所有用户
   */
  async getUsers(): Promise<User[]> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockUsers;
  }

  /**
   * 根据 ID 获取用户
   */
  async getUserById(id: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return mockUsers.find(user => user.id === id) || null;
  }

  /**
   * 创建用户
   */
  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const newUser: User = {
      id: String(mockUsers.length + 1),
      ...userData,
      createdAt: new Date().toISOString().split('T')[0],
    };
    mockUsers.push(newUser);
    return newUser;
  }
}

/**
 * Mock gRPC 订单服务客户端
 */
export class OrderServiceClient {
  /**
   * 获取所有订单
   */
  async getOrders(): Promise<Order[]> {
    await new Promise(resolve => setTimeout(resolve, 120));
    return mockOrders;
  }

  /**
   * 根据用户 ID 获取订单
   */
  async getOrdersByUserId(userId: string): Promise<Order[]> {
    await new Promise(resolve => setTimeout(resolve, 80));
    return mockOrders.filter(order => order.userId === userId);
  }

  /**
   * 创建订单
   */
  async createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const newOrder: Order = {
      id: `O${mockOrders.length + 1}`,
      ...orderData,
      createdAt: new Date().toISOString().split('T')[0],
    };
    mockOrders.push(newOrder);
    return newOrder;
  }
}

// 导出单例实例
export const userServiceClient = new UserServiceClient();
export const orderServiceClient = new OrderServiceClient();
