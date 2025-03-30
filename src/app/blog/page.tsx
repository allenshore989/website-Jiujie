"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// 定义文章数据类型
interface ArticleData {
  slug: string;
  title: string;
  category: string;
  date: string;
  image: string;
  summary: string;
  status?: string;
}

// 动态导入客户端组件
const PageBanner = dynamic(() => import('@/components/PageBanner'), { ssr: false });

// 静态文章数据，作为备用
const staticArticles: ArticleData[] = [
  {
    slug: "five-elements-modern-design",
    title: "易经五行理论在现代空间设计中的创新应用",
    category: "易经应用",
    date: "2023年12月15日",
    image: "/images/article-featured-1.jpg",
    summary: "五行理论是中国传统哲学的重要组成部分，它不仅可以解释自然现象，还可以指导我们的生活和工作。本文探讨了如何将五行理论应用于现代空间设计，创造能量平衡、和谐流动的环境..."
  },
  {
    slug: "energy-field-health-productivity",
    title: "环境能量场如何影响人的身心健康与工作效率",
    category: "环境能量",
    date: "2023年11月28日",
    image: "/images/article-featured-2.jpg",
    summary: "我们生活和工作的环境不仅仅是物理空间，更是充满能量的场域。这些能量场如何影响我们的健康、情绪和工作效率？如何通过调整环境能量场来提升生活品质？本文将深入探讨这些问题..."
  },
  {
    slug: "yijing-home-layout",
    title: "易经八卦与现代家居布局的对应关系",
    category: "风水设计",
    date: "2023年10月15日",
    image: "/images/article1.jpg",
    summary: "易经八卦中的每一卦都代表着特定的能量场，了解这些能量场如何影响家居布局..."
  },
  {
    slug: "five-elements-office",
    title: "五行相生相克：办公空间的能量平衡",
    category: "办公设计",
    date: "2023年9月28日",
    image: "/images/article2.jpg",
    summary: "金木水火土五行理论可以应用于办公空间设计，创造一个能量平衡、促进工作效率的环境..."
  },
  {
    slug: "yin-yang-balance",
    title: "阴阳平衡：创造和谐的生活环境",
    category: "生活空间",
    date: "2023年8月12日",
    image: "/images/article3.jpg",
    summary: "阴阳理论是易经的核心概念之一，学习如何在居家环境中创造阴阳平衡，提升居住品质..."
  },
  {
    slug: "yijing-personal-growth",
    title: "易经智慧在个人成长中的应用",
    category: "个人发展",
    date: "2023年7月20日",
    image: "/images/article4.jpg",
    summary: "易经不仅是环境设计的指导，也是个人成长的宝典。了解如何将易经智慧应用于日常生活和自我发展..."
  },
  {
    slug: "business-fengshui",
    title: "商业空间风水：如何提升店铺财运",
    category: "商业风水",
    date: "2023年6月15日",
    image: "/images/article5.jpg",
    summary: "商业空间的风水设计对生意兴隆至关重要。本文分享如何通过风水布局增强商业空间的财运能量..."
  },
  {
    slug: "bedroom-sleep-quality",
    title: "卧室风水与睡眠质量的关系研究",
    category: "健康养生",
    date: "2023年5月8日",
    image: "/images/article6.jpg",
    summary: "卧室是我们休息恢复的重要空间，其风水布局直接影响睡眠质量。探索如何优化卧室能量场，提升睡眠品质..."
  }
];

