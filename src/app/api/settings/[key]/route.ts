import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// 创建Prisma客户端实例
const prisma = new PrismaClient();

// 获取单个系统设置
export async function GET(
  request: Request,
  { params }: { params: { key: string } }
) {
  try {
    const key = params.key;
    
    if (!key) {
      return NextResponse.json(
        { error: '缺少设置项的key' },
        { status: 400 }
      );
    }
    
    // 查询数据库获取特定设置项
    const setting = await prisma.siteSetting.findUnique({
      where: { key }
    });
    
    if (!setting) {
      return NextResponse.json(
        { error: '设置项不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(setting, { status: 200 });
  } catch (error) {
    console.error('获取设置项详情时出错:', error);
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    
    return NextResponse.json(
      { error: `获取设置项详情失败: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// 更新单个系统设置
export async function PATCH(
  request: Request,
  { params }: { params: { key: string } }
) {
  try {
    const key = params.key;
    
    if (!key) {
      return NextResponse.json(
        { error: '缺少设置项的key' },
        { status: 400 }
      );
    }
    
    // 解析请求体
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        { error: '请求体必须是有效的JSON' },
        { status: 400 }
      );
    }
    
    // 提取需要更新的字段
    const { value } = body;
    
    if (value === undefined) {
      return NextResponse.json(
        { error: '缺少value字段' },
        { status: 400 }
      );
    }
    
    // 使用upsert确保即使设置不存在也能创建
    const updatedSetting = await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });
    
    return NextResponse.json(updatedSetting, { status: 200 });
  } catch (error) {
    console.error('更新设置项时出错:', error);
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    
    return NextResponse.json(
      { error: `更新设置项失败: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// 删除单个系统设置
export async function DELETE(
  request: Request,
  { params }: { params: { key: string } }
) {
  try {
    const key = params.key;
    
    if (!key) {
      return NextResponse.json(
        { error: '缺少设置项的key' },
        { status: 400 }
      );
    }
    
    // 从数据库中删除设置项
    try {
      await prisma.siteSetting.delete({
        where: { key }
      });
      
      return NextResponse.json(
        { message: '设置项已成功删除' }, 
        { status: 200 }
      );
    } catch (e) {
      // 处理不存在的记录错误
      if (e instanceof Error && e.message.includes('Record to delete does not exist')) {
        return NextResponse.json(
          { error: '设置项不存在' },
          { status: 404 }
        );
      }
      throw e; // 重新抛出其他错误类型
    }
  } catch (error) {
    console.error('删除设置项时出错:', error);
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    
    return NextResponse.json(
      { error: `删除设置项失败: ${errorMessage}` },
      { status: 500 }
    );
  }
} 