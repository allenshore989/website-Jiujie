import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// 创建管理员账户
export async function POST(req: Request) {
  try {
    const { name, email, password, secretKey } = await req.json();

    // 验证请求
    if (!name || !email || !password || !secretKey) {
      return NextResponse.json(
        { error: "缺少必要参数" },
        { status: 400 }
      );
    }

    // 验证密钥
    const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "easy-yijing-admin-2024";
    if (secretKey !== ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { error: "安全密钥无效" },
        { status: 403 }
      );
    }

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "该邮箱已被注册" },
        { status: 409 }
      );
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    // 返回结果（不包含密码）
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("创建管理员出错:", error);
    return NextResponse.json(
      { error: "创建管理员失败" },
      { status: 500 }
    );
  }
} 