/**
 * 创建管理员账户脚本
 * 
 * 使用方法: node prisma/create-admin.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('开始创建管理员账户...');
    
    // 检查是否已存在同名账户
    const existingAdmin = await prisma.admin.findUnique({
      where: { username: 'admin' }
    });
    
    if (existingAdmin) {
      console.log('管理员账户已存在，无需重新创建');
      return;
    }
    
    // 创建管理员账户
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    const admin = await prisma.admin.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        name: '系统管理员',
        email: 'admin@example.com',
        role: 'admin'
      }
    });
    
    console.log(`管理员账户创建成功! ID: ${admin.id}`);
    console.log('用户名: admin');
    console.log('密码: admin123');
    console.log('\n请在登录后修改默认密码!');
    
  } catch (error) {
    console.error('创建管理员账户时出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 