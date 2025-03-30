'use client';

import React from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';

export default function AuthCheckPage() {
  const [authInfo, setAuthInfo] = React.useState<{
    hasCookie: boolean;
    cookieValue?: string;
    hasLocalStorage: boolean;
    localStorageValue?: string;
  }>({
    hasCookie: false,
    hasLocalStorage: false
  });

  React.useEffect(() => {
    const checkAuth = () => {
      const authToken = Cookies.get('auth-token');
      const adminUser = localStorage.getItem('adminUser');
      
      setAuthInfo({
        hasCookie: !!authToken,
        cookieValue: authToken?.substring(0, 20) + '...',
        hasLocalStorage: !!adminUser,
        localStorageValue: adminUser || undefined
      });
    };
    
    checkAuth();
  }, []);

  const handleClearAuth = () => {
    Cookies.remove('auth-token');
    localStorage.removeItem('adminUser');
    setAuthInfo({
      hasCookie: false,
      hasLocalStorage: false
    });
  };

  const handleSetDevToken = () => {
    Cookies.set('auth-token', 'admin-auth-token', { 
      expires: 1, 
      secure: false,
      sameSite: 'lax'
    });
    
    localStorage.setItem('adminUser', 'admin');
    
    setAuthInfo({
      hasCookie: true,
      cookieValue: 'admin-auth-token',
      hasLocalStorage: true,
      localStorageValue: 'admin'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-8 text-center">认证状态检查</h1>
        
        <div className="space-y-6">
          <div className="bg-gray-100 p-4 rounded-md">
            <h2 className="text-lg font-semibold mb-4">当前认证状态</h2>
            <div className="space-y-2">
              <p>
                Cookie (auth-token): 
                <span className={`ml-2 font-mono ${authInfo.hasCookie ? 'text-green-600' : 'text-red-600'}`}>
                  {authInfo.hasCookie ? `存在 (${authInfo.cookieValue})` : '不存在'}
                </span>
              </p>
              <p>
                LocalStorage (adminUser): 
                <span className={`ml-2 font-mono ${authInfo.hasLocalStorage ? 'text-green-600' : 'text-red-600'}`}>
                  {authInfo.hasLocalStorage ? `存在 (${authInfo.localStorageValue})` : '不存在'}
                </span>
              </p>
            </div>
          </div>
          
          <div className="flex space-x-4 justify-center">
            <button
              onClick={handleClearAuth}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              清除认证状态
            </button>
            <button
              onClick={handleSetDevToken}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              设置开发令牌
            </button>
          </div>
          
          <div className="flex justify-center space-x-4 mt-8">
            <Link
              href="/admin/login"
              className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
            >
              前往登录页
            </Link>
            <Link
              href="/admin/dashboard"
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
            >
              前往仪表盘
            </Link>
          </div>
          
          <div className="mt-8 pt-4 border-t">
            <h3 className="font-semibold mb-2">故障排除步骤:</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>确认Cookie设置不受限制（查看浏览器是否允许第三方Cookie）</li>
              <li>尝试点击"设置开发令牌"按钮，然后点击"前往仪表盘"</li>
              <li>如果仍无法访问，请检查控制台是否有任何错误</li>
              <li>确保服务器已经正确创建了管理员账户</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
} 