import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import './style.css';

// 导入页面组件
import Home from './pages/Home.vue';
import Users from './pages/Users.vue';
import Orders from './pages/Orders.vue';
import Dashboard from './pages/Dashboard.vue';

// 创建路由
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/users', component: Users },
    { path: '/orders', component: Orders },
    { path: '/dashboard', component: Dashboard },
  ],
});

const app = createApp(App);
app.use(router);
app.mount('#app');
