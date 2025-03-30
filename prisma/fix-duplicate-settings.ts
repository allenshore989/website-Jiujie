// 这是一个用于修复数据库中重复设置项的脚本
// 可以通过 npx ts-node prisma/fix-duplicate-settings.ts 来运行

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('====== 开始修复重复的系统设置 ======');
  
  try {
    // 1. 获取所有设置项
    const allSettings = await prisma.siteSetting.findMany({
      orderBy: {
        key: 'asc'
      }
    });

    console.log(`找到 ${allSettings.length} 个设置项`);
    
    // 2. 查找重复项
    const settingsByKey: Record<string, any[]> = {};
    
    allSettings.forEach(setting => {
      if (!settingsByKey[setting.key]) {
        settingsByKey[setting.key] = [];
      }
      settingsByKey[setting.key].push(setting);
    });
    
    // 3. 处理重复项
    let fixedCount = 0;
    
    for (const key of Object.keys(settingsByKey)) {
      const settings = settingsByKey[key];
      
      if (settings.length > 1) {
        console.log(`发现键 "${key}" 有 ${settings.length} 条重复记录`);
        
        // 找出最新的记录
        const sortedSettings = [...settings].sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        
        // 保留最新的记录，删除其他记录
        const keepSetting = sortedSettings[0];
        const deletionPromises = sortedSettings
          .slice(1)
          .map(setting => prisma.siteSetting.delete({ where: { id: setting.id } }));
        
        const deleteCount = await Promise.all(deletionPromises)
          .then(results => results.length);
        
        console.log(`保留ID为 ${keepSetting.id} 的记录，删除了 ${deleteCount} 条重复记录`);
        fixedCount += deleteCount;
      }
    }
    
    // 4. 总结
    if (fixedCount === 0) {
      console.log('没有发现重复项，数据库设置正常');
    } else {
      console.log(`已修复 ${fixedCount} 条重复设置`);
    }
    
    // 5. 确认最终设置
    const finalSettings = await prisma.siteSetting.findMany({
      orderBy: {
        key: 'asc'
      }
    });
    
    console.log('修复后的设置项:');
    finalSettings.forEach(setting => {
      console.log(`- ${setting.key}: ${setting.value}`);
    });
    
  } catch (error) {
    console.error('修复过程中出错:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
  
  console.log('====== 设置修复完成 ======');
}

// 运行主函数
main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  }); 