import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// 创建Prisma客户端实例
const prisma = new PrismaClient();

// 获取单个FAQ
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // 查询数据库获取特定FAQ
    const faq = await prisma.fAQ.findUnique({
      where: { id }
    });
    
    if (!faq) {
      return NextResponse.json(
        { error: 'FAQ不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(faq, { status: 200 });
  } catch (error) {
    console.error('获取FAQ详情时出错:', error);
    return NextResponse.json(
      { error: '获取FAQ详情失败' },
      { status: 500 }
    );
  }
}

// 更新FAQ
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    
    // 提取需要更新的字段
    const { question, answer, category, order } = body;
    
    // 验证必填字段
    if ((question !== undefined && !question) || 
        (answer !== undefined && !answer)) {
      return NextResponse.json(
        { error: '问题和答案是必填字段' },
        { status: 400 }
      );
    }
    
    // 更新数据库中的FAQ
    const updatedFAQ = await prisma.fAQ.update({
      where: { id },
      data: {
        ...(question !== undefined && { question }),
        ...(answer !== undefined && { answer }),
        ...(category !== undefined && { category }),
        ...(order !== undefined && { order: Number(order) })
      }
    });
    
    return NextResponse.json(updatedFAQ, { status: 200 });
  } catch (error) {
    console.error('更新FAQ时出错:', error);
    
    // 处理不存在的记录错误
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'FAQ不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: '更新FAQ失败' },
      { status: 500 }
    );
  }
}

// 删除FAQ
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // 从数据库中删除FAQ
    await prisma.fAQ.delete({
      where: { id }
    });
    
    return NextResponse.json(
      { message: 'FAQ已成功删除' }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('删除FAQ时出错:', error);
    
    // 处理不存在的记录错误
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        { error: 'FAQ不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: '删除FAQ失败' },
      { status: 500 }
    );
  }
} 