import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// 创建Prisma客户端实例
const prisma = new PrismaClient();

// 获取所有常见问题
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  
  try {
    // 尝试从数据库中获取FAQ
    try {
      const whereClause = category ? { category } : {};
      
      const faqs = await prisma.fAQ.findMany({
        where: whereClause,
        orderBy: {
          order: 'asc'
        }
      });
      
      return NextResponse.json(faqs, { status: 200 });
    } catch (error) {
      console.error('从数据库获取FAQ失败:', error);
      
      // 如果数据库操作失败，返回备用数据
      const defaultFAQs = [
        {
          id: '1',
          question: '易经环境设计服务流程是怎样的？',
          answer: '我们的服务流程通常包括：初步咨询、现场勘察、方案设计、实施指导和后续跟进。整个过程中，我们会与客户保持密切沟通，确保设计方案符合客户期望并取得实际效果。',
          category: 'service',
          order: 1
        },
        {
          id: '2',
          question: '需要亲自到现场勘察吗，还是可以远程提供服务？',
          answer: '我们推荐现场勘察以获取最准确的环境信息，但也提供远程咨询服务。远程服务需要客户提供详细的空间图片、平面图和相关信息，我们会基于这些资料提供专业建议。',
          category: 'service',
          order: 2
        },
        {
          id: '3',
          question: '改变住宅或办公空间的风水需要大规模装修吗？',
          answer: '不一定。很多风水优化可以通过调整家具布局、更换装饰品、添加特定元素等小改动实现。我们会根据具体情况提供最经济实用的方案，尽量避免不必要的大规模装修。',
          category: 'implementation',
          order: 3
        },
        {
          id: '4',
          question: '服务费用是如何计算的？',
          answer: '我们的服务费用根据项目类型、空间大小和服务内容有所不同。一般包括咨询费、方案设计费和实施指导费。您可以联系我们获取详细的报价单。',
          category: 'pricing',
          order: 4
        },
        {
          id: '5',
          question: '易经风水设计与普通室内设计有什么区别？',
          answer: '易经风水设计在注重美观和功能性的同时，更关注空间的能量流动、五行平衡和对居住者的影响。我们会根据易经原理和客户个人的生辰八字，设计更加和谐、平衡的生活或工作环境。',
          category: 'concept',
          order: 5
        }
      ];
      
      // 如果指定了分类，过滤备用数据
      const filteredFaqs = category 
        ? defaultFAQs.filter(faq => faq.category === category)
        : defaultFAQs;
      
      return NextResponse.json(filteredFaqs, { 
        status: 200,
        headers: { 'X-Data-Source': 'fallback' } 
      });
    }
  } catch (error) {
    console.error('获取FAQ数据时出错:', error);
    return NextResponse.json(
      { error: '获取FAQ数据失败' },
      { status: 500 }
    );
  }
}

// 创建新FAQ
export async function POST(request: Request) {
  try {
    // 解析请求体
    const body = await request.json();
    
    // 提取必要字段
    const { question, answer, category, order } = body;
    
    // 验证必填字段
    if (!question || !answer) {
      return NextResponse.json(
        { error: '问题和答案是必填字段' },
        { status: 400 }
      );
    }
    
    // 创建新FAQ记录
    const newFaq = await prisma.fAQ.create({
      data: {
        question,
        answer,
        category: category || 'general',
        order: order !== undefined ? Number(order) : 0
      }
    });
    
    return NextResponse.json(newFaq, { status: 201 });
  } catch (error) {
    console.error('创建FAQ时出错:', error);
    return NextResponse.json(
      { error: '创建FAQ失败' },
      { status: 500 }
    );
  }
} 