import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// 创建Prisma客户端实例
const prisma = new PrismaClient();

// 获取所有分支机构
export async function GET() {
  try {
    // 尝试从数据库中获取分支机构
    try {
      const branches = await prisma.branchOffice.findMany({
        orderBy: {
          city: 'asc'
        }
      });
      
      return NextResponse.json(branches, { status: 200 });
    } catch (error) {
      console.error('从数据库获取分支机构失败:', error);
      
      // 如果数据库操作失败，返回备用数据
      const defaultBranches = [
        {
          id: 'beijing',
          city: '北京总部',
          address: '朝阳区建国路88号',
          phone: '010-12345678',
          email: 'beijing@yijingdesign.cn'
        },
        {
          id: 'shanghai',
          city: '上海分部',
          address: '浦东新区陆家嘴金融中心',
          phone: '021-87654321',
          email: 'shanghai@yijingdesign.cn'
        },
        {
          id: 'guangzhou',
          city: '广州分部',
          address: '天河区珠江新城',
          phone: '020-56781234',
          email: 'guangzhou@yijingdesign.cn'
        },
        {
          id: 'chengdu',
          city: '成都分部',
          address: '锦江区红星路',
          phone: '028-98765432',
          email: 'chengdu@yijingdesign.cn'
        }
      ];
      
      return NextResponse.json(defaultBranches, { 
        status: 200,
        headers: { 'X-Data-Source': 'fallback' } 
      });
    }
  } catch (error) {
    console.error('获取分支机构数据时出错:', error);
    return NextResponse.json(
      { error: '获取分支机构数据失败' },
      { status: 500 }
    );
  }
}

// 创建新分支机构
export async function POST(request: Request) {
  try {
    // 解析请求体
    const body = await request.json();
    
    // 提取必要字段
    const { city, address, phone, email } = body;
    
    // 验证必填字段
    if (!city || !address || !phone) {
      return NextResponse.json(
        { error: '城市、地址和电话是必填字段' },
        { status: 400 }
      );
    }
    
    // 创建新分支机构记录
    const newBranch = await prisma.branchOffice.create({
      data: {
        city,
        address,
        phone,
        email: email || '',
      }
    });
    
    return NextResponse.json(newBranch, { status: 201 });
  } catch (error) {
    console.error('创建分支机构时出错:', error);
    return NextResponse.json(
      { error: '创建分支机构失败' },
      { status: 500 }
    );
  }
} 