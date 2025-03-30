"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';

// 移除客户端组件中的元数据导出
// export const metadata = {
//   title: '管理员登录',
//   description: '易经环境设计后台管理系统登录入口',
// };

// 定义登录表单数据类型
interface LoginFormData {
  username: string;
  password: string;
  remember: boolean;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/admin/dashboard';
  
  const [formData, setFormData] = React.useState<LoginFormData>({
    username: '',
    password: '',
    remember: false
  });
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // 组件加载时检查是否已登录
  React.useEffect(() => {
    const authToken = Cookies.get('auth-token');
    if (authToken) {
      router.push(returnUrl);
    }
  }, [router, returnUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: LoginFormData) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 调用登录API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '登录失败');
      }

      const data = await response.json();
      
      // 设置认证令牌到cookie
      const tokenExpiry = formData.remember ? 7 : 1; // 记住登录7天，否则1天
      Cookies.set('auth-token', data.token, { 
        expires: tokenExpiry, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
      
      // 如果需要，存储用户信息
      if (formData.remember) {
        localStorage.setItem('adminUser', data.user.name || formData.username);
        localStorage.setItem('isLoggedIn', 'true');
      }
      
      // 跳转到管理页面或returnUrl
      router.push(returnUrl);
    } catch (err: any) {
      // 回退到简单认证机制（仅用于开发环境）
      if (process.env.NODE_ENV === 'development') {
        if (formData.username === 'admin' && formData.password === 'admin123') {
          // 设置一个简单的认证令牌
          Cookies.set('auth-token', 'admin-auth-token', { 
            expires: formData.remember ? 7 : 1, 
            secure: false,
            sameSite: 'lax'
          });
          
          if (formData.remember) {
            localStorage.setItem('adminUser', formData.username);
            localStorage.setItem('isLoggedIn', 'true');
          }
          
          router.push(returnUrl);
          return;
        }
      }
      
      setError(err.message || '用户名或密码错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-bold text-primary">易经环境设计</h1>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 font-mashan">
            后台管理系统
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            请输入您的管理员凭据登录
          </p>
          <div className="mt-2 rounded-md bg-blue-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-800">
                  <strong>开发环境默认账号:</strong> admin<br />
                  <strong>密码:</strong> admin123
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">用户名</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="用户名"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">密码</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="密码"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                checked={formData.remember}
                onChange={handleChange}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                记住我
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-primary hover:text-primary/80">
                忘记密码?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {loading ? (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-primary/90 group-hover:text-primary/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
              {loading ? '登录中...' : '登录'}
            </button>
          </div>
        </form>
        
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 text-center">
            <Link 
              href="/admin/dev-entry" 
              className="inline-block text-sm text-blue-600 hover:text-blue-800 border border-blue-300 rounded-md px-3 py-2 hover:bg-blue-50"
            >
              开发模式入口 (绕过认证)
            </Link>
          </div>
        )}
        
        <div className="text-center mt-4">
          <Link href="/" className="font-medium text-sm text-gray-600 hover:text-gray-900">
            返回首页
          </Link>
        </div>
      </div>
      
      <div className="mt-16 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} 易经环境设计 - 版权所有</p>
      </div>
    </div>
  );
} 