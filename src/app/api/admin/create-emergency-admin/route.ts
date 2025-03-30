import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcrypt';

const prisma = new PrismaClient();
const EMERGENCY_SECRET = process.env.EMERGENCY_SECRET || 'only-for-development-use';

export async function GET(request: NextRequest) {
  try {
    // 只在开发环境或有正确密钥的情况下使用
    const { searchParams } = new URL(request.url);
    const secretKey = searchParams.get('key');
    
    // 验证密钥
    if (process.env.NODE_ENV !== 'development' && secretKey !== EMERGENCY_SECRET) {
      return NextResponse.json(
        { error: '无效的密钥或非开发环境' },
        { status: 403 }
      );
    }

    // 检查管理员账户是否已经存在
    const existingAdmin = await prisma.admin.findUnique({
      where: { username: 'admin' }
    });

    if (existingAdmin) {
      return NextResponse.json({
        message: '管理员账户已存在',
        adminExists: true,
        adminId: existingAdmin.id
      });
    }

    // 创建默认管理员账户
    const hashedPassword = hashSync('admin123', 10);
    const admin = await prisma.admin.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        name: '系统管理员',
        email: 'admin@example.com',
        role: 'admin'
      }
    });

    return NextResponse.json({
      success: true,
      message: '管理员账户创建成功',
      admin: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
        role: admin.role
      },
      loginInfo: {
        username: 'admin',
        password: 'admin123'
      }
    });
  } catch (error) {
    console.error('创建应急管理员账户时出错:', error);
    return NextResponse.json(
      { error: '创建管理员账户失败' },
      { status: 500 }
    );
  }
} 