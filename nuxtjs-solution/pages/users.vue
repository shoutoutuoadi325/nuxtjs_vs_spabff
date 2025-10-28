<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900">用户列表</h2>
        <p class="mt-1 text-sm text-gray-600">
          通过 Nuxt Server API 调用 User Service gRPC
        </p>
      </div>

      <!-- Loading 状态 -->
      <div v-if="pending" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
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
            <p class="mt-1 text-sm text-red-700">{{ error.message }}</p>
          </div>
        </div>
      </div>

      <!-- 用户列表 -->
      <div v-else-if="data?.success" class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" class="divide-y divide-gray-200">
          <li v-for="user in data.data" :key="user.id" class="px-6 py-4 hover:bg-gray-50">
            <div class="flex items-center justify-between">
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span class="text-indigo-600 font-medium">{{ user.name.charAt(0) }}</span>
                    </div>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ user.name }}</p>
                    <p class="text-sm text-gray-500">{{ user.email }}</p>
                  </div>
                </div>
              </div>
              <div class="text-sm text-gray-500">
                加入于 {{ user.createdAt }}
              </div>
            </div>
          </li>
        </ul>
        
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p class="text-sm text-gray-600">
            共 {{ data.data.length }} 个用户 · 数据获取时间: {{ new Date(data.timestamp).toLocaleString('zh-CN') }}
          </p>
        </div>
      </div>

      <!-- 技术说明 -->
      <div class="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 class="text-sm font-medium text-blue-900 mb-2">💡 技术实现</h3>
        <ul class="text-sm text-blue-800 space-y-1">
          <li>• 使用 <code class="bg-blue-100 px-1 rounded">useFetch('/api/users')</code> 在服务端获取数据</li>
          <li>• Server API 位于 <code class="bg-blue-100 px-1 rounded">server/api/users.get.ts</code></li>
          <li>• 首次访问时，数据在服务端渲染，HTML 中已包含用户数据（SSR）</li>
          <li>• 后续导航时，客户端通过 API 调用获取数据（SPA 模式）</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Nuxt 的 useFetch 会在服务端和客户端智能执行
// 首次加载：服务端调用 API → SSR 渲染
// 后续导航：客户端调用 API → 更新数据
const { data, pending, error } = await useFetch('/api/users');

useHead({
  title: '用户列表 - Nuxt.js 方案'
});
</script>
