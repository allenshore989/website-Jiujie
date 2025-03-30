/** @type {import('next').NextConfig} */
const nextConfig = {
  // 配置选项
  images: {
    domains: [],
  },
  experimental: {
    // 禁用外部请求
    externalDir: true,
  },
  // 完全禁用远程字体抓取
  optimizeFonts: false,
  // 禁用远程模式，强制使用本地资源
  assetPrefix: '',
  // 字体加载拦截
  webpack: (config, { isServer, nextRuntime }) => {
    // 完全阻止字体相关模块
    config.resolve.alias = {
      ...config.resolve.alias,
      'next/font/google': false,
      'next/font': false,
      // 阻止任何可能的字体相关模块
      '@next/font': false,
    };

    // 添加模块拦截器
    if (!isServer) {
      config.module.rules.push({
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              emitFile: false,
              name: '[path][name].[ext]',
            },
          },
        ],
      });
    }

    // 添加watchOptions，忽略System Volume Information目录
    config.watchOptions = {
      ignored: ['**/node_modules', '**/System Volume Information', '**/\\.git'],
      aggregateTimeout: 300,
      poll: 1000,
    };

    return config;
  },
  // 阻止所有DNS预取
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'x-dns-prefetch-control',
            value: 'off',
          },
          // 禁止预连接和字体加载
          {
            key: 'Link',
            value: '',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 