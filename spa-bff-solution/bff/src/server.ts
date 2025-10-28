import express from 'express';
import cors from 'cors';
import usersRouter from './routes/users.js';
import ordersRouter from './routes/orders.js';
import dashboardRouter from './routes/dashboard.js';

const app = express();
const PORT = process.env.PORT || 4000;

// 中间件
app.use(cors());
app.use(express.json());

// 请求日志
app.use((req, res, next) => {
  console.log(`[BFF] ${req.method} ${req.path}`);
  next();
});

// 路由
app.use('/api/users', usersRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/dashboard', dashboardRouter);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'BFF' });
});

// 错误处理
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[BFF Error]', err);
  res.status(500).json({
    success: false,
    error: err.message || '服务器内部错误',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 BFF Server running on http://localhost:${PORT}`);
  console.log(`📊 API Endpoints:`);
  console.log(`   - GET  /api/users`);
  console.log(`   - GET  /api/orders`);
  console.log(`   - GET  /api/dashboard`);
});
