<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900">订单列表</h2>
        <p class="mt-1 text-sm text-gray-600">
          通过 BFF REST API 获取数据（BFF 调用 Order Service gRPC）
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

      <!-- 订单列表 -->
      <div v-else-if="orders.length > 0" class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" class="divide-y divide-gray-200">
          <li v-for="order in orders" :key="order.id" class="px-6 py-4 hover:bg-gray-50">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium text-green-600">订单 #{{ order.id }}</p>
                  <div class="ml-2 flex-shrink-0">
                    <span 
                      :class="[
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      ]"
                    >
                      {{ getStatusText(order.status) }}
                    </span>
                  </div>
                </div>
                <div class="mt-2 sm:flex sm:justify-between">
                  <div class="sm:flex">
                    <p class="flex items-center text-sm text-gray-900">
                      {{ order.productName }}
                    </p>
                    <p class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      用户ID: {{ order.userId }}
                    </p>
                  </div>
                  <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p class="font-medium text-gray-900">¥{{ order.amount.toLocaleString() }}</p>
                    <span class="mx-2">·</span>
                    <p>{{ order.createdAt }}</p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>

        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div class="flex justify-between items-center">
            <p class="text-sm text-gray-600">
              共 {{ orders.length }} 个订单
            </p>
            <p class="text-sm font-medium text-gray-900">
              总金额: ¥{{ totalAmount.toLocaleString() }}
            </p>
          </div>
        </div>
      </div>

      <!-- 技术说明 -->
      <div class="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 class="text-sm font-medium text-blue-900 mb-2">💡 技术实现</h3>
        <ul class="text-sm text-blue-800 space-y-1">
          <li>• 前端使用 <code class="bg-blue-100 px-1 rounded">axios.get('/api/orders')</code> 调用 BFF API</li>
          <li>• BFF 接收 HTTP 请求并转换为 gRPC 调用</li>
          <li>• BFF 将 gRPC 响应转换为 JSON 返回给前端</li>
          <li>• 前端和 BFF 通过 REST API 通信，接口清晰</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getOrders, type Order } from '@/api';

const orders = ref<Order[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const totalAmount = computed(() => {
  return orders.value.reduce((sum, order) => sum + order.amount, 0);
});

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    completed: '已完成',
    pending: '待处理',
    shipped: '已发货',
  };
  return map[status] || status;
};

const fetchOrders = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await getOrders();
    orders.value = response.data;
  } catch (err) {
    error.value = err instanceof Error ? err.message : '获取订单列表失败';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchOrders();
});
</script>
