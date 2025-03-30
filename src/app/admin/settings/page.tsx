"use client";

import React, { useState, useEffect } from 'react';
import { FiSave, FiRefreshCw, FiTrash2 } from 'react-icons/fi';

// 定义设置类型
interface Setting {
  id: string;
  key: string;
  value: string;
  updatedAt: string;
}

// 系统设置页面
export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // 获取设置
  useEffect(() => {
    fetchSettings();
  }, []);
  
  // 获取设置函数 - 抽取为单独函数以便重用
  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/settings');
      
      if (!response.ok) {
        throw new Error(`获取设置失败: ${response.status}`);
      }
      
      const data = await response.json();
      
      // 确保没有重复项 - 按key去重
      const uniqueSettings = Array.isArray(data) ? 
        data.filter((setting, index, self) => 
          index === self.findIndex(s => s.key === setting.key)
        ) : [];
        
      setSettings(uniqueSettings);
    } catch (err) {
      console.error('加载设置失败:', err);
      setError('加载设置失败，请刷新页面重试');
    } finally {
      setLoading(false);
    }
  };
  
  // 处理设置更改
  const handleSettingChange = (id: string, value: string) => {
    setSettings(prev => 
      prev.map(setting => 
        setting.id === id ? { ...setting, value } : setting
      )
    );
  };
  
  // 保存设置
  const saveSettings = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      // 准备要更新的设置数据 - 使用key而不是id
      const settingsToUpdate = settings.map(({ key, value }) => ({ key, value }));
      
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingsToUpdate),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `保存设置失败: ${response.status}`);
      }
      
      setSuccess('设置已成功保存');
      
      // 重新获取设置，确保显示最新状态
      await fetchSettings();
    } catch (err: any) {
      console.error('保存设置失败:', err);
      setError(err.message || '保存设置失败，请重试');
    } finally {
      setSaving(false);
    }
  };
  
  // 清理重复设置
  const cleanDuplicateSettings = async () => {
    if (!window.confirm('确定要清理重复的设置项吗？该操作将保留每个键的最新设置，删除重复项。')) {
      return;
    }
    
    try {
      setCleaning(true);
      setError('');
      setSuccess('');
      
      const response = await fetch('/api/settings/clean-duplicates', {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `清理重复设置失败: ${response.status}`);
      }
      
      const result = await response.json();
      setSuccess(`清理完成: ${result.message}`);
      
      // 重新获取设置
      await fetchSettings();
    } catch (err: any) {
      console.error('清理重复设置失败:', err);
      setError(err.message || '清理重复设置失败，请重试');
    } finally {
      setCleaning(false);
    }
  };
  
  // 显示设置标签
  const getSettingLabel = (key: string) => {
    const labels: Record<string, string> = {
      siteName: '网站名称',
      contactEmail: '联系邮箱',
      phoneNumber: '联系电话',
      address: '公司地址',
      icp: 'ICP备案号'
    };
    
    return labels[key] || key;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // 如果没有设置数据，显示空状态
  if (settings.length === 0 && !error) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">系统设置</h1>
          <p className="mt-1 text-sm text-gray-600">配置网站基本信息和参数</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">暂无系统设置，运行种子脚本或手动添加设置</p>
          <div className="mt-4 flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary bg-primary-50 hover:bg-primary-100"
            >
              <FiRefreshCw className="mr-2" />
              刷新页面
            </button>
            <button
              onClick={saveSettings}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
            >
              <FiSave className="mr-2" />
              创建默认设置
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">系统设置</h1>
        <p className="mt-1 text-sm text-gray-600">配置网站基本信息和参数</p>
      </div>
      
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <p>{success}</p>
        </div>
      )}
      
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {settings.map(setting => (
            <li key={setting.id} className="px-4 py-4 sm:px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                  <label htmlFor={`setting-${setting.id}`} className="block text-sm font-medium text-gray-700">
                    {getSettingLabel(setting.key)}
                  </label>
                  <p className="text-xs text-gray-500">{setting.key}</p>
                </div>
                <div className="md:col-span-2">
                  {setting.key === 'address' ? (
                    <textarea
                      id={`setting-${setting.id}`}
                      value={setting.value}
                      onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      rows={3}
                    />
                  ) : (
                    <input
                      type="text"
                      id={`setting-${setting.id}`}
                      value={setting.value}
                      onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-6 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={cleanDuplicateSettings}
          className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          disabled={saving || cleaning}
        >
          {cleaning ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-700 mr-2"></div>
              清理中...
            </>
          ) : (
            <>
              <FiTrash2 className="mr-2 h-4 w-4" />
              清理重复项
            </>
          )}
        </button>
        
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          disabled={saving || cleaning}
        >
          <FiRefreshCw className="mr-2 h-4 w-4" />
          重置
        </button>
        
        <button
          type="button"
          onClick={saveSettings}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          disabled={saving || cleaning}
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              保存中...
            </>
          ) : (
            <>
              <FiSave className="mr-2 h-4 w-4" />
              保存设置
            </>
          )}
        </button>
      </div>
    </div>
  );
} 