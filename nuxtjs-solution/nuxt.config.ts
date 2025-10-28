// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  
  modules: ['@nuxtjs/tailwindcss'],
  
  // 混合渲染配置示例
  routeRules: {
    '/': { prerender: true },
    '/users': { swr: 60 }, // 缓存 60 秒
    '/orders': { swr: 60 },
    '/dashboard': { ssr: false }, // 纯客户端渲染
  },
  
  // 运行时配置
  runtimeConfig: {
    // 服务端环境变量
    grpcUserServiceUrl: process.env.GRPC_USER_SERVICE || 'localhost:50051',
    grpcOrderServiceUrl: process.env.GRPC_ORDER_SERVICE || 'localhost:50052',
    
    // 公开的配置（客户端可访问）
    public: {
      apiBase: '/api'
    }
  },
  
  typescript: {
    strict: true,
    typeCheck: true
  }
})
