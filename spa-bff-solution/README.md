# SPA + BFF 方案说明

## 架构概述

SPA + BFF 方案由两个独立的服务组成：
- **前端**：Vue 3 SPA（客户端渲染）
- **BFF**：Backend For Frontend（专门为前端服务的后端）

```
Browser → BFF (REST API) → gRPC Services
  (SPA)   (Express.js)
```

## 关键特性

### 1. 前后端完全分离

- 前端和 BFF 是独立的项目
- 可以独立开发、测试、部署
- 不同团队可以并行工作

### 2. BFF 层的职责

- **协议转换**：gRPC ↔ REST/JSON
- **数据聚合**：调用多个微服务并组合数据
- **权限验证**：统一的认证和授权
- **API 网关**：统一的入口

### 3. 独立扩展

- 前端可以部署到 CDN（静态文件）
- BFF 可以根据负载独立扩展
- 不会互相影响

## 项目结构

```
spa-bff-solution/
├── frontend/          # Vue 3 SPA
│   ├── src/
│   │   ├── pages/    # 页面组件
│   │   ├── api/      # API 客户端
│   │   ├── App.vue
│   │   └── main.ts
│   ├── vite.config.ts
│   └── package.json
└── bff/              # BFF 服务
    ├── src/
    │   ├── routes/   # REST API 路由
    │   ├── grpc/     # gRPC 客户端
    │   └── server.ts
    ├── tsconfig.json
    └── package.json
```

## BFF 实现

### 1. 定义 Proto 文件（示例）

```protobuf
// protos/user.proto
syntax = "proto3";

package user;

service UserService {
  rpc GetUsers (Empty) returns (UserList);
}

message User {
  string id = 1;
  string name = 2;
  string email = 3;
}

message UserList {
  repeated User users = 1;
}
```

### 2. 创建 gRPC 客户端

```typescript
// bff/src/grpc/userClient.ts
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const PROTO_PATH = './protos/user.proto';

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDefinition) as any;

export const userClient = new proto.user.UserService(
  process.env.USER_SERVICE_URL || 'localhost:50051',
  grpc.credentials.createInsecure()
);
```

### 3. 实现 REST API 路由

```typescript
// bff/src/routes/users.ts
import express from 'express';
import { userClient } from '../grpc/userClient';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    // 调用 gRPC 服务
    const response = await new Promise((resolve, reject) => {
      userClient.GetUsers({}, (error, response) => {
        if (error) reject(error);
        else resolve(response);
      });
    });
    
    // 返回 JSON
    res.json({
      success: true,
      data: response.users
    });
  } catch (error) {
    next(error);
  }
});

export default router;
```

### 4. 数据聚合示例

```typescript
// bff/src/routes/dashboard.ts
router.get('/', async (req, res) => {
  // 并行调用多个 gRPC 服务
  const [users, orders] = await Promise.all([
    callUserService(),
    callOrderService()
  ]);
  
  // 聚合数据
  const result = users.map(user => ({
    ...user,
    orders: orders.filter(o => o.userId === user.id)
  }));
  
  res.json({ data: result });
});
```

## 前端实现

### 1. API 客户端

```typescript
// frontend/src/api/index.ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
});

export const getUsers = () => api.get('/users');
export const getOrders = () => api.get('/orders');
```

### 2. 组件中使用

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getUsers } from '@/api';

const users = ref([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const response = await getUsers();
    users.value = response.data.data;
  } finally {
    loading.value = false;
  }
});
</script>
```

## 开发环境

### 启动 BFF 服务

```bash
cd bff
npm install
npm run dev
```

BFF 运行在 http://localhost:4000

### 启动前端

```bash
cd frontend
npm install
npm run dev
```

前端运行在 http://localhost:5173

**注意**：Vite 会自动代理 `/api` 请求到 BFF。

## 生产部署

### 前端部署

前端构建后是静态文件，可以部署到 CDN：

```bash
cd frontend
npm run build
# dist/ 目录包含静态文件
```

部署到：
- Nginx
- Vercel
- Netlify
- AWS S3 + CloudFront
- 阿里云 OSS

**Nginx 配置示例**：

```nginx
server {
  listen 80;
  server_name example.com;
  
  # 前端静态文件
  location / {
    root /var/www/frontend;
    try_files $uri $uri/ /index.html;
  }
  
  # 代理 API 到 BFF
  location /api {
    proxy_pass http://bff:4000;
    proxy_set_header Host $host;
  }
}
```

### BFF 部署

**方式 1：Docker**

```dockerfile
# bff/Dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --production

