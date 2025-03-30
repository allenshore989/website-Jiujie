"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function DevEntry() {
  const router = useRouter();
  const [status, setStatus] = React.useState<'idle' | 'success' | 'error'>('idle');

  const setupDevAuth = () => {
    try {
      // 设置auth-token (30天有效期)
      Cookies.set('auth-token', 'dev-admin-auth-token', {
        expires: 30,
        path: '/'
      });
      
      // 设置localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('adminUser', '开发管理员');
      
      setStatus('success');
      
      // 2秒后跳转到控制面板
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 2000);
    } catch (error) {
      console.error('设置开发认证失败:', error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">开发者入口</h1>
        
        <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800">
          <p className="text-sm">
            <strong>警告:</strong> 此页面仅用于开发环境，允许绕过正常的认证流程直接访问管理后台。
          </p>
        </div>
        
        {status === 'idle' && (
          <button
            onClick={setupDevAuth}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
          >
            一键登录后台 (开发模式)
          </button>
        )}
        
        {status === 'success' && (
          <div className="p-4 bg-green-50 border-l-4 border-green-400 text-green-800">
            <p>认证信息已设置成功！正在跳转到控制面板...</p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-800">
            <p>设置认证信息失败，请检查控制台错误。</p>
            <button
              onClick={setupDevAuth}
              className="mt-4 w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none"
            >
              重试
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 