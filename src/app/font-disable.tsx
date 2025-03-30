'use client';

import React from 'react';

// 系统字体堆栈
const systemFontStack = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
  "Helvetica Neue", Arial, "Noto Sans", sans-serif, 
  "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", 
  "Noto Color Emoji"`;

// 中文字体堆栈
const chineseFontStack = `"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", 
  "WenQuanYi Micro Hei", ${systemFontStack}`;

// 装饰字体堆栈
const decorativeFontStack = `"STKaiti", "KaiTi", "KaiTi_GB2312", ${chineseFontStack}`;

export default function FontDisable() {
  React.useEffect(() => {
    // 创建一个样式元素
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'fallback-font';
        src: local('PingFang SC'), local('Microsoft YaHei'), local('SimSun');
        font-display: swap;
      }
      
      * {
        font-family: ${chineseFontStack} !important;
      }
      
      .font-mashan, .chinese-title {
        font-family: ${decorativeFontStack} !important;
      }
    `;
    document.head.appendChild(style);

    // 拦截网络请求
    let originalFetch: typeof fetch | null = null;
    if (window.fetch) {
      originalFetch = window.fetch;
      const newFetch = function(input: RequestInfo | URL, init?: RequestInit) {
        const url = typeof input === 'string' ? input : input instanceof URL ? input.href : '';
        if (url && typeof url === 'string' && (url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com'))) {
          return Promise.reject(new Error('字体加载已禁用'));
        }
        return originalFetch!(input, init);
      };
      window.fetch = newFetch as typeof fetch;
    }

    return () => {
      // 清理
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
      if (originalFetch && window.fetch !== originalFetch) {
        window.fetch = originalFetch;
      }
    };
  }, []);

  return null;
} 