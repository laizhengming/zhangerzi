import BaseLogin from "@/views/login/BaseLogin.vue";
import SysLogin from "@/views/login/SysLogin.vue";
import UserLogin from "@/views/login/UserLogin.vue";
import UserIndex from "@/views/user/UserIndex.vue";
import AdminIndex from "@/views/admin/AdminIndex.vue";
import EmployeeIndex from "@/views/employee/EmployeeIndex.vue";
import Vue from "vue";
import VueRouter from "vue-router";

// 使用 VueRouter
Vue.use(VueRouter);

// 路由配置
const routes = [
  {
    path: '/',
    name: 'UserLogin',
    component: UserLogin
  },
  {
    path: '/admin/login',
    name: 'SysLogin',
    component: SysLogin
  },
  {
    path: '/baseLogin',
    name: 'BaseLogin',
    component: BaseLogin
  },
  {
    path: '/index',
    name: 'UserIndex',
    component: UserIndex
  },
  {
    path: '/a/index',
    name: 'AdminIndex',
    component: AdminIndex
  },
  {
    path: '/e/index',
    name: 'EmployeeIndex',
    component: EmployeeIndex
  }
];

// 创建 Router 实例
const router = new VueRouter({
  mode: 'history', // 使用 history 模式
  base: process.env.BASE_URL,
  routes
});

export default router;