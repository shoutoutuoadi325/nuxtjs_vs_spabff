<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <div class="text-center">
        <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          <span class="block">Nuxt.js 方案</span>
          <span class="block text-indigo-600">服务端直接调用 gRPC</span>
        </h1>
        <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          在 Nuxt.js 的 Server API 中直接调用后端 gRPC 服务，无需额外的 BFF 层
        </p>
      </div>

      <div class="mt-10">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <!-- 特性卡片 -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dt class="text-sm font-medium text-gray-500 truncate">SSR 性能</dt>
                  <dd class="text-lg font-medium text-gray-900">快速首屏</dd>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dt class="text-sm font-medium text-gray-500 truncate">SEO 友好</dt>
                  <dd class="text-lg font-medium text-gray-900">优秀</dd>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dt class="text-sm font-medium text-gray-500 truncate">架构复杂度</dt>
                  <dd class="text-lg font-medium text-gray-900">简单</dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-10 bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">架构说明</h3>
        </div>
        <div class="border-t border-gray-200 px-4 py-5 sm:p-6">
          <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">前端框架</dt>
              <dd class="mt-1 text-sm text-gray-900">Nuxt 3 (Vue 3 + SSR)</dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">后端协议</dt>
              <dd class="mt-1 text-sm text-gray-900">gRPC</dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">API 层</dt>
              <dd class="mt-1 text-sm text-gray-900">Nuxt Server API（内置）</dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">部署方式</dt>
              <dd class="mt-1 text-sm text-gray-900">单一 Node.js 服务</dd>
            </div>
            <div class="sm:col-span-2">
              <dt class="text-sm font-medium text-gray-500">工作流程</dt>
              <dd class="mt-1 text-sm text-gray-900">
                浏览器请求 → Nuxt Server → gRPC 服务 → 服务端渲染 → 返回 HTML
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div class="mt-8 text-center">
        <p class="text-sm text-gray-600">
          点击导航栏查看不同功能的实现示例
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Nuxt.js 方案 - 首页'
});
</script>
