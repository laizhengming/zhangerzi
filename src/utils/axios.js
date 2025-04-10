// src/api/axios.js
import axios from 'axios';

// 创建 Axios 实例
const service = axios.create({
  baseURL: 'http://localhost:8081/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么，比如添加 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 对响应数据做些处理
    if (response.data.code === 401) {
      if (localStorage.getItem('accountType') === 0) {
        localStorage.removeItem('token');
        localStorage.removeItem('accountType');
        // 未授权，跳转到登录页面
      window.location.href = '/';
}
      
    }
    return response.data;
  },
  error => {
    // 对响应错误做些处理
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        // 未授权，跳转到登录页面
        window.location.href = '/';
      } else if (status === 403) {
        // 权限不足，提示用户
        alert('权限不足');
      } else if (status === 500) {
        // 服务器错误，提示用户
        alert('服务器错误');
      }
    }
    return Promise.reject(error);
  }
);

export default service;