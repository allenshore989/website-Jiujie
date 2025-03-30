import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// 创建Prisma客户端实例
const prisma = new PrismaClient();

// 获取所有系统设置
export async function GET() {
  try {
    // 尝试从数据库中获取设置
    const settings = await prisma.siteSetting.findMany({
      orderBy: {
        key: 'asc'
      }
    });
    
    // 检查是否有数据
    if (settings && settings.length > 0) {
      // 去除可能的重复项 - 只保留每个key的最新记录
      const uniqueSettings = [];
      const processedKeys = new Set();
      
      for (const setting of settings) {
        if (!processedKeys.has(setting.key)) {
          uniqueSettings.push(setting);
          processedKeys.add(setting.key);
        }
      }
      
      return NextResponse.json(uniqueSettings, { status: 200 });
    }
    
    // 如果没有数据，返回默认设置
    console.log('数据库中没有设置数据，返回默认设置');
    const defaultSettings = [
      {
        id: '1',
        key: 'siteName',
        value: '易经环境设计',
        updatedAt: new Date()
      },
      {
        id: '2',
        key: 'contactEmail',
        value: 'contact@yijingdesign.cn',
        updatedAt: new Date()
      },
      {
        id: '3',
        key: 'phoneNumber',
        value: '010-12345678',
        updatedAt: new Date()
      },
      {
        id: '4',
        key: 'address',
        value: '北京市朝阳区建国路88号',
        updatedAt: new Date()
      },
      {
        id: '5',
        key: 'icp',
        value: '京ICP备XXXXXXXX号',
        updatedAt: new Date()
      }
    ];
    
    return NextResponse.json(defaultSettings, { 
      status: 200,
      headers: { 'X-Data-Source': 'default' } 
    });
  } catch (error) {
    console.error('获取系统设置数据时出错:', error);
    return NextResponse.json(
      { error: '获取系统设置数据失败' },
      { status: 500 }
    );
  }
}

// 批量更新系统设置
export async function POST(request: Request) {
  try {
    // 解析请求体
    const settings = await request.json();
    
    if (!Array.isArray(settings)) {
      return NextResponse.json(
        { error: '请求格式错误，应为设置数组' },
        { status: 400 }
      );
    }
    
    // 验证每个设置项
    for (const setting of settings) {
      const { key, value } = setting;
      
      if (!key || value === undefined) {
        return NextResponse.json(
          { error: `设置项缺少key或value: ${JSON.stringify(setting)}` },
          { status: 400 }
        );
      }
    }
    
    // 使用事务批量更新设置
    const result = await prisma.$transaction(
      settings.map((setting: { key: string; value: string }) => {
        return prisma.siteSetting.upsert({
          where: { key: setting.key },
          update: { value: setting.value },
          create: { key: setting.key, value: setting.value }
        });
      })
    );
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('更新系统设置时出错:', error);
    
    // 提供更详细的错误信息
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    
    return NextResponse.json(
      { error: `更新系统设置失败: ${errorMessage}` },
      { status: 500 }
    );
  }
} 