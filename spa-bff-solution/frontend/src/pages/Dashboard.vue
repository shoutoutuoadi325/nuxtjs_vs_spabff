<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900">数据聚合仪表盘</h2>
        <p class="mt-1 text-sm text-gray-600">
          BFF 层并行调用多个 gRPC 服务并聚合数据后返回给前端
        </p>
      </div>

      <!-- Loading 状态 -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p class="mt-2 text-sm text-gray-600">加载中...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
        <div class="flex">
          <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">加载失败</h3>
            <p class="mt-1 text-sm text-red-700">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- 仪表盘内容 -->
      <div v-else-if="dashboard">
        <!-- 统计卡片 -->
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dt class="text-sm font-medium text-gray-500 truncate">总用户数</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ dashboard.stats.totalUsers }}</dd>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dt class="text-sm font-medium text-gray-500 truncate">总订单数</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ dashboard.stats.totalOrders }}</dd>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dt class="text-sm font-medium text-gray-500 truncate">总收入</dt>
                  <dd class="text-lg font-medium text-gray-900">¥{{ dashboard.stats.totalRevenue.toLocaleString() }}</dd>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dt class="text-sm font-medium text-gray-500 truncate">待处理订单</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ dashboard.stats.pendingOrders }}</dd>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 用户订单详情 -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">用户订单详情</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">BFF 聚合的用户和订单数据</p>
          </div>
          <div class="border-t border-gray-200">
            <ul role="list" class="divide-y divide-gray-200">
              <li v-for="user in dashboard.usersWithOrders" :key="user.id" class="px-4 py-4 sm:px-6">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0">
                      <div class="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <span class="text-green-600 font-medium">{{ user.name.charAt(0) }}</span>
                      </div>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ user.name }}</p>
                      <p class="text-sm text-gray-500">{{ user.email }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-medium text-gray-900">{{ user.orders.length }} 个订单</p>
                    <p class="text-sm text-gray-500">
                      总额: ¥{{ user.orders.reduce((sum, o) => sum + o.amount, 0).toLocaleString() }}
                    </p>
                  </div>
                </div>
                
                <!-- 订单列表 -->
                <div v-if="user.orders.length > 0" class="mt-3 ml-13">
                  <div class="space-y-2">
                    <div 
                      v-for="order in user.orders" 
                      :key="order.id"
                      class="text-sm bg-gray-50 rounded px-3 py-2"
                    >
                      <div class="flex justify-between">
                        <span class="text-gray-600">{{ order.productName }}</span>
                        <span class="font-medium">¥{{ order.amount.toLocaleString() }}</span>
                      </div>
                      <div class="flex justify-between mt-1">
                        <span class="text-gray-500 text-xs">{{ order.createdAt }}</span>
                        <span 
                          :class="[
                            'text-xs px-2 py-0.5 rounded-full',
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          ]"
                        >
                          {{ getStatusText(order.status) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="mt-2 ml-13 text-sm text-gray-500">
                  暂无订单
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- 技术说明 -->
        <div class="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 class="text-sm font-medium text-blue-900 mb-2">💡 数据聚合技术</h3>
          <ul class="text-sm text-blue-800 space-y-1">
            <li>• 前端发起一次 API 请求到 BFF 的 <code class="bg-blue-100 px-1 rounded">/api/dashboard</code></li>
            <li>• BFF 使用 <code class="bg-blue-100 px-1 rounded">Promise.all()</code> 并行调用 User 和 Order 两个 gRPC 服务</li>
            <li>• BFF 在服务端进行数据聚合和统计计算</li>
            <li>• BFF 将聚合后的完整数据返回给前端</li>
            <li>• 前端只需处理渲染逻辑，业务逻辑在 BFF 层</li>
            <li>• BFF 可以独立扩展，不影响前端部署</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getDashboard, type DashboardData } from '@/api';

const dashboard = ref<DashboardData | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    completed: '已完成',
    pending: '待处理',
    shipped: '已发货',
  };
  return map[status] || status;
};

const fetchDashboard = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await getDashboard();
    dashboard.value = response.data;
  } catch (err) {
    error.value = err instanceof Error ? err.message : '获取仪表盘数据失败';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDashboard();
});
</script>
