// 这是一个用于生成初始数据的种子脚本
// 可以通过 npx ts-node prisma/seed.ts 来运行

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 清理现有数据
  // 注意：在真实环境中，您可能不想这样做
  await prisma.contactMessage.deleteMany({});
  await prisma.branchOffice.deleteMany({});
  await prisma.fAQ.deleteMany({});
  await prisma.siteSetting.deleteMany({});

  // 创建示例联系表单消息
  const sampleMessage = await prisma.contactMessage.create({
    data: {
      name: '张三',
      email: 'zhangsan@example.com',
      phone: '13812345678',
      service: '住宅环境设计',
      content: '我最近买了一套新房，想请贵公司帮忙设计一下风水布局，可以提供线上咨询服务吗？',
      status: 'PENDING'
    }
  });
  
  console.log('Created sample contact message with ID:', sampleMessage.id);

  // 创建示例分支机构
  const sampleBranches = await Promise.all([
    prisma.branchOffice.create({
      data: {
        city: '北京总部',
        address: '朝阳区建国路88号',
        phone: '010-12345678',
        email: 'beijing@yijingdesign.cn'
      }
    }),
    prisma.branchOffice.create({
      data: {
        city: '上海分部',
        address: '浦东新区陆家嘴金融中心',
        phone: '021-87654321',
        email: 'shanghai@yijingdesign.cn'
      }
    }),
    prisma.branchOffice.create({
      data: {
        city: '广州分部',
        address: '天河区珠江新城',
        phone: '020-56781234',
        email: 'guangzhou@yijingdesign.cn'
      }
    }),
    prisma.branchOffice.create({
      data: {
        city: '成都分部',
        address: '锦江区红星路',
        phone: '028-98765432',
        email: 'chengdu@yijingdesign.cn'
      }
    })
  ]);
  
  console.log('Created sample branches:', sampleBranches.length);

  // 创建示例FAQ
  const sampleFAQs = await Promise.all([
    prisma.fAQ.create({
      data: {
        question: '易经环境设计服务流程是怎样的？',
        answer: '我们的服务流程通常包括：初步咨询、现场勘察、方案设计、实施指导和后续跟进。整个过程中，我们会与客户保持密切沟通，确保设计方案符合客户期望并取得实际效果。',
        category: 'service',
        order: 1
      }
    }),
    prisma.fAQ.create({
      data: {
        question: '需要亲自到现场勘察吗，还是可以远程提供服务？',
        answer: '我们推荐现场勘察以获取最准确的环境信息，但也提供远程咨询服务。远程服务需要客户提供详细的空间图片、平面图和相关信息，我们会基于这些资料提供专业建议。',
        category: 'service',
        order: 2
      }
    }),
    prisma.fAQ.create({
      data: {
        question: '改变住宅或办公空间的风水需要大规模装修吗？',
        answer: '不一定。很多风水优化可以通过调整家具布局、更换装饰品、添加特定元素等小改动实现。我们会根据具体情况提供最经济实用的方案，尽量避免不必要的大规模装修。',
        category: 'implementation',
        order: 3
      }
    }),
    prisma.fAQ.create({
      data: {
        question: '服务费用是如何计算的？',
        answer: '我们的服务费用根据项目类型、空间大小和服务内容有所不同。一般包括咨询费、方案设计费和实施指导费。您可以联系我们获取详细的报价单。',
        category: 'pricing',
        order: 4
      }
    }),
    prisma.fAQ.create({
      data: {
        question: '易经风水设计与普通室内设计有什么区别？',
        answer: '易经风水设计在注重美观和功能性的同时，更关注空间的能量流动、五行平衡和对居住者的影响。我们会根据易经原理和客户个人的生辰八字，设计更加和谐、平衡的生活或工作环境。',
        category: 'concept',
        order: 5
      }
    })
  ]);
  
  console.log('Created sample FAQs:', sampleFAQs.length);

  // 创建系统设置
  const systemSettings = await Promise.all([
    prisma.siteSetting.create({
      data: {
        key: 'siteName',
        value: '易经环境设计'
      }
    }),
    prisma.siteSetting.create({
      data: {
        key: 'contactEmail',
        value: 'contact@yijingdesign.cn'
      }
    }),
    prisma.siteSetting.create({
      data: {
        key: 'phoneNumber',
        value: '010-12345678'
      }
    }),
    prisma.siteSetting.create({
      data: {
        key: 'address',
        value: '北京市朝阳区建国路88号'
      }
    }),
    prisma.siteSetting.create({
      data: {
        key: 'icp',
        value: '京ICP备XXXXXXXX号'
      }
    })
  ]);
  
  console.log('Created system settings:', systemSettings.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 