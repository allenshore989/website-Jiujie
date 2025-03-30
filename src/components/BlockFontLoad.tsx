'use client';

import React from 'react';

const BlockFontLoad: React.FC = () => {
  React.useEffect(() => {
    // 拦截网络请求
    const originalFetch = window.fetch;
    const blockList = ['fonts.googleapis.com', 'fonts.gstatic.com'];
    
    window.fetch = function(input, init) {
      const url = input instanceof Request ? input.url : String(input);
      const shouldBlock = blockList.some(blockedDomain => url.includes(blockedDomain));
      
      if (shouldBlock) {
        console.log('已阻止字体加载请求:', url);
        return Promise.reject(new Error('字体加载请求已被阻止'));
      }
      
      return originalFetch.call(this, input, init);
    };
    
    // 添加本地字体样式
    const style = document.createElement('style');
    style.innerHTML = `
      @font-face {
        font-family: 'Noto Sans SC';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: local('PingFang SC'), local('Microsoft YaHei'), local('SimSun');
      }
      
      @font-face {
        font-family: 'Ma Shan Zheng';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: local('STKaiti'), local('KaiTi'), local('KaiTi_GB2312');
      }
    `;
    document.head.appendChild(style);
    
    // DNS拦截
    const meta = document.createElement('meta');
    meta.httpEquiv = 'x-dns-prefetch-control';
    meta.content = 'off';
    document.head.appendChild(meta);
    
    return () => {
      window.fetch = originalFetch;
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
      if (meta.parentNode) {
        meta.parentNode.removeChild(meta);
      }
    };
  }, []);
  
  return null;
};

export default BlockFontLoad; 