(function() {
  // 拦截请求并阻止字体加载
  const originalFetch = window.fetch;
  
  window.fetch = function(input, init) {
    const url = typeof input === 'string' ? input : (input instanceof Request ? input.url : '');
    
    if (url && (url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com'))) {
      console.warn('已阻止字体加载请求：', url);
      return Promise.reject(new Error('字体加载请求已被阻止'));
    }
    
    return originalFetch.apply(this, arguments);
  }
  
  // 阻止任何可能的Font API调用
  const originalDocument = window.document;
  
  // 拦截Document对象的字体加载API
  const originalFontFace = window.FontFace;
  if (originalFontFace) {
    window.FontFace = function() {
      const source = arguments[1];
      if (typeof source === 'string' && (source.includes('gstatic') || source.includes('googleapis'))) {
        console.warn('已阻止FontFace API调用');
        throw new Error('字体加载已被禁用');
      }
      return new originalFontFace(...arguments);
    };
  }
  
  // 添加本地字体替代样式
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: 'Noto Sans SC';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: local('PingFang SC'), local('Microsoft YaHei'), local('SimSun');
    }
    
    @font-face {
      font-family: 'Noto Sans TC';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: local('PingFang TC'), local('Microsoft JhengHei'), local('MingLiU');
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
})(); 