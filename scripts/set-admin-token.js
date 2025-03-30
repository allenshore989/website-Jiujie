/**
 * 应急脚本：设置管理员认证令牌
 * 
 * 使用方法：
 * 1. 在开发环境中运行: node scripts/set-admin-token.js
 * 2. 脚本将引导你启动必要的环境变量和配置
 * 3. 重启服务器，应该可以无需登录直接访问管理页面
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n=== 应急管理员访问配置工具 ===\n');

// 检查.env.local文件是否存在
const envPath = path.join(process.cwd(), '.env.local');
let envContent = '';

try {
  envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
} catch (error) {
  console.error('读取环境文件失败:', error);
}

// 设置绕过认证
const bypassAuth = !envContent.includes('BYPASS_AUTH=') 
  ? 'BYPASS_AUTH=true\n' 
  : '';

// 添加JWT密钥
const jwtSecret = !envContent.includes('JWT_SECRET=') 
  ? 'JWT_SECRET=emergency-access-key\n' 
  : '';

// 添加新的环境变量
const newEnvContent = envContent
  + (bypassAuth ? bypassAuth : '')
  + (jwtSecret ? jwtSecret : '');

// 保存更新的环境文件
if (bypassAuth || jwtSecret) {
  try {
    fs.writeFileSync(envPath, newEnvContent);
    console.log('✅ 环境变量已更新');
  } catch (error) {
    console.error('写入环境文件失败:', error);
  }
} else {
  console.log('✓ 环境变量已配置');
}

// 创建中间件副本
const middlewarePath = path.join(process.cwd(), 'src/middleware.ts');
const middlewareBackupPath = path.join(process.cwd(), 'src/middleware.backup.ts');

rl.question('是否要临时禁用中间件验证？(y/n) ', (answer) => {
  if (answer.toLowerCase() === 'y') {
    try {
      // 备份当前中间件
      if (fs.existsSync(middlewarePath)) {
        fs.copyFileSync(middlewarePath, middlewareBackupPath);
        console.log('✅ 已备份中间件到 middleware.backup.ts');
        
        // 创建简化版中间件
        const simpleMiddleware = `import { NextResponse, NextRequest } from 'next/server';

// 禁用验证的简化中间件
export function middleware(request: NextRequest) {
  // 直接放行所有请求
  console.log('绕过认证:', request.nextUrl.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/admin/:path*',
  ],
};`;

        fs.writeFileSync(middlewarePath, simpleMiddleware);
        console.log('✅ 已创建简化中间件（已禁用验证）');
      }
    } catch (error) {
      console.error('操作中间件文件失败:', error);
    }
  }
  
  console.log('\n===== 配置完成 =====');
  console.log('请重启开发服务器，然后尝试访问管理页面：');
  console.log('1. http://localhost:3003/admin/dashboard');
  console.log('2. http://localhost:3003/admin/dev-entry');
  console.log('\n要恢复中间件，请运行：');
  console.log('mv src/middleware.backup.ts src/middleware.ts');
  
  rl.close();
}); 