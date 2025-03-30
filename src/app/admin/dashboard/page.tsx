"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiMessageSquare, FiMap, FiHelpCircle } from 'react-icons/fi';
import Cookies from 'js-cookie';

// 统计卡片组件
function StatsCard({ title, value, icon: Icon, color, linkTo }: { 
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  linkTo: string;
}) {
  return (
    <Link href={linkTo} className="block">
      <div className={`bg-white overflow-hidden shadow rounded-lg border-l-4 ${color} hover:shadow-md transition-shadow`}>
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                <dd>
                  <div className="text-xl font-semibold text-gray-900">{value}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState('管理员');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMessages: 0,
    pendingMessages: 0,
    totalBranches: 0,
    totalFaqs: 0
  });
  const [initialized, setInitialized] = useState(false);

  // 检查用户是否已登录
  useEffect(() => {
    // 避免重复执行检查
    if (initialized) return;
    
    let isMounted = true;
    
    const checkAuth = async () => {
      try {
        // 检查登录状态
        const authToken = Cookies.get('auth-token');
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' || 
                          localStorage.getItem('adminUser') !== null ||
                          authToken !== undefined;
                          
        if (!isLoggedIn && isMounted) {
          // 如果未登录，重定向到登录页面
          router.push('/admin/login');
          return;
        }
        
        // 获取用户名
        const adminUser = localStorage.getItem('adminUser');
        if (adminUser && isMounted) {
          setUser(adminUser);
        }
      } catch (error) {
        console.error('检查登录状态时出错:', error);
        // 即使出错也继续渲染页面
      } finally {
        if (isMounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };
    
    checkAuth();
    
    return () => {
      isMounted = false;
    };
  }, [router, initialized]);

  // 仅在组件初次渲染时获取统计数据
  useEffect(() => {
    // 避免频繁请求，只在需要时获取
    if (!initialized || loading) return;
    
    let isMounted = true;
    
    const fetchStats = async () => {
      try {
        if (isMounted) setLoading(true);
        
        // 并行获取所有统计数据
        const [messagesResponse, branchesResponse, faqsResponse] = await Promise.all([
          fetch('/api/contact/message'),
          fetch('/api/branches'),
          fetch('/api/faqs')
        ]);
        
        if (!messagesResponse.ok || !branchesResponse.ok || !faqsResponse.ok) {
          throw new Error('获取数据失败，响应状态码错误');
        }
        
        const messages = await messagesResponse.json();
        const branches = await branchesResponse.json();
        const faqs = await faqsResponse.json();
        
        // 计算统计数据
        const pendingMessages = Array.isArray(messages) ? 
          messages.filter((msg: any) => msg.status === 'PENDING').length : 0;
        
        if (isMounted) {
          setStats({
            totalMessages: Array.isArray(messages) ? messages.length : 0,
            pendingMessages,
            totalBranches: Array.isArray(branches) ? branches.length : 0,
            totalFaqs: Array.isArray(faqs) ? faqs.length : 0
          });
        }
      } catch (error) {
        console.error('获取统计数据失败:', error);
        // 如果获取失败，不进行任何重试，显示默认值
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    // 仅在组件初次渲染时获取数据
    fetchStats();
    
    // 清理函数，防止组件卸载后的状态更新
    return () => {
      isMounted = false;
    };
    
  }, [initialized]);

  const handleLogout = async () => {
    try {
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
      alert('退出登录时发生错误，请重试');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 顶部导航栏 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/">
                  <span className="text-xl font-mashan text-primary">易经环境设计</span>
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link href="/admin/dashboard" className="border-primary text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  控制面板
                </Link>
                <Link href="/admin/dashboard/content" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  内容管理
                </Link>
                <Link href="/admin/dashboard/navigation" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  导航管理
                </Link>
                <Link href="/admin/dashboard/users" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  用户管理
                </Link>
                <Link href="/admin/dashboard/settings" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  系统设置
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <div className="ml-3 relative">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-700">欢迎, {user}</span>
                  <button 
                    onClick={handleLogout}
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    退出登录
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容区 */}
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900">控制面板</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
              <p className="mt-1 text-sm text-gray-600">易经环境设计后台管理系统概览</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
              <StatsCard
                title="联系消息"
                value={stats.totalMessages}
                icon={FiMessageSquare}
                color="border-blue-500"
                linkTo="/admin/messages"
              />
              <StatsCard
                title="待处理消息"
                value={stats.pendingMessages}
                icon={FiMessageSquare}
                color="border-yellow-500"
                linkTo="/admin/messages?status=PENDING"
              />
              <StatsCard
                title="分支机构"
                value={stats.totalBranches}
                icon={FiMap}
                color="border-green-500"
                linkTo="/admin/branches"
              />
              <StatsCard
                title="网站导航"
                value={3}
                icon={FiMap}
                color="border-purple-500"
                linkTo="/admin/dashboard/navigation"
              />
              <StatsCard
                title="常见问题"
                value={stats.totalFaqs}
                icon={FiHelpCircle}
                color="border-indigo-500"
                linkTo="/admin/faqs"
              />
            </div>
            
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">快速操作</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Link 
                  href="/admin/messages" 
                  className="bg-white shadow overflow-hidden rounded-md p-4 hover:bg-primary-50 transition-colors"
                >
                  <div className="flex items-center">
                    <span className="flex-shrink-0 text-primary">
                      <FiMessageSquare size={20} />
                    </span>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-primary">查看留言</h3>
                      <p className="text-xs text-gray-500">处理客户咨询和联系请求</p>
                    </div>
                  </div>
                </Link>
                
                <Link 
                  href="/admin/faqs/new" 
                  className="bg-white shadow overflow-hidden rounded-md p-4 hover:bg-primary-50 transition-colors"
                >
                  <div className="flex items-center">
                    <span className="flex-shrink-0 text-primary">
                      <FiHelpCircle size={20} />
                    </span>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-primary">添加常见问题</h3>
                      <p className="text-xs text-gray-500">增加新的FAQ内容</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 