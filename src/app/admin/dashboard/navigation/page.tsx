"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';

// 导航项接口
interface NavItem {
  name: string;
  href: string;
  icon?: string;
}

// 导航结构接口
interface Navigation {
  main: NavItem[];
  footer: NavItem[];
  social: NavItem[];
}

export default function NavigationManagement() {
  const router = useRouter();
  const [navigation, setNavigation] = useState<Navigation | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  // 检查用户是否已登录
  useEffect(() => {
    if (initialized) return;
    
    try {
      // 检查登录状态
      const authToken = Cookies.get('auth-token');
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' || 
                         localStorage.getItem('adminUser') !== null ||
                         authToken !== undefined;
                         
      if (!isLoggedIn) {
        // 如果未登录，重定向到登录页面
        router.push('/admin/login');
        return;
      }
    } catch (error) {
      console.error('检查登录状态时出错:', error);
    } finally {
      setInitialized(true);
    }
  }, [router, initialized]);

  // 加载导航数据
  useEffect(() => {
    if (!initialized) return;
    
    const fetchNavigation = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/navigation');
        
        if (!response.ok) {
          throw new Error(`获取导航数据失败: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
          setNavigation(result.data);
        } else {
          throw new Error(result.error || '获取导航数据失败');
        }
      } catch (err: any) {
        console.error('加载导航数据出错:', err);
        setError(err.message || '无法加载导航数据');
      } finally {
        setLoading(false);
      }
    };

    fetchNavigation();
  }, [initialized]);

  // 添加导航项
  const addNavItem = (section: keyof Navigation) => {
    if (!navigation) return;
    
    setNavigation({
      ...navigation,
      [section]: [
        ...navigation[section],
        { name: '新菜单项', href: '/' }
      ]
    });
  };

  // 删除导航项
  const removeNavItem = (section: keyof Navigation, index: number) => {
    if (!navigation) return;
    
    setNavigation({
      ...navigation,
      [section]: navigation[section].filter((_, i) => i !== index)
    });
  };

  // 更新导航项
  const updateNavItem = (section: keyof Navigation, index: number, field: keyof NavItem, value: string) => {
    if (!navigation) return;
    
    const updatedItems = [...navigation[section]];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    
    setNavigation({
      ...navigation,
      [section]: updatedItems
    });
  };

  // 保存导航配置
  const saveNavigation = async () => {
    if (!navigation) return;
    
    try {
      setSaveStatus('saving');
      
      const response = await fetch('/api/navigation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(navigation),
      });
      
      if (!response.ok) {
        throw new Error(`保存失败: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        throw new Error(result.error || '保存失败');
      }
    } catch (err: any) {
      console.error('保存导航配置出错:', err);
      setError(err.message || '保存失败');
      setSaveStatus('error');
    }
  };

  // 处理登出
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
      setError('退出登录时发生错误，请重试');
    }
  };

  // 加载中显示
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
    <div className="min-h-screen bg-gray-100 pb-12">
      {/* 顶部标题 */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">导航菜单管理</h1>
              <Link href="/admin/dashboard" className="ml-4 text-primary hover:text-primary/80">
                返回控制面板
              </Link>
            </div>
            <button 
              onClick={handleLogout}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              退出登录
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto mt-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 保存状态通知 */}
      {saveStatus !== 'idle' && (
        <div className="max-w-7xl mx-auto mt-6 px-4 sm:px-6 lg:px-8">
          <div className={`border-l-4 p-4 ${
            saveStatus === 'saving' ? 'bg-blue-50 border-blue-400' :
            saveStatus === 'success' ? 'bg-green-50 border-green-400' :
            'bg-red-50 border-red-400'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {saveStatus === 'saving' && (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-blue-500"></div>
                )}
                {saveStatus === 'success' && (
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {saveStatus === 'error' && (
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm">
                  {saveStatus === 'saving' && '正在保存导航配置...'}
                  {saveStatus === 'success' && '导航配置已成功保存！'}
                  {saveStatus === 'error' && '保存导航配置失败，请重试。'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {navigation && (
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:p-6">
              {/* 主导航 */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">主导航菜单</h2>
                  <button
                    type="button"
                    onClick={() => addNavItem('main')}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/80 focus:outline-none"
                  >
                    添加菜单项
                  </button>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  {navigation.main.length === 0 ? (
                    <p className="text-gray-500 text-sm">暂无主导航菜单项</p>
                  ) : (
                    <ul className="space-y-3">
                      {navigation.main.map((item, index) => (
                        <li key={index} className="bg-white p-4 rounded border">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">菜单名称</label>
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => updateNavItem('main', index, 'name', e.target.value)}
                                className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">链接地址</label>
                              <input
                                type="text"
                                value={item.href}
                                onChange={(e) => updateNavItem('main', index, 'href', e.target.value)}
                                className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                            <div className="flex items-end">
                              <button
                                type="button"
                                onClick={() => removeNavItem('main', index)}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none"
                              >
                                删除
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              
              {/* 页脚导航 */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">页脚链接</h2>
                  <button
                    type="button"
                    onClick={() => addNavItem('footer')}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/80 focus:outline-none"
                  >
                    添加链接
                  </button>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  {navigation.footer.length === 0 ? (
                    <p className="text-gray-500 text-sm">暂无页脚链接</p>
                  ) : (
                    <ul className="space-y-3">
                      {navigation.footer.map((item, index) => (
                        <li key={index} className="bg-white p-4 rounded border">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">链接名称</label>
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => updateNavItem('footer', index, 'name', e.target.value)}
                                className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">链接地址</label>
                              <input
                                type="text"
                                value={item.href}
                                onChange={(e) => updateNavItem('footer', index, 'href', e.target.value)}
                                className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                            <div className="flex items-end">
                              <button
                                type="button"
                                onClick={() => removeNavItem('footer', index)}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none"
                              >
                                删除
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              
              {/* 社交媒体 */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">社交媒体</h2>
                  <button
                    type="button"
                    onClick={() => addNavItem('social')}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/80 focus:outline-none"
                  >
                    添加社交媒体
                  </button>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  {navigation.social.length === 0 ? (
                    <p className="text-gray-500 text-sm">暂无社交媒体</p>
                  ) : (
                    <ul className="space-y-3">
                      {navigation.social.map((item, index) => (
                        <li key={index} className="bg-white p-4 rounded border">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">平台名称</label>
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => updateNavItem('social', index, 'name', e.target.value)}
                                className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">链接地址</label>
                              <input
                                type="text"
                                value={item.href}
                                onChange={(e) => updateNavItem('social', index, 'href', e.target.value)}
                                className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">图标类型</label>
                              <select
                                value={item.icon || ''}
                                onChange={(e) => updateNavItem('social', index, 'icon', e.target.value)}
                                className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              >
                                <option value="">无图标</option>
                                <option value="WeChat">微信</option>
                                <option value="Weibo">微博</option>
                              </select>
                            </div>
                            <div className="flex items-end">
                              <button
                                type="button"
                                onClick={() => removeNavItem('social', index)}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none"
                              >
                                删除
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              
              {/* 保存按钮 */}
              <div className="flex justify-end mt-8">
                <button
                  type="button"
                  onClick={saveNavigation}
                  disabled={saveStatus === 'saving'}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/80 focus:outline-none disabled:opacity-50"
                >
                  {saveStatus === 'saving' ? '保存中...' : '保存更改'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 