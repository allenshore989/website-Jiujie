import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// 创建Prisma客户端实例
const prisma = new PrismaClient();

// 获取单个分支机构
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // 查询数据库获取特定分支机构
    const branch = await prisma.branchOffice.findUnique({
      where: { id }
    });
    
    if (!branch) {
      return NextResponse.json(
        { error: '分支机构不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(branch, { status: 200 });
  } catch (error) {
    console.error('获取分支机构详情时出错:', error);
    return NextResponse.json(
      { error: '获取分支机构详情失败' },
      { status: 500 }
    );
  }
}

// 更新分支机构
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    
    // 提取需要更新的字段
    const { city, address, phone, email } = body;
    
    // 验证必填字段
    if ((city !== undefined && !city) || 
        (address !== undefined && !address) || 
        (phone !== undefined && !phone)) {
      return NextResponse.json(
        { error: '城市、地址和电话是必填字段' },
        { status: 400 }
      );
    }
    
    // 更新数据库中的分支机构
    const updatedBranch = await prisma.branchOffice.update({
      where: { id },
      data: {
        ...(city !== undefined && { city }),
        ...(address !== undefined && { address }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email })
      }
    });
    
    return NextResponse.json(updatedBranch, { status: 200 });
  } catch (error) {
    console.error('更新分支机构时出错:', error);
    
    // 处理不存在的记录错误
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: '分支机构不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: '更新分支机构失败' },
      { status: 500 }
    );
  }
}

// 删除分支机构
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // 从数据库中删除分支机构
    await prisma.branchOffice.delete({
      where: { id }
    });
    
    return NextResponse.json(
      { message: '分支机构已成功删除' }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('删除分支机构时出错:', error);
    
    // 处理不存在的记录错误
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        { error: '分支机构不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: '删除分支机构失败' },
      { status: 500 }
    );
  }
} 