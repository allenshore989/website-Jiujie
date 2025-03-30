import { NextResponse, NextRequest } from 'next/server';

// 受保护的API路径
const protectedApiPaths = [
  '/api/settings',
  '/api/contact/message',
  '/api/branches',
  '/api/faqs',
];

// 受保护的管理页面路径
const protectedAdminPaths = [
  '/admin/dashboard',
  '/admin/messages',
  '/admin/branches',
  '/admin/faqs',
  '/admin/settings',
];

// 公共路径，不需要认证
const publicPaths = [
  '/admin/login',
  '/admin/auth-check',
  '/admin/dev-entry',  // 添加开发入口点
  '/api/auth',
];

// JWT密钥
// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// 开发环境绕过验证
const DEV_MODE_BYPASS = true; // 临时启用开发模式绕过

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 在开发模式下绕过认证
  if (DEV_MODE_BYPASS && pathname.startsWith('/admin/')) {
    console.log(`开发模式: 绕过认证 ${pathname}`);
    return NextResponse.next();
  }
  
  // 检查是否是公共路径
  for (const path of publicPaths) {
    if (pathname.startsWith(path)) {
      return NextResponse.next();
    }
  }
  
  // 获取认证令牌
  const token = request.cookies.get('auth-token')?.value || 
                request.headers.get('Authorization')?.split(' ')[1];
                
  // 在开发模式下API绕过认证
  if (DEV_MODE_BYPASS && pathname.startsWith('/api/')) {
    console.log(`开发模式: API绕过认证 ${pathname}`);
    return NextResponse.next();
  }
  
  // 开发环境中的调试信息
  console.log(`路径: ${pathname}`);
  console.log(`令牌: ${token ? '存在' : '不存在'}`);
  
  // 如果是需要保护的API路径
  if (pathname.startsWith('/api/')) {
    for (const path of protectedApiPaths) {
      if (pathname.startsWith(path)) {
        // 验证令牌
        if (!token) {
          return NextResponse.json(
            { error: '未授权，需要登录' },
            { status: 401 }
          );
        }
        
        // 临时跳过JWT验证
        return NextResponse.next();
        
        // try {
        //   // 验证JWT令牌
        //   verify(token, JWT_SECRET);
        //   return NextResponse.next();
        // } catch (error) {
        //   console.error('令牌验证失败:', error);
        //   return NextResponse.json(
        //     { error: '会话已过期或无效，请重新登录' },
        //     { status: 401 }
        //   );
        // }
      }
    }
  }
  
  // 如果是需要保护的管理页面
  if (pathname.startsWith('/admin/')) {
    for (const path of protectedAdminPaths) {
      if (pathname.startsWith(path)) {
        // 验证令牌
        if (!token) {
          // 重定向到登录页面，并传递返回URL
          const url = new URL('/admin/login', request.url);
          url.searchParams.set('returnUrl', pathname);
          return NextResponse.redirect(url);
        }
        
        // 临时跳过JWT验证
        return NextResponse.next();
        
        // try {
        //   // 验证JWT令牌
        //   verify(token, JWT_SECRET);
        //   return NextResponse.next();
        // } catch (error) {
        //   console.error('令牌验证失败:', error);
        //   // 重定向到登录页面，并传递返回URL
        //   const url = new URL('/admin/login', request.url);
        //   url.searchParams.set('returnUrl', pathname);
        //   return NextResponse.redirect(url);
        // }
      }
    }
  }
  
  // 如果不是受保护的路径，继续执行
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/admin/:path*',
  ],
}; 