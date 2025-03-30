import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 获取导航配置
export async function GET() {
  try {
    // 从数据库获取导航项配置
    const navigationSettings = await prisma.siteSetting.findMany({
      where: {
        key: {
          startsWith: 'navigation_'
        }
      }
    });
    
    // 如果没有设置，返回默认导航配置
    if (!navigationSettings || navigationSettings.length === 0) {
      return NextResponse.json({
        success: true,
        data: getDefaultNavigation()
      });
    }
    
    // 解析和整理导航数据
    const navigation = parseNavigationSettings(navigationSettings);
    
    return NextResponse.json({
      success: true,
      data: navigation
    });
  } catch (error) {
    console.error('获取导航配置失败:', error);
    return NextResponse.json({ 
      success: false, 
      error: '获取导航配置失败',
      data: getDefaultNavigation() // 发生错误时返回默认配置
    }, { status: 500 });
  }
}

// 保存导航配置
export async function POST(request: Request) {
  try {
    const navigation = await request.json();
    
    // 验证导航数据格式
    if (!navigation || !navigation.main || !navigation.footer || !navigation.social) {
      return NextResponse.json({
        success: false,
        error: '导航数据格式不正确'
      }, { status: 400 });
    }
    
    // 将导航数据转为字符串
    const navigationData = JSON.stringify(navigation);
    
    // 更新或创建导航设置
    const result = await prisma.siteSetting.upsert({
      where: {
        key: 'navigation_structure'
      },
      update: {
        value: navigationData
      },
      create: {
        key: 'navigation_structure',
        value: navigationData,
        description: '网站导航结构配置'
      }
    });
    
    return NextResponse.json({
      success: true,
      message: '导航配置已保存'
    });
  } catch (error) {
    console.error('保存导航配置失败:', error);
    return NextResponse.json({
      success: false,
      error: '保存导航配置失败'
    }, { status: 500 });
  }
}

// 解析导航设置
function parseNavigationSettings(settings: any[]) {
  try {
    // 尝试从设置中提取导航结构
    const navSettings = settings.find((s: any) => s.key === 'navigation_structure');
    if (navSettings && navSettings.value) {
      return JSON.parse(navSettings.value);
    }
    return getDefaultNavigation();
  } catch (e) {
    console.error('解析导航设置出错:', e);
    return getDefaultNavigation();
  }
}

// 默认导航配置
function getDefaultNavigation() {
  return {
    main: [
      { name: '首页', href: '/' },
      { name: '关于我们', href: '/about' },
      { name: '服务与项目', href: '/services' },
      { name: '作品案例', href: '/cases' },
      { name: '研究与理论', href: '/research' },
      { name: '联系我们', href: '/contact' }
    ],
    footer: [
      { name: '隐私政策', href: '/privacy' },
      { name: '服务条款', href: '/terms' },
      { name: '网站地图', href: '/sitemap' }
    ],
    social: [
      { name: '微信', href: '#', icon: 'WeChat' },
      { name: '微博', href: '#', icon: 'Weibo' }
    ]
  };
} 