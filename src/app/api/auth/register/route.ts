import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcrypt';

const prisma = new PrismaClient();
const ADMIN_REGISTER_SECRET = process.env.ADMIN_REGISTER_SECRET || 'change-this-secret-in-production';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, name, email, secretKey } = body;

    // 验证必须字段
    if (!username || !password) {
      return NextResponse.json(
        { error: '用户名和密码不能为空' },
        { status: 400 }
      );
    }

    // 验证密钥（安全措施，防止未授权的注册）
    if (secretKey !== ADMIN_REGISTER_SECRET) {
      return NextResponse.json(
        { error: '无效的注册密钥' },
        { status: 403 }
      );
    }

    // 检查用户名是否已被使用
    const existingUser = await prisma.admin.findUnique({
      where: { username }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: '用户名已被使用' },
        { status: 409 }
      );
    }

    // 如果提供了邮箱，检查邮箱是否已被使用
    if (email) {
      const existingEmail = await prisma.admin.findUnique({
        where: { email }
      });

      if (existingEmail) {
        return NextResponse.json(
          { error: '邮箱已被使用' },
          { status: 409 }
        );
      }
    }

    // 创建新管理员用户
    const hashedPassword = hashSync(password, 10);
    const newAdmin = await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
        name: name || username,
        email,
        role: 'admin', // 默认角色
      }
    });

    // 返回新创建的用户信息（不包含密码）
    return NextResponse.json({
      success: true,
      user: {
        id: newAdmin.id,
        username: newAdmin.username,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role
      }
    }, { status: 201 });

  } catch (error) {
    console.error('注册错误:', error);
    return NextResponse.json(
      { error: '注册过程中发生错误' },
      { status: 500 }
    );
  }
} 