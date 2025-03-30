import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// 创建Prisma客户端实例
const prisma = new PrismaClient();

// 清理重复的系统设置
export async function POST() {
  try {
    // 1. 获取所有设置项
    const allSettings = await prisma.siteSetting.findMany({
      orderBy: {
        updatedAt: 'desc' // 按更新时间降序，确保最新的在前面
      }
    });

    console.log(`找到 ${allSettings.length} 个设置项，开始检查是否有重复`);
    
    // 2. 分组和查找重复项
    const settingsByKey: Record<string, any[]> = {};
    let totalDuplicates = 0;
    
    // 按key分组
    allSettings.forEach(setting => {
      if (!settingsByKey[setting.key]) {
        settingsByKey[setting.key] = [];
      }
      settingsByKey[setting.key].push(setting);
    });
    
    // 3. 删除重复项
    const deletionPromises = [];
    const duplicateDetails = [];
    
    for (const key of Object.keys(settingsByKey)) {
      const settings = settingsByKey[key];
      
      if (settings.length > 1) {
        console.log(`发现键 "${key}" 有 ${settings.length} 条重复记录`);
        totalDuplicates += settings.length - 1;
        
        // 保留最新的记录，删除其他记录
        const [keepSetting, ...duplicateSettings] = settings;
        
        // 记录保留的设置和重复设置
        duplicateDetails.push({
          key,
          duplicateCount: duplicateSettings.length,
          keptId: keepSetting.id,
          keptValue: keepSetting.value,
          deletedIds: duplicateSettings.map(s => s.id)
        });
        
        // 删除重复记录
        for (const duplicate of duplicateSettings) {
          deletionPromises.push(
            prisma.siteSetting.delete({ where: { id: duplicate.id } })
          );
        }
      }
    }
    
    // 4. 执行删除操作
    if (deletionPromises.length > 0) {
      const deleteResult = await Promise.all(deletionPromises);
      console.log(`已删除 ${deleteResult.length} 条重复记录`);
      
      return NextResponse.json({
        success: true,
        message: `已清理 ${deleteResult.length} 条重复设置`,
        duplicates: duplicateDetails
      }, { status: 200 });
    } else {
      console.log('没有发现重复设置');
      
      return NextResponse.json({
        success: true,
        message: '没有发现重复设置',
        duplicates: []
      }, { status: 200 });
    }
  } catch (error) {
    console.error('清理重复设置时出错:', error);
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    
    return NextResponse.json(
      { error: `清理重复设置失败: ${errorMessage}` },
      { status: 500 }
    );
  }
} 