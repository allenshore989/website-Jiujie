"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminSetupPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'success' | 'error'>('idle');
  const [adminInfo, setAdminInfo] = React.useState<{
    id?: string;
    username?: string;
    password?: string;
  } | null>(null);

  const createAdminAccount = async () => {
    try {
      setLoading(true);
      setMessage('正在创建管理员账户...');
      
      // 调用创建管理员API
      const response = await fetch('/api/admin/create-emergency-admin');
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (data.adminExists) {
        setStatus('success');
        setMessage('管理员账户已存在，您可以使用默认凭据登录。');
        setAdminInfo({
          id: data.adminId,
          username: 'admin',
          password: 'admin123'
        });
      } else if (data.success) {
        setStatus('success');
        setMessage('管理员账户创建成功！');
        setAdminInfo({
          id: data.admin.id,
          username: data.loginInfo.username,
          password: data.loginInfo.password
        });
      }
    } catch (error: any) {
      setStatus('error');
      setMessage(`创建管理员账户失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const goToLogin = () => {
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">管理系统初始化</h1>
          <p className="mt-2 text-gray-600">创建管理员账户以开始使用系统</p>
        </div>
        
        <div className="mt-8">
          {status === 'idle' && (
            <div className="space-y-4">
              <p className="text-gray-700">
                点击下方按钮创建默认管理员账户。此操作将创建以下账户：
              </p>
              <div className="bg-gray-50 p-4 rounded-md">
                <p><strong>用户名:</strong> admin</p>
                <p><strong>密码:</strong> admin123</p>
                <p className="text-sm text-gray-500 mt-2">请在登录后立即修改默认密码</p>
              </div>
              <button
                onClick={createAdminAccount}
                disabled={loading}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {loading ? '处理中...' : '创建管理员账户'}
              </button>
            </div>
          )}
          
          {status === 'success' && (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <svg className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-center text-gray-700">{message}</p>
              
              {adminInfo && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-md">
                  <p><strong>用户名:</strong> {adminInfo.username}</p>
                  <p><strong>密码:</strong> {adminInfo.password}</p>
                </div>
              )}
              
              <button
                onClick={goToLogin}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                前往登录页面
              </button>
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <svg className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-center text-red-600">{message}</p>
              <button
                onClick={() => setStatus('idle')}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                重试
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 text-gray-500 text-sm text-center">
        <p>此页面仅用于系统初始化，仅限管理员使用</p>
      </div>
    </div>
  );
} 