import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // 清除认证令牌
    cookies().delete('auth-token');
    
    return NextResponse.json({
      success: true,
      message: '成功注销'
    });
  } catch (error) {
    console.error('注销错误:', error);
    return NextResponse.json(
      { error: '注销过程中发生错误' },
      { status: 500 }
    );
  }
} 