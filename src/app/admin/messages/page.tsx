"use client";

import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiEdit, FiTrash2, FiArchive, FiCheckCircle, FiClock } from 'react-icons/fi';

// 定义留言数据类型
interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  content: string;
  createdAt: string;
  status: 'PENDING' | 'ANSWERED' | 'ARCHIVED';
  notes?: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // 加载留言数据
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true);
        
        // 从API获取联系消息
        const response = await fetch('/api/contact/message');
        
        if (!response.ok) {
          throw new Error(`获取消息失败: ${response.status}`);
        }
        
        const data = await response.json();
        
        // 格式化日期
        const formattedMessages = data.map((msg: any) => ({
          ...msg,
          createdAt: new Date(msg.createdAt).toLocaleString('zh-CN')
        }));
        
        setMessages(formattedMessages);
        setFilteredMessages(formattedMessages);
        setError('');
      } catch (err) {
        console.error('加载留言失败:', err);
        setError('加载留言失败，请刷新页面重试');
      } finally {
        setLoading(false);
      }
    };
    
    loadMessages();
  }, []);
  
  // 搜索过滤功能
  useEffect(() => {
    let result = messages;
    
    // 按状态过滤
    if (statusFilter !== 'all') {
      result = result.filter(msg => msg.status === statusFilter);
    }
    
    // 按搜索词过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        msg => 
          msg.name.toLowerCase().includes(term) ||
          msg.email.toLowerCase().includes(term) ||
          msg.phone.includes(term) ||
          msg.content.toLowerCase().includes(term)
      );
    }
    
    setFilteredMessages(result);
  }, [searchTerm, statusFilter, messages]);
  
  // 更新留言状态
  const handleStatusChange = async (id: string, status: 'PENDING' | 'ANSWERED' | 'ARCHIVED') => {
    try {
      // 更新API中的状态
      const response = await fetch(`/api/contact/message/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, notes }),
      });
      
      if (!response.ok) {
        throw new Error(`更新消息状态失败: ${response.status}`);
      }
      
      // 更新本地状态
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === id ? { ...msg, status, notes: notes || msg.notes } : msg
        )
      );
      
      setSelectedMessage(null);
      setNotes('');
      
    } catch (err) {
      console.error('更新留言状态失败:', err);
      alert('更新留言状态失败，请重试');
    }
  };
  
  // 删除留言
  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm('确定要删除这条留言吗？此操作不可撤销。')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/contact/message/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`删除消息失败: ${response.status}`);
      }
      
      // 从本地状态中移除
      setMessages(prevMessages => 
        prevMessages.filter(msg => msg.id !== id)
      );
      
      alert('留言已成功删除');
    } catch (err) {
      console.error('删除留言失败:', err);
      alert('删除留言失败，请重试');
    }
  };
  
  // 获取状态标签样式
  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ANSWERED':
        return 'bg-green-100 text-green-800';
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // 获取状态文本
  const getStatusText = (status: string) => {
    switch(status) {
      case 'PENDING':
        return '待处理';
      case 'ANSWERED':
        return '已回复';
      case 'ARCHIVED':
        return '已归档';
      default:
        return '未知状态';
    }
  };
  
  // 获取状态图标
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'PENDING':
        return <FiClock className="text-yellow-500" />;
      case 'ANSWERED':
        return <FiCheckCircle className="text-green-500" />;
      case 'ARCHIVED':
        return <FiArchive className="text-gray-500" />;
      default:
        return null;
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">留言管理</h1>
        <p className="mt-1 text-sm text-gray-600">处理客户咨询和联系请求</p>
      </div>
      
      {/* 筛选和搜索 */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="搜索留言..."
            />
          </div>
        </div>
        
        <div className="flex gap-2 items-center">
          <FiFilter className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          >
            <option value="all">全部状态</option>
            <option value="PENDING">待处理</option>
            <option value="ANSWERED">已回复</option>
            <option value="ARCHIVED">已归档</option>
          </select>
        </div>
      </div>
      
      {/* 留言列表 */}
      {filteredMessages.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">没有符合条件的留言</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  联系人
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  服务类型
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  提交时间
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMessages.map((message) => (
                <tr key={message.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{message.name}</div>
                    <div className="text-sm text-gray-500">{message.phone}</div>
                    <div className="text-sm text-gray-500">{message.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{message.service || '未指定'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{message.createdAt}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(message.status)}`}>
                        {getStatusIcon(message.status)}
                        <span className="ml-1">{getStatusText(message.status)}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedMessage(message);
                        setNotes(message.notes || '');
                      }}
                      className="text-primary hover:text-primary-dark mr-3"
                    >
                      <FiEdit className="inline-block mr-1" /> 处理
                    </button>
                    <button
                      onClick={() => handleDeleteMessage(message.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 className="inline-block mr-1" /> 删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* 留言详情模态框 */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">留言详情</h3>
              <button 
                onClick={() => setSelectedMessage(null)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">联系人</p>
                    <p className="font-medium">{selectedMessage.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">联系方式</p>
                    <p className="font-medium">{selectedMessage.phone}</p>
                    <p className="text-sm">{selectedMessage.email}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-500">咨询服务</p>
                  <p className="font-medium">{selectedMessage.service || '未指定'}</p>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-500">留言内容</p>
                  <div className="mt-1 bg-white p-3 border rounded-md">
                    <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center">
                  <p className="text-sm text-gray-500 mr-2">状态:</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedMessage.status)}`}>
                    {getStatusIcon(selectedMessage.status)}
                    <span className="ml-1">{getStatusText(selectedMessage.status)}</span>
                  </span>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-500">提交时间</p>
                  <p>{selectedMessage.createdAt}</p>
                </div>
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  处理备注
                </label>
                <textarea
                  id="notes"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md p-2"
                  placeholder="添加处理备注..."
                ></textarea>
              </div>
              
              <div className="flex flex-wrap justify-end gap-2 mt-6">
                <button
                  onClick={() => handleStatusChange(selectedMessage.id, 'PENDING')}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${selectedMessage.status === 'PENDING' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={selectedMessage.status === 'PENDING'}
                >
                  <FiClock className="mr-1" /> 标记为待处理
                </button>
                
                <button
                  onClick={() => handleStatusChange(selectedMessage.id, 'ANSWERED')}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${selectedMessage.status === 'ANSWERED' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={selectedMessage.status === 'ANSWERED'}
                >
                  <FiCheckCircle className="mr-1" /> 标记为已回复
                </button>
                
                <button
                  onClick={() => handleStatusChange(selectedMessage.id, 'ARCHIVED')}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${selectedMessage.status === 'ARCHIVED' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={selectedMessage.status === 'ARCHIVED'}
                >
                  <FiArchive className="mr-1" /> 归档
                </button>
                
                <button
                  onClick={() => handleDeleteMessage(selectedMessage.id)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <FiTrash2 className="mr-1" /> 删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 