<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold text-indigo-600">Nuxt.js + gRPC</h1>
            </div>
            <div class="ml-6 flex space-x-8">
              <NuxtLink 
                to="/" 
                class="inline-flex items-center px-1 pt-1 text-sm font-medium"
                active-class="border-b-2 border-indigo-500 text-gray-900"
                exact-active-class="border-b-2 border-indigo-500 text-gray-900"
              >
                首页
              </NuxtLink>
              <NuxtLink 
                to="/users" 
                class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700"
                active-class="border-b-2 border-indigo-500 text-gray-900"
              >
                用户列表
              </NuxtLink>
              <NuxtLink 
                to="/orders" 
                class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700"
                active-class="border-b-2 border-indigo-500 text-gray-900"
              >
                订单列表
              </NuxtLink>
              <NuxtLink 
                to="/dashboard" 
                class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700"
                active-class="border-b-2 border-indigo-500 text-gray-900"
              >
                数据聚合
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main>
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Nuxt.js + gRPC Solution',
  meta: [
    { name: 'description', content: 'Nuxt.js 直接调用 gRPC 服务的解决方案示例' }
  ]
});
</script>
