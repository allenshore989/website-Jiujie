"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface LogoutButtonProps {
  className?: string;
  onLogoutStart?: () => void;
  onLogoutError?: (error: Error) => void;
}

/**
 * 统一的登出按钮组件
 * 用于所有管理页面，确保登出逻辑一致
 */
export default function LogoutButton({ 
  className = "text-sm text-primary hover:text-primary/80 transition-colors",
  onLogoutStart,
  onLogoutError 
}: LogoutButtonProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    try {
      setIsLoggingOut(true);
      if (onLogoutStart) onLogoutStart();
      
      // 通过API清除服务器端cookie
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('登出失败');
      }
      
      // 清除本地存储
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('adminUser');
      
      // 清除客户端cookie
      Cookies.remove('auth-token');
      
      // 重定向到登录页面
      router.push('/admin/login');
    } catch (error) {
      console.error('退出登录出错:', error);
      if (onLogoutError && error instanceof Error) {
        onLogoutError(error);
      } else {
        alert('退出登录时发生错误，请重试');
      }
      setIsLoggingOut(false);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={className}
    >
      {isLoggingOut ? '退出中...' : '退出登录'}
    </button>
  );
} 