"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ContentManagement() {
  const router = useRouter();
  const [user, setUser] = React.useState('管理员');
  const [loading, setLoading] = React.useState(true);
  
  // 编辑相关状态
  const [showModal, setShowModal] = React.useState(false);
  const [editingArticle, setEditingArticle] = React.useState<any>(null);
  const [formData, setFormData] = React.useState({
    title: '',
    content: '',
    status: '草稿',
    category: '办公空间'
  });
  
  // 筛选相关状态
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  
  // 确认删除模态框
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [articleToDelete, setArticleToDelete] = React.useState<number | null>(null);

  // 检查用户是否已登录
  React.useEffect(() => {
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
    
    // 从localStorage加载文章数据
    const savedArticles = localStorage.getItem('articles');
    if (savedArticles) {
      setArticles(JSON.parse(savedArticles));
    }
    
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  // 文章数据（模拟数据）
  const [articles, setArticles] = React.useState([
    { id: 1, title: '现代办公室的风水布局', status: '已发布', date: '2023-06-15', views: 1256, category: '办公空间', content: '本文详细介绍了现代办公室风水布局的核心要点...' },
    { id: 2, title: '易经智慧与居家环境', status: '已发布', date: '2023-07-22', views: 843, category: '住宅设计', content: '探索易经智慧如何应用于居家环境设计...' },
    { id: 3, title: '五行元素在室内设计中的应用', status: '草稿', date: '2023-08-10', views: 0, category: '室内设计', content: '五行理论提供了一个系统性的框架，用于理解不同元素之间的相互作用...' },
    { id: 4, title: '商业空间布局的风水原则', status: '已发布', date: '2023-09-05', views: 621, category: '商业空间', content: '对于商业空间而言，风水布局直接影响到财运和客流...' },
    { id: 5, title: '阴阳平衡与空间能量', status: '已发布', date: '2023-10-18', views: 432, category: '理论研究', content: '阴阳平衡是中国传统哲学的核心概念，在空间设计中扮演着重要角色...' },
  ]);

  // 保存文章数据到localStorage
  React.useEffect(() => {
    localStorage.setItem('articles', JSON.stringify(articles));
  }, [articles]);

  // 处理添加文章
  const handleAddArticle = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      content: '',
      status: '草稿',
      category: '办公空间'
    });
    setShowModal(true);
  };

  // 处理编辑文章
  const handleEditArticle = (article: any) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      status: article.status,
      category: article.category
    });
    setShowModal(true);
  };

  // 处理保存文章
  const handleSaveArticle = () => {
    if (editingArticle) {
      // 更新现有文章
      const updatedArticles = articles.map(article => 
        article.id === editingArticle.id 
          ? { 
              ...article, 
              title: formData.title, 
              content: formData.content,
              status: formData.status,
              category: formData.category,
              date: formData.status === '已发布' && article.status === '草稿' 
                ? new Date().toISOString().split('T')[0] 
                : article.date
            } 
          : article
      );
      setArticles(updatedArticles);
    } else {
      // 添加新文章
      const newArticle = {
        id: Math.max(0, ...articles.map(a => a.id)) + 1,
        title: formData.title,
        content: formData.content,
        status: formData.status,
        category: formData.category,
        date: formData.status === '已发布' 
          ? new Date().toISOString().split('T')[0] 
          : '',
        views: 0
      };
      setArticles([...articles, newArticle]);
    }
    setShowModal(false);
  };

  // 处理删除文章
  const handleDeleteClick = (id: number) => {
    setArticleToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (articleToDelete !== null) {
      const filteredArticles = articles.filter(article => article.id !== articleToDelete);
      setArticles(filteredArticles);
      setShowDeleteModal(false);
      setArticleToDelete(null);
    }
  };

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // 筛选文章
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
                <Link href="/admin/dashboard" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  控制面板
                </Link>
                <Link href="/admin/dashboard/content" className="border-primary text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  内容管理
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">内容管理</h1>
            <button 
              onClick={handleAddArticle}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              添加文章
            </button>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {/* 文章列表 */}
            <div className="mt-8">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">文章列表</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">管理您的所有文章内容</p>
                  </div>
                  <div className="flex">
                    <div className="relative">
                      <input
                        type="text"
                        className="border border-gray-300 rounded-md py-2 px-4 pl-10 focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="搜索文章..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <div className="absolute left-3 top-2.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                    <select 
                      className="ml-4 border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-primary focus:border-primary"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">所有状态</option>
                      <option value="已发布">已发布</option>
                      <option value="草稿">草稿</option>
                    </select>
                  </div>
                </div>
                <div className="border-t border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标题</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">发布日期</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">阅读量</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredArticles.map((article) => (
                        <tr key={article.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{article.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{article.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{article.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span 
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                article.status === '已发布' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {article.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{article.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{article.views}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => handleEditArticle(article)} 
                              className="text-primary hover:text-primary/80 mr-3"
                            >
                              编辑
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(article.id)} 
                              className="text-red-600 hover:text-red-900"
                            >
                              删除
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-700">
                      显示 <span className="font-medium">1</span> 到 <span className="font-medium">{filteredArticles.length}</span> 共 <span className="font-medium">{filteredArticles.length}</span> 条结果
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <a
                          href="#"
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          <span className="sr-only">上一页</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </a>
                        <a
                          href="#"
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          1
                        </a>
                        <a
                          href="#"
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          <span className="sr-only">下一页</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </a>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 添加/编辑文章模态框 */}
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {editingArticle ? '编辑文章' : '添加文章'}
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">标题</label>
                        <input
                          type="text"
                          name="title"
                          id="title"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                          value={formData.title}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">分类</label>
                        <select
                          name="category"
                          id="category"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                          value={formData.category}
                          onChange={handleInputChange}
                        >
                          <option value="办公空间">办公空间</option>
                          <option value="住宅设计">住宅设计</option>
                          <option value="商业空间">商业空间</option>
                          <option value="文化空间">文化空间</option>
                          <option value="理论研究">理论研究</option>
                          <option value="室内设计">室内设计</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">内容</label>
                        <textarea
                          name="content"
                          id="content"
                          rows={4}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                          value={formData.content}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">状态</label>
                        <select
                          name="status"
                          id="status"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                          value={formData.status}
                          onChange={handleInputChange}
                        >
                          <option value="草稿">草稿</option>
                          <option value="已发布">发布</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleSaveArticle}
                >
                  保存
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowModal(false)}
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 删除确认模态框 */}
      {showDeleteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      确认删除
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        您确定要删除这篇文章吗？此操作无法撤销。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmDelete}
                >
                  删除
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 