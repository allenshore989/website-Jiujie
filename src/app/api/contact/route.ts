import { NextResponse } from 'next/server';

// 定义联系信息数据类型
interface ContactInfo {
  address: string;
  phone: string;
  customerService: string;
  email: string;
  businessEmail: string;
  workingHours: string;
  socialMedia: {
    weixin: string;
    weibo: string;
    xiaohongshu: string;
  }
}

// 联系信息数据 (在实际应用中，这些数据可能来自数据库)
const contactInfo: ContactInfo = {
  address: '北京市朝阳区建国路88号',
  phone: '010-12345678',
  customerService: '400-888-9999',
  email: 'contact@yijingdesign.cn',
  businessEmail: 'business@yijingdesign.cn',
  workingHours: '周一至周五: 9:00 - 18:00\n周六: 10:00 - 16:00\n周日: 休息',
  socialMedia: {
    weixin: 'https://weixin.example.com/yijingdesign',
    weibo: 'https://weibo.com/yijingdesign',
    xiaohongshu: 'https://xiaohongshu.com/yijingdesign'
  }
};

// GET 处理程序，返回联系信息
export async function GET() {
  try {
    // 在实际应用中，可以从数据库获取数据
    // 这里简单返回上面定义的静态数据
    return NextResponse.json(contactInfo, { status: 200 });
  } catch (error) {
    console.error('获取联系信息时出错:', error);
    return NextResponse.json(
      { error: '获取联系信息失败' },
      { status: 500 }
    );
  }
} 