COPY . .
RUN npm run build

ENV NODE_ENV=production
EXPOSE 4000

CMD ["node", "dist/server.js"]
```

**方式 2：PM2**

```bash
npm install -g pm2
pm2 start dist/server.js --name bff
```

### Docker Compose 示例

```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - bff
  
  bff:
    build: ./bff
    ports:
      - "4000:4000"
    environment:
      - USER_SERVICE_URL=user-service:50051
      - ORDER_SERVICE_URL=order-service:50052
    depends_on:
      - user-service
      - order-service
```

## API 契约管理

### 使用 OpenAPI/Swagger

```typescript
// bff/src/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BFF API',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.ts'],
};

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
```

在路由中添加注释：

```typescript
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: 获取用户列表
 *     responses:
 *       200:
 *         description: 成功
 */
router.get('/', async (req, res) => {
  // ...
});
```

## 性能优化

### 1. BFF 缓存

```typescript
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 60 });

router.get('/users', async (req, res) => {
  const cacheKey = 'users:all';
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return res.json(cached);
  }
  
  const users = await getUsersFromGrpc();
  cache.set(cacheKey, users);
  res.json(users);
});
```

### 2. 前端代码分割

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router'],
          'ui': ['axios']
        }
      }
    }
  }
});
```

### 3. 前端缓存

```typescript
// 使用 Vue Query (TanStack Query)
import { useQuery } from '@tanstack/vue-query';

const { data, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: getUsers,
  staleTime: 60000, // 1 分钟内不重新请求
});
```

## 优缺点

### 优点 ✅

1. **前后端完全分离**：独立开发、部署
2. **可扩展性强**：前端 CDN，BFF 独立扩展
3. **灵活性高**：BFF 可以处理复杂逻辑
4. **团队协作**：前后端并行开发
5. **技术选型自由**：前端和 BFF 可以用不同技术
6. **多端复用**：BFF 可以服务 Web、移动端

### 缺点 ❌

1. **架构复杂**：需要维护两个项目
2. **开发成本高**：需要更多的开发和运维工作
3. **首屏慢**：纯 CSR，需要加载 JS
4. **SEO 差**：需要额外处理（SSR 或预渲染）
5. **调试复杂**：需要同时运行两个服务

## 适用场景

- ✅ 大型企业应用
- ✅ 需要独立扩展 API 层
- ✅ 前后端团队分离
- ✅ BFF 有复杂业务逻辑
- ✅ 多端应用（Web + Mobile）
- ✅ 需要独立版本控制
- ❌ 小型项目（过度设计）
- ❌ 需要 SEO（建议用 Nuxt）
- ❌ 前端主导的团队

## 安全最佳实践

### 1. CORS 配置

```typescript
import cors from 'cors';

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### 2. Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100 // 最多 100 个请求
});

app.use('/api', limiter);
```

### 3. 认证

```typescript
import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

app.use('/api', authMiddleware);
```

## 常见问题

### Q: 如何处理 gRPC 错误？

```typescript
router.get('/users', async (req, res, next) => {
  try {
    const users = await callGrpcService();
    res.json({ data: users });
  } catch (error) {
    if (error.code === grpc.status.NOT_FOUND) {
      return res.status(404).json({ error: 'Not found' });
    }
    next(error);
  }
});
```

### Q: 如何实现 API 版本控制？

```typescript
// v1 routes
app.use('/api/v1/users', usersV1Router);

// v2 routes
app.use('/api/v2/users', usersV2Router);
```

### Q: 如何监控 BFF？

```typescript
import prometheus from 'prom-client';

const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration',
  labelNames: ['method', 'route', 'status_code']
});

app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, req.route?.path, res.statusCode.toString())
      .observe(duration);
  });
  
  next();
});
```

## 参考资料

- [Vue 3 文档](https://vuejs.org/)
- [Vite 文档](https://vitejs.dev/)
- [Express.js 文档](https://expressjs.com/)
- [gRPC-Node 文档](https://grpc.io/docs/languages/node/)
- [BFF 模式](https://samnewman.io/patterns/architectural/bff/)
