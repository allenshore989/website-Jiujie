"use client";

import React, { useState, useEffect } from 'react';
import { FiPlusCircle, FiEdit, FiTrash2, FiX, FiSave, FiArrowUp, FiArrowDown } from 'react-icons/fi';

// 定义FAQ数据类型
interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentFAQ, setCurrentFAQ] = useState<FAQ>({
    id: '',
    question: '',
    answer: '',
    category: 'general',
    order: 0
  });
  
  // 获取所有FAQ
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('/api/faqs');
        
        if (!response.ok) {
          throw new Error(`获取FAQ失败: ${response.status}`);
        }
        
        const data = await response.json();
        
        // 按照order字段排序
        const sortedData = data.sort((a: FAQ, b: FAQ) => a.order - b.order);
        setFaqs(sortedData);
      } catch (err) {
        console.error('加载FAQ失败:', err);
        setError('加载FAQ失败，请刷新页面重试');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFAQs();
  }, []);
  
  // 打开新建模态框
  const openCreateModal = () => {
    // 计算新条目的默认顺序为当前最大顺序+1
    const maxOrder = faqs.length > 0 
      ? Math.max(...faqs.map(faq => faq.order)) 
      : -1;
      
    setCurrentFAQ({
      id: '',
      question: '',
      answer: '',
      category: 'general',
      order: maxOrder + 1
    });
    setIsEdit(false);
    setIsModalOpen(true);
  };
  
  // 打开编辑模态框
  const openEditModal = (faq: FAQ) => {
    setCurrentFAQ(faq);
    setIsEdit(true);
    setIsModalOpen(true);
  };
  
  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentFAQ(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 保存FAQ
  const saveFAQ = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 简单验证
    if (!currentFAQ.question || !currentFAQ.answer) {
      alert('请填写问题和答案');
      return;
    }
    
    try {
      const url = isEdit ? `/api/faqs/${currentFAQ.id}` : '/api/faqs';
      const method = isEdit ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentFAQ),
      });
      
      if (!response.ok) {
        throw new Error(`保存FAQ失败: ${response.status}`);
      }
      
      const savedFAQ = await response.json();
      
      if (isEdit) {
        // 更新本地状态
        setFaqs(prev => 
          prev.map(faq => faq.id === savedFAQ.id ? savedFAQ : faq)
            .sort((a, b) => a.order - b.order)
        );
      } else {
        // 添加到本地状态
        setFaqs(prev => [...prev, savedFAQ].sort((a, b) => a.order - b.order));
      }
      
      // 关闭模态框
      setIsModalOpen(false);
      
    } catch (err) {
      console.error('保存FAQ失败:', err);
      alert('保存FAQ失败，请重试');
    }
  };
  
  // 删除FAQ
  const deleteFAQ = async (id: string) => {
    if (!window.confirm('确定要删除此常见问题吗？此操作不可撤销。')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/faqs/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`删除FAQ失败: ${response.status}`);
      }
      
      // 从本地状态中移除
      setFaqs(prev => prev.filter(faq => faq.id !== id));
      
    } catch (err) {
      console.error('删除FAQ失败:', err);
      alert('删除FAQ失败，请重试');
    }
  };
  
  // 调整FAQ顺序
  const changeFAQOrder = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = faqs.findIndex(faq => faq.id === id);
    if (currentIndex === -1) return;
    
    // 不能上移第一个项目，不能下移最后一个项目
    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === faqs.length - 1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    const updatedFaqs = [...faqs];
    const temp = updatedFaqs[currentIndex].order;
    updatedFaqs[currentIndex].order = updatedFaqs[newIndex].order;
    updatedFaqs[newIndex].order = temp;
    
    // 交换位置
    [updatedFaqs[currentIndex], updatedFaqs[newIndex]] = 
      [updatedFaqs[newIndex], updatedFaqs[currentIndex]];
    
    setFaqs(updatedFaqs);
    
    // 更新两个FAQ的顺序
    try {
      await Promise.all([
        fetch(`/api/faqs/${updatedFaqs[currentIndex].id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ order: updatedFaqs[currentIndex].order }),
        }),
        fetch(`/api/faqs/${updatedFaqs[newIndex].id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ order: updatedFaqs[newIndex].order }),
        })
      ]);
    } catch (err) {
      console.error('更新FAQ顺序失败:', err);
      alert('更新顺序失败，请刷新页面后重试');
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
          <h1 className="text-2xl font-bold text-gray-900">常见问题管理</h1>
          <p className="mt-1 text-sm text-gray-600">管理网站常见问题解答</p>
        </div>
        
        <button
          onClick={openCreateModal}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <FiPlusCircle className="mr-2" />
          添加问题
        </button>
      </div>
      
      {/* FAQ列表 */}
      {faqs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">暂无常见问题</p>
          <button
            onClick={openCreateModal}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary bg-primary-50 hover:bg-primary-100"
          >
            <FiPlusCircle className="mr-2" />
            添加第一个问题
          </button>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {faqs.map((faq, index) => (
              <li key={faq.id} className="hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                      <p className="mt-2 max-w-2xl text-sm text-gray-500 whitespace-pre-wrap">
                        {faq.answer}
                      </p>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {faq.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => changeFAQOrder(faq.id, 'up')}
                        disabled={index === 0}
                        className={`text-gray-400 hover:text-gray-500 ${index === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <FiArrowUp />
                      </button>
                      <button
                        onClick={() => changeFAQOrder(faq.id, 'down')}
                        disabled={index === faqs.length - 1}
                        className={`text-gray-400 hover:text-gray-500 ${index === faqs.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <FiArrowDown />
                      </button>
                      <button
                        onClick={() => openEditModal(faq)}
                        className="text-primary hover:text-primary-dark"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => deleteFAQ(faq.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* 编辑/新建模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {isEdit ? '编辑常见问题' : '添加常见问题'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                <FiX />
              </button>
            </div>
            
            <form onSubmit={saveFAQ}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="question" className="block text-sm font-medium text-gray-700">
                    问题 *
                  </label>
                  <input
                    type="text"
                    id="question"
                    name="question"
                    value={currentFAQ.question}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="answer" className="block text-sm font-medium text-gray-700">
                    答案 *
                  </label>
                  <textarea
                    id="answer"
                    name="answer"
                    rows={6}
                    value={currentFAQ.answer}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    分类
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={currentFAQ.category}
                    onChange={handleInputChange}
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  >
                    <option value="general">通用</option>
                    <option value="service">服务</option>
                    <option value="pricing">价格</option>
                    <option value="concept">概念</option>
                    <option value="implementation">实施</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="order" className="block text-sm font-medium text-gray-700">
                    排序权重
                  </label>
                  <input
                    type="number"
                    id="order"
                    name="order"
                    value={currentFAQ.order}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">数字越小排序越靠前</p>
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