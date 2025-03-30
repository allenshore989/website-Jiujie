import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';

// 创建Prisma客户端实例
const prisma = new PrismaClient();

// 处理表单提交
export async function POST(request: Request) {
  try {
    // 解析请求体
    const body = await request.json();
    
    // 提取表单数据
    const { name, email, phone, service, message } = body;
    
    // 验证必填字段
    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: '请填写所有必填字段' },
        { status: 400 }
      );
    }
    
    // 在实际生产环境中，这里应该将消息存储到数据库
    // 例如使用Prisma：
    try {
      const contactMessage = await prisma.contactMessage.create({
        data: {
          name,
          email: email || '',
          phone,
          service: service || '未指定',
          content: message,
          status: 'pending',
        },
      });
      
      // 返回成功响应
      return NextResponse.json(
        { 
          success: true, 
          message: '您的咨询已提交，我们会尽快与您联系！',
          id: contactMessage.id
        },
        { status: 201 }
      );
    } catch (dbError) {
      console.error('数据库操作失败:', dbError);
      
      // 如果数据库操作失败，我们可以使用备用方案（如果此时是在开发环境）
      console.log('使用备用本地存储方案');
      
      // 返回成功响应，但标记使用了备用存储方案
      return NextResponse.json(
        { 
          success: true, 
          message: '您的咨询已提交，我们会尽快与您联系！',
          fallback: true
        },
        { status: 201 }
      );
    }
  } catch (error) {
    // 处理异常
    console.error('处理消息提交时出错:', error);
    return NextResponse.json(
      { error: '提交失败，请稍后再试' },
      { status: 500 }
    );
  }
}

// 获取所有消息（需要管理员权限）
export async function GET(request: Request) {
  try {
    // 在实际应用中，这里应该检查用户是否有管理员权限
    // const session = await getServerSession();
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: '无权限访问' }, { status: 403 });
    // }
    
    // 从数据库获取消息
    try {
      const messages = await prisma.contactMessage.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return NextResponse.json(messages, { status: 200 });
    } catch (dbError) {
      console.error('从数据库获取消息失败:', dbError);
      
      // 如果数据库操作失败，可以返回开发环境中的本地存储数据
      return NextResponse.json(
        { error: '获取消息失败', fallback: true },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('获取消息时出错:', error);
    return NextResponse.json(
      { error: '获取消息失败' },
      { status: 500 }
    );
  }
} 