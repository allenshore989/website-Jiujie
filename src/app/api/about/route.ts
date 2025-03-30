import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// 默认关于页面数据
const defaultAboutData = {
  mission: {
    title: "我们的使命",
    content: [
      "易经环境设计成立于2008年，是一家专注于将中国传统易经哲学与现代空间设计相结合的专业机构。我们的使命是通过专业的环境设计，帮助人们创造和谐、平衡的生活和工作空间，从而提升生活质量和工作效率。",
      "我们的团队由经验丰富的易经专家、室内设计师和建筑师组成，致力于为客户提供全方位的环境解决方案。我们相信，一个好的环境不仅要美观实用，更要与人的身心和自然规律相协调。"
    ],
    features: [
      {
        title: "理论与实践相结合",
        description: "将古老易经理论用于现代空间设计"
      },
      {
        title: "个性化定制方案", 
        description: "根据客户需求量身打造专属设计"
      }
    ]
  },
  history: {
    title: "我们的历程",
    events: [
      { year: "2008年", description: "易经环境设计在北京成立，初期主要提供住宅风水咨询服务。" },
      { year: "2012年", description: "业务扩展至商业空间设计领域，并完成首个大型商业项目。" },
      { year: "2015年", description: "开展易经文化讲座与培训活动，传播易经环境设计理念。" },
      { year: "2018年", description: "在上海、成都设立分支机构，服务范围扩展至全国主要城市。" },
      { year: "2021年", description: "推出线上咨询服务，结合数字技术提供更便捷的服务体验。" },
      { year: "2023年至今", description: "持续创新，将现代科技与传统易经智慧相结合，开创环境设计新模式。" }
    ]
  },
  team: {
    title: "专业团队",
    members: [
      {
        name: "张大师",
        title: "首席设计师",
        image: "/images/placeholder.svg",
        description: "20年易经环境设计经验，专注于商业空间的风水布局优化。曾为多家知名企业提供办公环境设计服务。"
      },
      {
        name: "李教授",
        title: "易经学术顾问",
        image: "/images/placeholder.svg",
        description: "国内知名易学专家，著有《现代空间与易经》等多部著作。负责团队的理论指导与培训工作。"
      },
      {
        name: "王设计师",
        title: "室内空间设计师",
        image: "/images/placeholder.svg",
        description: "将现代设计理念与传统风水学巧妙结合，打造美观与实用兼备的空间。擅长住宅与商业空间设计。"
      }
    ]
  }
};

// 数据文件路径
const DATA_DIR = path.join(process.cwd(), 'data');
const ABOUT_DATA_FILE = path.join(DATA_DIR, 'about.json');

// 确保数据目录存在
function ensureDataDirExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// 读取数据文件
function readAboutData() {
  ensureDataDirExists();
  
  try {
    if (fs.existsSync(ABOUT_DATA_FILE)) {
      const data = fs.readFileSync(ABOUT_DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('读取关于页数据出错:', error);
  }
  
  // 如果文件不存在或读取出错，返回默认数据并写入文件
  writeAboutData(defaultAboutData);
  return defaultAboutData;
}

// 写入数据文件
function writeAboutData(data: any) {
  ensureDataDirExists();
  
  try {
    fs.writeFileSync(ABOUT_DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('写入关于页数据出错:', error);
    return false;
  }
}

// GET处理程序 - 获取关于页数据
export async function GET(request: NextRequest) {
  try {
    const data = readAboutData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('获取关于页数据失败:', error);
    return NextResponse.json(
      { error: '获取关于页数据失败' },
      { status: 500 }
    );
  }
}

// POST处理程序 - 更新关于页数据
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // 验证数据结构 (简单验证)
    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { error: '无效的数据格式' },
        { status: 400 }
      );
    }
    
    const success = writeAboutData(data);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: '保存数据失败' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('更新关于页数据失败:', error);
    return NextResponse.json(
      { error: '更新关于页数据失败' },
      { status: 500 }
    );
  }
} 