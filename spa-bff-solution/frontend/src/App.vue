<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold text-green-600">SPA + BFF</h1>
            </div>
            <div class="ml-6 flex space-x-8">
              <router-link 
                to="/" 
                class="inline-flex items-center px-1 pt-1 text-sm font-medium"
                active-class="border-b-2 border-green-500 text-gray-900"
                exact-active-class="border-b-2 border-green-500 text-gray-900"
              >
                首页
              </router-link>
              <router-link 
                to="/users" 
                class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700"
                active-class="border-b-2 border-green-500 text-gray-900"
              >
                用户列表
              </router-link>
              <router-link 
                to="/orders" 
                class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700"
                active-class="border-b-2 border-green-500 text-gray-900"
              >
                订单列表
              </router-link>
              <router-link 
                to="/dashboard" 
                class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700"
                active-class="border-b-2 border-green-500 text-gray-900"
              >
                数据聚合
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
</script>
