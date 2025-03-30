import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('开始初始化管理员账户...');

    // 检查是否已存在管理员账户
    const adminCount = await prisma.admin.count();
    
    if (adminCount > 0) {
      console.log('已经存在管理员账户，跳过初始化过程');
      return;
    }

    // 创建默认管理员
    const defaultAdmin = await prisma.admin.create({
      data: {
        username: 'admin',
        password: hashSync('admin123', 10), // 在生产环境中应使用更强的密码
        name: '系统管理员',
        email: 'admin@example.com',
        role: 'admin'
      }
    });

    console.log(`成功创建管理员账户: ${defaultAdmin.username}`);
    console.log('请在首次登录后修改默认密码！');

  } catch (error) {
    console.error('初始化管理员账户失败:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('初始化完成');
    process.exit(0);
  })
  .catch((e) => {
    console.error('初始化过程中出错:', e);
    process.exit(1);
  }); 