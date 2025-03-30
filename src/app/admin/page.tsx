"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiMessageSquare, FiMap, FiHelpCircle, FiSettings } from 'react-icons/fi';

// 管理员功能卡片组件
function AdminCard({ 
  title, 
  description, 
  icon: Icon, 
  link 
}: { 
  title: string, 
  description: string, 
  icon: any, 
  link: string 
}) {
  const router = useRouter();
  
  return (
    <div 
      className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow cursor-pointer"
      onClick={() => router.push(link)}
    >
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminHomePage() {
  const router = useRouter();
  
  // 自动重定向到仪表盘
  useEffect(() => {
    router.push('/admin/dashboard');
  }, [router]);
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center p-4">
      <div className="max-w-4xl mx-auto w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">易经环境设计后台管理系统</h1>
          <p className="text-gray-600">
            欢迎使用管理系统，正在跳转到仪表盘...
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminCard 
            title="留言管理" 
            description="处理客户咨询和联系请求"
            icon={FiMessageSquare}
            link="/admin/messages"
          />
          
          <AdminCard 
            title="分支机构管理" 
            description="更新全国各地分支机构信息"
            icon={FiMap}
            link="/admin/branches"
          />
          
          <AdminCard 
            title="常见问题管理" 
            description="编辑网站FAQ内容"
            icon={FiHelpCircle}
            link="/admin/faqs"
          />
          
          <AdminCard 
            title="系统设置" 
            description="配置网站设置和参数"
            icon={FiSettings}
            link="/admin/settings"
          />
        </div>
      </div>
    </div>
  );
} 