"use client";

import React, { useState, useEffect } from 'react';
import { FiPlusCircle, FiEdit, FiTrash2, FiX, FiSave } from 'react-icons/fi';

// 定义分支机构数据类型
interface Branch {
  id: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentBranch, setCurrentBranch] = useState<Branch>({
    id: '',
    city: '',
    address: '',
    phone: '',
    email: ''
  });
  
  // 加载分支机构数据
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('/api/branches');
        
        if (!response.ok) {
          throw new Error(`获取分支机构失败: ${response.status}`);
        }
        
        const data = await response.json();
        setBranches(data);
      } catch (err) {
        console.error('加载分支机构失败:', err);
        setError('加载分支机构失败，请刷新页面重试');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBranches();
  }, []);
  
  // 打开新建模态框
  const openCreateModal = () => {
    setCurrentBranch({
      id: '',
      city: '',
      address: '',
      phone: '',
      email: ''
    });
    setIsEdit(false);
    setIsModalOpen(true);
  };
  
  // 打开编辑模态框
  const openEditModal = (branch: Branch) => {
    setCurrentBranch(branch);
    setIsEdit(true);
    setIsModalOpen(true);
  };
  
  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentBranch(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 保存分支机构
  const saveBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 简单验证
    if (!currentBranch.city || !currentBranch.address || !currentBranch.phone) {
      alert('请填写必填字段');
      return;
    }
    
    try {
      const url = isEdit ? `/api/branches/${currentBranch.id}` : '/api/branches';
      const method = isEdit ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentBranch),
      });
      
      if (!response.ok) {
        throw new Error(`保存分支机构失败: ${response.status}`);
      }
      
      const savedBranch = await response.json();
      
      if (isEdit) {
        // 更新本地状态
        setBranches(prev => 
          prev.map(branch => branch.id === savedBranch.id ? savedBranch : branch)
        );
      } else {
        // 添加到本地状态
        setBranches(prev => [...prev, savedBranch]);
      }
      
      // 关闭模态框
      setIsModalOpen(false);
      
    } catch (err) {
      console.error('保存分支机构失败:', err);
      alert('保存分支机构失败，请重试');
    }
  };
  
  // 删除分支机构
  const deleteBranch = async (id: string) => {
    if (!window.confirm('确定要删除此分支机构吗？此操作不可撤销。')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/branches/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`删除分支机构失败: ${response.status}`);
      }
      
      // 从本地状态中移除
      setBranches(prev => prev.filter(branch => branch.id !== id));
      
    } catch (err) {
      console.error('删除分支机构失败:', err);
      alert('删除分支机构失败，请重试');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">分支机构管理</h1>
          <p className="mt-1 text-sm text-gray-600">管理全国各地的分支机构信息</p>
        </div>
        
        <button
          onClick={openCreateModal}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <FiPlusCircle className="mr-2" />
          添加分支机构
        </button>
      </div>
      
      {/* 分支机构列表 */}
      {branches.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">暂无分支机构信息</p>
          <button
            onClick={openCreateModal}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary bg-primary-50 hover:bg-primary-100"
          >
            <FiPlusCircle className="mr-2" />
            添加第一个分支机构
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map(branch => (
            <div key={branch.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 bg-gray-50">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{branch.city}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(branch)}
                      className="text-primary hover:text-primary-dark"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => deleteBranch(branch.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">地址</dt>
                    <dd className="mt-1 text-sm text-gray-900">{branch.address}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">联系电话</dt>
                    <dd className="mt-1 text-sm text-gray-900">{branch.phone}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">电子邮箱</dt>
                    <dd className="mt-1 text-sm text-gray-900">{branch.email}</dd>
                  </div>
                </dl>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* 编辑/新建模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {isEdit ? '编辑分支机构' : '添加分支机构'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                <FiX />
              </button>
            </div>
            
            <form onSubmit={saveBranch}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    城市名称 *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={currentBranch.city}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    详细地址 *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    value={currentBranch.address}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    联系电话 *
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={currentBranch.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    电子邮箱
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={currentBranch.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <FiSave className="mr-2" />
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 