export default function BlogPage() {
  const [articles, setArticles] = React.useState<ArticleData[]>(staticArticles);
  const [featuredArticles, setFeaturedArticles] = React.useState<ArticleData[]>(staticArticles.slice(0, 2));
  const [loading, setLoading] = React.useState(true);

  // 从localStorage加载文章数据
  React.useEffect(() => {
    const loadArticles = () => {
      try {
        const savedArticlesString = localStorage.getItem('articles');
        if (savedArticlesString) {
          const savedArticles = JSON.parse(savedArticlesString);
          
          // 将后台管理系统中的文章转换为前端显示格式
          const formattedArticles = savedArticles.map((article: any) => ({
            slug: article.slug || `article-${article.id}`,
            title: article.title,
            category: article.category,
            date: article.date,
            image: article.image || `/images/article${Math.floor(Math.random() * 6) + 1}.jpg`,
            summary: article.content.substring(0, 100) + "...",
            status: article.status
          }));
          
          // 更新文章列表，优先显示已发布的文章
          const publishedArticles = formattedArticles.filter((article: ArticleData) => 
            article.status === '已发布' || !article.status
          );
          
          if (publishedArticles.length > 0) {
            setArticles(publishedArticles);
            setFeaturedArticles(publishedArticles.slice(0, 2));
          }
        }
      } catch (error) {
        console.error("解析文章数据出错:", error);
      }
      
      setLoading(false);
    };
    
    loadArticles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-4">
      {/* 使用PageBanner组件代替原有横幅 */}
      <PageBanner 
        title="易经环境设计博客" 
        subtitle="分享易经环境设计的最新理念与实践案例" 
        patternIndex={3} // 使用第三种背景图案
      />

      {/* 精选文章 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="chinese-title text-3xl text-[var(--primary)] mb-12 text-center">精选文章</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {featuredArticles.map((article: ArticleData, index: number) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-64 relative">
                  <div className="absolute inset-0 bg-[url('/images/article-featured-1.jpg')] bg-cover bg-center"></div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-[var(--primary)]/10 px-3 py-1 rounded-full">
                      <span className="text-[var(--primary)] text-sm chinese-text">{article.category}</span>
                    </div>
                    <span className="text-gray-500 text-sm ml-4 chinese-text">{article.date}</span>
                  </div>
                  <h3 className="chinese-title text-2xl text-[var(--primary)] mb-3">{article.title}</h3>
                  <p className="chinese-text mb-4">
                    {article.summary}
                  </p>
                  <Link 
                    href={`/blog/${article.slug}`}
                    className="inline-block chinese-text text-[var(--primary)] border-b-2 border-[var(--primary)] hover:text-[var(--primary)]/80 hover:border-[var(--primary)]/80 transition-colors"
                  >
                    阅读全文 →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 所有文章 */}
      <section className="py-16 bg-[var(--neutral)]">
        <div className="container mx-auto px-4">
          <h2 className="chinese-title text-3xl text-[var(--primary)] mb-12 text-center">最新文章</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.slice(0, 6).map((article: ArticleData, index: number) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="aspect-video relative">
                  <div className={`absolute inset-0 bg-[url('/images/article${index % 6 + 1}.jpg')] bg-cover bg-center`}></div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-[var(--primary)]/10 px-3 py-1 rounded-full">
                      <span className="text-[var(--primary)] text-sm chinese-text">{article.category}</span>
                    </div>
                    <span className="text-gray-500 text-sm ml-4 chinese-text">{article.date}</span>
                  </div>
                  <h3 className="chinese-title text-xl text-[var(--primary)] mb-2">{article.title}</h3>
                  <p className="chinese-text mb-4">{article.summary}</p>
                  <Link 
                    href={`/blog/${article.slug}`}
                    className="chinese-text text-[var(--primary)] hover:underline"
                  >
                    阅读全文 →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {/* 分页 */}
          <div className="flex justify-center mt-12">
            <div className="flex space-x-2">
              <span className="w-10 h-10 flex items-center justify-center bg-[var(--primary)] text-white rounded-full chinese-text">1</span>
              <a href="#" className="w-10 h-10 flex items-center justify-center hover:bg-[var(--neutral)]/80 rounded-full chinese-text">2</a>
              <a href="#" className="w-10 h-10 flex items-center justify-center hover:bg-[var(--neutral)]/80 rounded-full chinese-text">3</a>
              <span className="w-10 h-10 flex items-center justify-center chinese-text">...</span>
              <a href="#" className="w-10 h-10 flex items-center justify-center hover:bg-[var(--neutral)]/80 rounded-full chinese-text">5</a>
            </div>
          </div>
        </div>
      </section>

      {/* 文章分类 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="chinese-title text-3xl text-[var(--primary)] mb-12 text-center">文章分类</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <a href="#" className="bg-[var(--neutral)] hover:bg-[var(--neutral)]/80 p-6 rounded-lg text-center transition-colors">
              <h3 className="chinese-title text-xl text-[var(--primary)] mb-2">风水设计</h3>
              <p className="chinese-text text-sm">12 篇文章</p>
            </a>
            
            <a href="#" className="bg-[var(--neutral)] hover:bg-[var(--neutral)]/80 p-6 rounded-lg text-center transition-colors">
              <h3 className="chinese-title text-xl text-[var(--primary)] mb-2">易经应用</h3>
              <p className="chinese-text text-sm">9 篇文章</p>
            </a>
            
            <a href="#" className="bg-[var(--neutral)] hover:bg-[var(--neutral)]/80 p-6 rounded-lg text-center transition-colors">
              <h3 className="chinese-title text-xl text-[var(--primary)] mb-2">商业空间</h3>
              <p className="chinese-text text-sm">8 篇文章</p>
            </a>
            
            <a href="#" className="bg-[var(--neutral)] hover:bg-[var(--neutral)]/80 p-6 rounded-lg text-center transition-colors">
              <h3 className="chinese-title text-xl text-[var(--primary)] mb-2">居家环境</h3>
              <p className="chinese-text text-sm">14 篇文章</p>
            </a>
            
            <a href="#" className="bg-[var(--neutral)] hover:bg-[var(--neutral)]/80 p-6 rounded-lg text-center transition-colors">
              <h3 className="chinese-title text-xl text-[var(--primary)] mb-2">办公设计</h3>
              <p className="chinese-text text-sm">7 篇文章</p>
            </a>
            
            <a href="#" className="bg-[var(--neutral)] hover:bg-[var(--neutral)]/80 p-6 rounded-lg text-center transition-colors">
              <h3 className="chinese-title text-xl text-[var(--primary)] mb-2">健康养生</h3>
              <p className="chinese-text text-sm">10 篇文章</p>
            </a>
            
            <a href="#" className="bg-[var(--neutral)] hover:bg-[var(--neutral)]/80 p-6 rounded-lg text-center transition-colors">
              <h3 className="chinese-title text-xl text-[var(--primary)] mb-2">个人发展</h3>
              <p className="chinese-text text-sm">6 篇文章</p>
            </a>
            
            <a href="#" className="bg-[var(--neutral)] hover:bg-[var(--neutral)]/80 p-6 rounded-lg text-center transition-colors">
              <h3 className="chinese-title text-xl text-[var(--primary)] mb-2">案例分析</h3>
              <p className="chinese-text text-sm">11 篇文章</p>
            </a>
          </div>
        </div>
      </section>

      {/* 订阅部分 */}
      <section className="py-16 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="chinese-title text-3xl mb-6">订阅最新文章</h2>
          <p className="chinese-text text-xl max-w-2xl mx-auto mb-8">
            订阅我们的电子邮件通讯，获取最新的易经研究和环境能量设计文章更新
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="请输入您的电子邮件" 
                className="flex-grow px-4 py-3 rounded-md focus:outline-none text-gray-800"
              />
              <button className="bg-white text-[var(--primary)] hover:bg-white/90 px-6 py-3 rounded-md chinese-text transition-colors">
                订阅
              </button>
            </div>
            <p className="text-sm mt-3 chinese-text opacity-80">我们尊重您的隐私，绝不会将您的信息分享给第三方</p>
          </div>
        </div>
      </section>
    </div>
  );
} 