"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BranchOfficesManager from './branch-offices';
import MessagesManager from './messages';
import AboutPageEditor from './about-page-editor';
import LogoutButton from '@/components/admin/LogoutButton';

// 表单数据类型定义
interface SettingsFormData {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  phoneNumber: string;
  address: string;
  icp: string;
  enableComments: boolean;
  requireApproval: boolean;
  maxUploadSize: number;
}

export default function Settings() {
  const router = useRouter();
  const [user, setUser] = React.useState('管理员');
  const [loading, setLoading] = React.useState(true);
  
  // 表单状态
  const [formData, setFormData] = React.useState<SettingsFormData>({
    siteName: '易经环境设计',
    siteDescription: '融合古老智慧与现代空间设计',
    contactEmail: 'contact@example.com',
    phoneNumber: '010-12345678',
    address: '北京市朝阳区xx街道xx号',
    icp: '京ICP备12345678号',
    enableComments: true,
    requireApproval: true,
    maxUploadSize: 5
  });
  
  const [saveStatus, setSaveStatus] = React.useState({
    message: '',
    type: '' // 'success' or 'error'
  });

  // 在提交保存后面添加管理分支机构的Tab功能
  const [activeTab, setActiveTab] = React.useState<string>('general');

  // 检查用户是否已登录
  React.useEffect(() => {
    // 确保代码运行在客户端
    if (typeof window !== 'undefined') {
      // 检查登录状态
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (!isLoggedIn) {
        // 如果未登录，重定向到登录页面
        router.push('/admin/login');
        return;
      }
      
      // 获取用户名
      const adminUser = localStorage.getItem('adminUser');
      if (adminUser) {
        setUser(adminUser);
      }
    }
    
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    // 确保代码运行在客户端
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('adminUser');
      router.push('/admin/login');
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData((prev: SettingsFormData) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 模拟保存操作
    setSaveStatus({ message: '', type: '' });
    
    // 显示加载状态
    setLoading(true);
    
    // 保存设置到localStorage
    try {
      // 确保代码运行在客户端
      if (typeof window !== 'undefined') {
        localStorage.setItem('siteSettings', JSON.stringify(formData));
        
        // 3秒后显示成功消息
        setTimeout(() => {
          setLoading(false);
          setSaveStatus({ 
            message: '设置已成功保存', 
            type: 'success' 
          });
          
          // 3秒后清除消息
          setTimeout(() => {
            setSaveStatus({ message: '', type: '' });
          }, 3000);
        }, 1000);
      }
    } catch (error) {
      setLoading(false);
      setSaveStatus({ 
        message: '保存设置时出错', 
        type: 'error' 
      });
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
      <div className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">系统设置</h1>
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/dashboard" 
            className="text-primary hover:underline"
          >
            返回控制面板
          </Link>
          <LogoutButton />
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* 设置导航 */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-4 py-3 text-sm font-medium w-1/6 text-center ${
                activeTab === 'general'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              基本设置
            </button>
            <button
              onClick={() => setActiveTab('appearance')}
              className={`px-4 py-3 text-sm font-medium w-1/6 text-center ${
                activeTab === 'appearance'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              外观设置
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-3 text-sm font-medium w-1/6 text-center ${
                activeTab === 'security'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              安全设置
            </button>
            <button
              onClick={() => setActiveTab('backup')}
              className={`px-4 py-3 text-sm font-medium w-1/6 text-center ${
                activeTab === 'backup'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              备份与恢复
            </button>
            <button
              onClick={() => setActiveTab('advanced')}
              className={`px-4 py-3 text-sm font-medium w-1/6 text-center ${
                activeTab === 'advanced'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              高级设置
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-4 py-3 text-sm font-medium w-1/6 text-center ${
                activeTab === 'about'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              关于我们
            </button>
          </div>

          {/* 设置内容 */}
          <div className="p-6">
            {activeTab === 'general' && (
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-4">基本设置</h2>
                <p className="text-gray-600">这里是基本设置内容。</p>
              </div>
            )}
            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-4">外观设置</h2>
                <p className="text-gray-600">这里是外观设置内容。</p>
              </div>
            )}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-4">安全设置</h2>
                <p className="text-gray-600">这里是安全设置内容。</p>
              </div>
            )}
            {activeTab === 'backup' && (
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-4">备份与恢复</h2>
                <p className="text-gray-600">这里是备份与恢复内容。</p>
              </div>
            )}
            {activeTab === 'advanced' && (
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-4">高级设置</h2>
                <p className="text-gray-600">这里是高级设置内容。</p>
              </div>
            )}
            {activeTab === 'about' && (
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-4">关于我们</h2>
                <p className="text-gray-600 mb-6">在这里管理关于页面的内容，修改后将自动更新网站的关于我们页面。</p>
                <AboutPageEditor />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 