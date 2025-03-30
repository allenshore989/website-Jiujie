"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaWeixin, FaWeibo } from 'react-icons/fa';

// 定义联系信息接口
interface ContactInfo {
  address: string;
  phone: string;
  customerService: string;
  email: string;
  businessEmail: string;
  workingHours: string;
  socialMedia: {
    weixin: string;
    weibo: string;
    xiaohongshu: string;
  }
}

interface NavItem {
  name: string;
  href: string;
  icon?: string;
}

interface Navigation {
  main: NavItem[];
  footer: NavItem[];
  social: NavItem[];
}

export default function Footer() {
  const [navigation, setNavigation] = React.useState<Navigation | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [year] = React.useState(() => new Date().getFullYear());
  const [contactInfo, setContactInfo] = React.useState<ContactInfo | null>(null);

  React.useEffect(() => {
    const fetchNavigation = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/navigation');
        
        if (!response.ok) {
          throw new Error('获取导航数据失败');
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
        // 设置默认导航数据
        setNavigation(getDefaultNavigation());
      } finally {
        setLoading(false);
      }
    };

    fetchNavigation();
  }, []);

  React.useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await fetch('/api/contact');
        
        if (!response.ok) {
          throw new Error(`获取联系信息失败: ${response.status}`);
        }
        
        const data = await response.json();
        setContactInfo(data);
      } catch (err) {
        console.error('获取联系信息时出错:', err);
        setError(err instanceof Error ? err.message : '未知错误');
      }
    };
    
    fetchContactInfo();
  }, []);

  // 加载中显示骨架屏
  if (loading) {
    return <FooterSkeleton />;
  }

  // 发生错误时显示默认导航
  if (error || !navigation) {
    console.warn('使用默认导航数据:', error);
    return <DefaultFooter year={year} />;
  }

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 品牌信息 */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center">
              <div className="h-20 w-20 bg-white/20 rounded-full mb-4 flex items-center justify-center text-lg font-bold">易经</div>
            </Link>
            <p className="text-sm mt-2">易经环境设计专注于中国传统文化与现代设计的融合，为客户提供独特的环境设计解决方案。</p>
          </div>
          
          {/* 主导航 */}
          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-4">网站导航</h3>
            <ul className="space-y-2">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className="text-white/80 hover:text-white transition"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* 联系信息 */}
          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-4">联系我们</h3>
            <ul className="space-y-2 text-white/80">
              <li>电话: {contactInfo?.phone || '020-1234-5678'}</li>
              <li>邮箱: {contactInfo?.email || 'info@yijing-design.com'}</li>
              <li>地址: {contactInfo?.address || '广州市天河区某某路88号'}</li>
            </ul>
          </div>
          
          {/* 社交媒体 */}
          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-4">关注我们</h3>
            <div className="flex space-x-4">
              {navigation.social.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href}
                  className="text-white/80 hover:text-white transition"
                  title={item.name}
                >
                  {renderSocialIcon(item.icon)}
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* 版权和底部链接 */}
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between">
          <p className="text-sm text-white/80">
            &copy; {year} 易经环境设计 版权所有
          </p>
          <nav className="flex flex-wrap space-x-4 mt-4 md:mt-0">
            {navigation.footer.map((item) => (
              <Link 
                key={item.name}
                href={item.href}
                className="text-sm text-white/80 hover:text-white transition"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

function renderSocialIcon(icon?: string) {
  switch (icon) {
    case 'WeChat':
      return <FaWeixin size={24} />;
    case 'Weibo':
      return <FaWeibo size={24} />;
    default:
      return <span className="w-6 h-6 bg-white/20 rounded-full" />;
  }
}

// 加载中显示的骨架屏
function FooterSkeleton() {
  return (
    <footer className="bg-primary text-white animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="h-20 w-20 bg-white/20 rounded mb-4"></div>
            <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-full"></div>
          </div>
          
          {[...Array(3)].map((_, i) => (
            <div key={i} className="col-span-1">
              <div className="h-6 bg-white/20 rounded w-32 mb-4"></div>
              <div className="space-y-2">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-4 bg-white/20 rounded w-24"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between">
          <div className="h-4 bg-white/20 rounded w-48"></div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 bg-white/20 rounded w-16"></div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// 默认底部导航
function DefaultFooter({ year }: { year: number }) {
  const defaultNav = getDefaultNavigation();
  
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center">
              <div className="h-20 w-20 bg-white/20 rounded-full mb-4 flex items-center justify-center text-lg font-bold">易经</div>
            </Link>
            <p className="text-sm mt-2">易经环境设计专注于中国传统文化与现代设计的融合，为客户提供独特的环境设计解决方案。</p>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-4">网站导航</h3>
            <ul className="space-y-2">
              {defaultNav.main.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-white/80 hover:text-white transition">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-4">联系我们</h3>
            <ul className="space-y-2 text-white/80">
              <li>电话: 020-1234-5678</li>
              <li>邮箱: info@yijing-design.com</li>
              <li>地址: 广州市天河区某某路88号</li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-4">关注我们</h3>
            <div className="flex space-x-4">
              {defaultNav.social.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href}
                  className="text-white/80 hover:text-white transition"
                  title={item.name}
                >
                  {renderSocialIcon(item.icon)}
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between">
          <p className="text-sm text-white/80">
            &copy; {year} 易经环境设计 版权所有
          </p>
          <nav className="flex flex-wrap space-x-4 mt-4 md:mt-0">
            {defaultNav.footer.map((item) => (
              <Link 
                key={item.name}
                href={item.href}
                className="text-sm text-white/80 hover:text-white transition"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

// 默认导航配置
function getDefaultNavigation(): Navigation {
  return {
    main: [
      { name: '首页', href: '/' },
      { name: '关于我们', href: '/about' },
      { name: '服务与项目', href: '/services' },
      { name: '作品案例', href: '/cases' },
      { name: '研究与理论', href: '/research' },
      { name: '联系我们', href: '/contact' }
    ],
    footer: [
      { name: '隐私政策', href: '/privacy' },
      { name: '服务条款', href: '/terms' },
      { name: '网站地图', href: '/sitemap' }
    ],
    social: [
      { name: '微信', href: '#', icon: 'WeChat' },
      { name: '微博', href: '#', icon: 'Weibo' }
    ]
  };
} 