import axios from 'axios';

// 创建 axios 实例
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 响应拦截器
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

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

export interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

export interface DashboardData {
  stats: DashboardStats;
  usersWithOrders: UserWithOrders[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

/**
 * 获取用户列表
 */
export const getUsers = () => {
  return api.get<any, ApiResponse<User[]>>('/users');
};

/**
 * 获取订单列表
 */
export const getOrders = (userId?: string) => {
  return api.get<any, ApiResponse<Order[]>>('/orders', {
    params: userId ? { userId } : undefined,
  });
};

/**
 * 获取仪表盘数据
 */
export const getDashboard = () => {
  return api.get<any, ApiResponse<DashboardData>>('/dashboard');
};

export default api;
