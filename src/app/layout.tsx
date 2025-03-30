import React from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import './fonts.css';
import Script from 'next/script';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Viewport 配置
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.5,
  userScalable: true,
};

// 页面元数据
export const metadata: Metadata = {
  title: {
    template: '%s | 易经环境设计',
    default: '易经环境设计 - 融合古老智慧与现代空间设计',
  },
  description: '我们专注于将传统易经智慧与现代设计理念结合，为您的生活与工作空间创造和谐、平衡与美的环境。',
  keywords: ['易经', '风水', '环境设计', '空间能量', '中式设计', '八卦', '五行', '阴阳平衡'],
  authors: [{ name: '易经环境设计团队' }],
  creator: '易经环境设计',
  publisher: '易经环境设计',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  robots: 'index, follow',
};

// 根布局组件
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <head>
        <meta name="description" content="我们专注于将传统易经智慧与现代设计理念结合，为您的生活与工作空间创造和谐、平衡与美的环境。" />
        <meta httpEquiv="Content-Security-Policy" content="font-src 'self' data: https://fonts.googleapis.com https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self'; default-src 'self';" />
        <link href="https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap" rel="stylesheet" />
        <Script id="font-loading" strategy="beforeInteractive">
          {`
            (function() {
              // 仅允许加载Ma Shan Zheng字体
              const originalFetch = window.fetch;
              
              if (originalFetch) {
                window.fetch = function(input, init) {
                  const url = typeof input === 'string' ? input : (input instanceof Request ? input.url : '');
                  
                  if (url && (url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com'))) {
                    // 允许Ma Shan Zheng字体
                    if (url.includes('Ma+Shan+Zheng') || url.includes('MaShanZheng')) {
                      console.log('允许中国风字体加载：', url);
                      return originalFetch.apply(this, arguments);
                    } else {
                      console.warn('已阻止非中国风字体加载请求：', url);
                      return Promise.reject(new Error('字体加载请求已被阻止'));
                    }
                  }
                  
                  return originalFetch.apply(this, arguments);
                }
              }
            })();
          `}
        </Script>
      </head>
      <body className="bg-background font-sans text-gray-800 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-0">
          {children}
        </main>
        <Footer />
        
        {/* 返回顶部按钮 */}
        <Script id="scroll-to-top" strategy="afterInteractive">
          {`
            document.addEventListener('DOMContentLoaded', function() {
              // 创建返回顶部按钮
              const scrollToTopBtn = document.createElement('button');
              scrollToTopBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>';
              scrollToTopBtn.className = 'fixed bottom-8 right-8 p-3 rounded-full bg-primary text-white shadow-lg transform scale-0 transition-transform duration-300 hover:bg-primary-dark focus:outline-none';
              scrollToTopBtn.id = 'scrollToTopBtn';
              scrollToTopBtn.setAttribute('aria-label', '返回顶部');
              document.body.appendChild(scrollToTopBtn);
              
              // 滚动事件处理
              window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                  scrollToTopBtn.classList.remove('scale-0');
                  scrollToTopBtn.classList.add('scale-100');
                } else {
                  scrollToTopBtn.classList.remove('scale-100');
                  scrollToTopBtn.classList.add('scale-0');
                }
              });
              
              // 点击事件
              scrollToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth'
                });
              });
            });
          `}
        </Script>
      </body>
    </html>
  );
}