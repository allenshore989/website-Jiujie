import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// 创建Prisma客户端实例
const prisma = new PrismaClient();

// 根据ID获取特定消息
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // 查询数据库获取特定消息
    const message = await prisma.contactMessage.findUnique({
      where: { id }
    });
    
    if (!message) {
      return NextResponse.json(
        { error: '消息不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(message, { status: 200 });
  } catch (error) {
    console.error('获取消息详情时出错:', error);
    return NextResponse.json(
      { error: '获取消息详情失败' },
      { status: 500 }
    );
  }
}

// 更新特定消息的状态
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const { status, notes } = body;
    
    // 验证状态值
    if (status && !['PENDING', 'ANSWERED', 'ARCHIVED'].includes(status)) {
      return NextResponse.json(
        { error: '无效的状态值' },
        { status: 400 }
      );
    }
    
    // 更新数据库中的消息
    const updatedMessage = await prisma.contactMessage.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes })
      }
    });
    
    return NextResponse.json(updatedMessage, { status: 200 });
  } catch (error) {
    console.error('更新消息状态时出错:', error);
    
    // 处理不存在的记录错误
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: '消息不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: '更新消息状态失败' },
      { status: 500 }
    );
  }
}

// 删除特定消息
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // 从数据库中删除消息
    await prisma.contactMessage.delete({
      where: { id }
    });
    
    return NextResponse.json(
      { message: '消息已成功删除' }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('删除消息时出错:', error);
    
    // 处理不存在的记录错误
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        { error: '消息不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: '删除消息失败' },
      { status: 500 }
    );
  }
} 