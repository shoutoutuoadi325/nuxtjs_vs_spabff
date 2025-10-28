# Nuxt.js 方案说明

## 架构概述

Nuxt.js 方案是一个单体应用，将前端和 API 层集成在同一个 Nuxt.js 项目中。

```
Browser → Nuxt.js Server → gRPC Services
         (SSR + API)
```

## 关键特性

### 1. 服务端渲染 (SSR)

- **首屏快速**：HTML 在服务端生成，包含完整数据
- **SEO 友好**：搜索引擎可以直接抓取内容
- **混合渲染**：可配置部分页面 SSR，部分页面 CSR

### 2. Nuxt Server API

位于 `server/api/` 目录下的文件自动成为 API 端点：

```typescript
// server/api/users.get.ts
export default defineEventHandler(async (event) => {
  // 直接调用 gRPC
  const users = await grpcClient.getUsers();
  return { data: users };
});
```

### 3. 统一的技术栈

- 前端：Vue 3 + TypeScript
- 后端：Nitro (Nuxt Server) + TypeScript
- 完全的类型共享

## 项目结构

```
nuxtjs-solution/
├── pages/              # 页面组件（自动路由）
│   ├── index.vue      # 首页
│   ├── users.vue      # 用户列表
│   ├── orders.vue     # 订单列表
│   └── dashboard.vue  # 数据聚合
├── server/
│   ├── api/           # API 路由
│   │   ├── users.get.ts
│   │   ├── orders.get.ts
│   │   └── dashboard.get.ts
│   └── grpc/          # gRPC 客户端
│       └── mock-client.ts
├── components/        # Vue 组件
├── nuxt.config.ts    # Nuxt 配置
└── package.json
```

## 如何使用 gRPC

### 1. 定义 Proto 文件（示例）

```protobuf
// protos/user.proto
syntax = "proto3";

package user;

service UserService {
  rpc GetUsers (Empty) returns (UserList);
  rpc GetUserById (UserIdRequest) returns (User);
}

message User {
  string id = 1;
  string name = 2;
  string email = 3;
  string created_at = 4;
}

message UserList {
  repeated User users = 1;
}
```

### 2. 生成 TypeScript 代码

```bash
npm install -D @grpc/grpc-js @grpc/proto-loader
```

### 3. 创建 gRPC 客户端

```typescript
// server/grpc/client.ts
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const PROTO_PATH = './protos/user.proto';

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDefinition) as any;

export const userClient = new proto.user.UserService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);
```

### 4. 在 Server API 中使用

```typescript
// server/api/users.get.ts
import { userClient } from '../grpc/client';

export default defineEventHandler(async (event) => {
  return new Promise((resolve, reject) => {
    userClient.GetUsers({}, (error: any, response: any) => {
      if (error) reject(error);
      else resolve({ data: response.users });
    });
  });
});
```

## 配置项

### nuxt.config.ts

```typescript
export default defineNuxtConfig({
  // 混合渲染规则
  routeRules: {
    '/': { prerender: true },           // 静态生成
    '/users': { swr: 60 },              // 缓存 60 秒
    '/admin/**': { ssr: false },        // 纯 SPA
  },
  
  // 运行时配置
  runtimeConfig: {
    // 私有（仅服务端）
    grpcUserService: 'localhost:50051',
    grpcOrderService: 'localhost:50052',
    
    // 公开（客户端可访问）
    public: {
      apiBase: '/api'
    }
  }
});
```

## 部署

### 开发环境

```bash
npm install
npm run dev
```

访问 http://localhost:3000

### 生产部署

**方式 1：Node.js 服务器**

```bash
npm run build
npm run preview
```

**方式 2：Docker**

```dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --production

COPY . .
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
```

**方式 3：云平台（Vercel, Netlify 等）**

Nuxt 自动适配各种部署平台。

## 性能优化

### 1. 缓存策略

```typescript
// server/api/users.get.ts
export default defineCachedEventHandler(
  async (event) => {
    const users = await grpcClient.getUsers();
    return { data: users };
  },
  {
    maxAge: 60, // 缓存 60 秒
    getKey: (event) => 'users:all'
  }
);
```

### 2. 延迟加载

```vue
<script setup>
// 立即加载（阻塞渲染）
const { data } = await useFetch('/api/users');

// 延迟加载（不阻塞渲染）
const { data } = useLazyFetch('/api/users');
</script>
```

### 3. 静态生成

```bash
npm run generate
```

生成静态 HTML 文件，可以部署到 CDN。

## 优缺点

### 优点 ✅

1. **开发简单**：单一项目，统一技术栈
2. **SEO 优秀**：服务端渲染
3. **首屏快速**：HTML 包含数据
4. **部署简单**：单一服务
5. **类型安全**：完全的 TypeScript 支持

### 缺点 ❌

1. **服务器负载高**：SSR 需要计算资源
2. **扩展性受限**：前端和 API 耦合
3. **学习曲线**：需要理解 SSR 概念
4. **灵活性低**：不适合复杂的 BFF 逻辑

## 适用场景

- ✅ 电商网站（需要 SEO）
- ✅ 内容网站（博客、新闻）
- ✅ 营销页面
- ✅ 小型到中型应用
- ✅ 前端主导的团队
- ❌ 大型企业应用（建议用 BFF）
- ❌ 需要独立扩展 API 层
- ❌ 多个前端共享 API

## 常见问题

### Q: 如何处理环境变量？

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    grpcUserService: process.env.GRPC_USER_SERVICE || 'localhost:50051',
  }
});

// server/api/users.ts
const config = useRuntimeConfig();
const client = createClient(config.grpcUserService);
```

### Q: 如何添加认证？

```typescript
// server/middleware/auth.ts
export default defineEventHandler((event) => {
  const token = getHeader(event, 'authorization');
  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    });
  }
});
```

### Q: 如何处理 CORS？

Nuxt Server API 不需要 CORS（同源）。如果需要：

```typescript
// server/middleware/cors.ts
export default defineEventHandler((event) => {
  setHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST',
  });
});
```

## 参考资料

- [Nuxt 3 文档](https://nuxt.com/)
- [Nuxt Server API](https://nuxt.com/docs/guide/directory-structure/server)
- [gRPC-Node 文档](https://grpc.io/docs/languages/node/)
