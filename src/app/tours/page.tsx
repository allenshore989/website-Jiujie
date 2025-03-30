import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

// 动态导入客户端组件
const PageBanner = dynamic(() => import('@/components/PageBanner'), { ssr: false });

export const metadata: Metadata = {
  // ... existing code ...
};

export default function ToursPage() {
  // 游学线路数据
  const tours = [
    {
      id: 1,
      title: '易经发源地寻根之旅',
      location: '河南 • 周口 • 鹿邑',
      duration: '4天3晚',
      price: '¥4,980/人',
      image: '/images/articles/yin-yang.jpg',
      highlights: [
        '参观老子故里，探寻《道德经》与易经的渊源关系',
        '拜访周文王故居，了解《周易》的编纂历史',
        '体验传统易学文化活动，亲手制作六爻筮卦',
        '聆听易经专家讲座，深入解读八卦与现代生活'
      ],
      description: '这条线路带您探访易经文化的发源地，追溯五千年前的哲学智慧，体验中华文明的源远流长。'
    },
    {
      id: 2,
      title: '皇家风水探秘之旅',
      location: '北京 • 故宫 • 颐和园',
      duration: '3天2晚',
      price: '¥3,680/人',
      image: '/images/articles/office-design.jpg',
      highlights: [
        '专家讲解故宫布局背后的易经阴阳五行原理',
        '解析紫禁城建筑风水设计与帝王命数的关系',
        '探索颐和园园林设计中的易学哲学思想',
        '亲身体验传统堪舆术，学习基础环境观察方法'
      ],
      description: '深入了解中国古代皇家建筑中的风水智慧，探索故宫和颐和园等建筑背后的易经哲学。'
    },
    {
      id: 3,
      title: '江南水乡风水文化游',
      location: '苏州 • 杭州 • 周庄',
      duration: '5天4晚',
      price: '¥5,280/人',
      image: '/images/articles/bedroom-sleep.jpg',
      highlights: [
        '探访苏州园林，解析其中的阴阳平衡设计理念',
        '考察杭州西湖周边古建筑的风水布局',
        '体验周庄水乡民居的传统空间规划智慧',
        '参与江南风水文化工作坊，学习实用家居布局技巧'
      ],
      description: '在江南水乡的温婉景色中，感受中国传统民居风水文化的魅力，体验水与生活的和谐之美。'
    },
    {
      id: 4,
      title: '道教名山易学探索',
      location: '四川 • 青城山 • 都江堰',
      duration: '4天3晚',
      price: '¥4,580/人',
      image: '/images/articles/energy-assessment.jpg',
      highlights: [
        '拜访青城山道教胜地，了解易经与道教的关系',
        '解析都江堰水利工程中的阴阳五行思想',
        '参与道家养生工作坊，体验易经思想在健康中的应用',
        '向道学专家学习易经冥想与身心平衡技巧'
      ],
      description: '在道教名山中探索易经与道家思想的关系，体验易学智慧在身心健康中的应用。'
    }
  ];

  // 讲师团队数据
  const instructors = [
    {
      name: '王教授',
      title: '易经文化学者',
      description: '北京大学哲学系教授，研究易经文化30余年，著有《易经与现代生活》等多部著作。',
      avatar: '👨‍🏫'
    },
    {
      name: '李老师',
      title: '风水实践专家',
      description: '资深环境设计师，将传统风水理论与现代建筑设计结合，有20年实践经验。',
      avatar: '👨‍🔬'
    },
    {
      name: '张大师',
      title: '道家文化传承人',
      description: '青城山道教协会会长，精通易经与道家文化，致力于传统文化的现代传承。',
      avatar: '🧙‍♂️'
    }
  ];

  return (
    <div className="min-h-screen pt-4">
      {/* 使用PageBanner组件代替原有横幅 */}
      <PageBanner 
        title="环境能量之旅" 
        subtitle="探索空间能量与人居环境的奥秘" 
      />

      {/* 活动内容 */}
      {/* 游学介绍 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-mashan text-primary mb-6">易经文化游学体验</h2>
            <p className="text-gray-700">
              易经环境设计推出的文化游学项目，旨在带领学员探访易经文化的发源地和经典案例，
              深入体验易经智慧在环境设计中的应用，感受中华传统文化的博大精深。
              每条线路都由资深易经专家全程讲解，让您在旅行中学习，在实践中领悟。
            </p>
          </div>

          {/* 游学特色 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <div className="bg-neutral p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-primary">🧠</span>
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">专业知识讲解</h3>
              <p className="text-gray-600">资深易经专家全程讲解，深入浅出地阐释易经智慧</p>
            </div>
            
            <div className="bg-neutral p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-primary">👐</span>
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">实践体验活动</h3>
              <p className="text-gray-600">亲身参与易经文化实践活动，体验传统智慧的魅力</p>
            </div>
            
            <div className="bg-neutral p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-primary">🏞️</span>
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">经典案例考察</h3>
              <p className="text-gray-600">实地考察风水经典案例，学习传统与现代的结合</p>
            </div>
            
            <div className="bg-neutral p-6 rounded-lg text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-primary">🤝</span>
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">小班精品服务</h3>
              <p className="text-gray-600">每团限15人，确保高质量的学习体验和充分交流</p>
            </div>
          </div>

          {/* 游学路线 */}
          <h2 className="text-3xl font-mashan text-primary text-center mb-12">精选游学路线</h2>
          
          <div className="space-y-12">
            {tours.map((tour) => (
              <div key={tour.id} className="bg-neutral rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="grid grid-cols-1 lg:grid-cols-3">
                  <div className="relative h-64 lg:h-auto">
                    <Image
                      src={tour.image}
                      alt={tour.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="col-span-2 p-8">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-primary mb-2">{tour.title}</h3>
                        <p className="text-gray-600">{tour.location} | {tour.duration}</p>
                      </div>
                      <div className="mt-2 md:mt-0 text-xl font-bold text-primary">{tour.price}</div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{tour.description}</p>
                    
                    <h4 className="text-lg font-bold text-primary mb-3">行程亮点</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                      {tour.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-primary mr-2">✓</span>
                          <span className="text-gray-600">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="flex justify-end">
                      <button className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors">
                        查看详情
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 讲师团队 */}
      <section className="py-20 bg-neutral">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-mashan text-primary text-center mb-16">专业讲师团队</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {instructors.map((instructor, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="h-48 bg-primary/10 flex items-center justify-center">
                  <span className="text-6xl">{instructor.avatar}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-1">{instructor.name}</h3>
                  <p className="text-primary/70 mb-4">{instructor.title}</p>
                  <p className="text-gray-600">{instructor.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 游学体验分享 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-mashan text-primary text-center mb-16">学员体验分享</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: '张先生',
                tour: '易经发源地寻根之旅',
                content: '通过这次游学，我对易经的理解有了质的飞跃。在实地考察中，那些抽象的概念变得具体可感，专家的讲解也非常深入浅出。回来后，我对家居环境做了一些调整，效果非常好。'
              },
              {
                name: '李女士',
                tour: '皇家风水探秘之旅',
                content: '作为一名室内设计师，这次游学给了我很多灵感。了解到古代建筑中蕴含的易经智慧，让我在现代设计中也能融入这些元素。小班制的安排也让我有充分的机会与专家交流。'
              },
              {
                name: '王教授',
                tour: '江南水乡风水文化游',
                content: '非常专业的文化游学活动，不同于一般的旅游，每个景点都有深度解读，每天还有系统的易经知识讲座。江南水乡的环境本身就是最好的教材，实地感受水与建筑的和谐关系。'
              },
              {
                name: '赵总',
                tour: '道教名山易学探索',
                content: '这次游学让我对易经与健康的关系有了新的认识。青城山的道家养生工作坊特别有收获，学到了很多实用的养生技巧。而且团队服务非常贴心，住宿餐饮都很有当地特色。'
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-neutral p-8 rounded-lg shadow-md">
                <div className="flex items-start mb-4">
                  <span className="text-4xl text-primary/20 mr-4">"</span>
                  <p className="text-gray-700 italic">{testimonial.content}</p>
                </div>
                <div className="flex justify-end">
                  <div className="text-right">
                    <p className="font-bold text-primary">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">参与{testimonial.tour}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 常见问题 */}
      <section className="py-20 bg-neutral">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-mashan text-primary text-center mb-16">常见问题</h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: '文化游学活动适合什么人参加？',
                answer: '我们的游学活动适合对易经、风水、传统文化感兴趣的各类人士，包括设计师、建筑师、企业管理者、文化爱好者等。不需要专业背景，我们会从基础讲起。'
              },
              {
                question: '每个团的人数有多少？',
                answer: '为了保证学习质量和体验效果，我们的每个游学团限制在15人以内，确保每位学员都能得到充分的指导和交流机会。'
              },
              {
                question: '费用包含哪些内容？',
                answer: '费用通常包含全程住宿、餐饮、交通、景点门票、专家讲解费、工作坊材料费等。具体每条线路可能略有不同，详情请查看具体行程安排。'
              },
              {
                question: '需要提前准备什么？',
                answer: '建议您带上舒适的鞋子和衣物，相机，笔记本等。如有特殊行程需要特别准备的物品，我们会提前通知。对易经基础知识有简单了解会更有助于学习，但不是必须的。'
              },
              {
                question: '如何报名参加游学活动？',
                answer: '您可以通过网站报名表格、电话或邮件联系我们进行报名。确认报名后需支付定金，我们会为您安排后续事宜并发送详细行程安排。'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg">
                <h3 className="text-lg font-bold text-primary mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 报名信息 */}
      <section className="py-20 bg-gradient-to-br from-primary/90 via-primary/80 to-accent/80 relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-pattern-yijing opacity-30"></div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-mashan mb-8">
              预约下一期游学活动
            </h2>
            <p className="text-lg mb-10">
              我们定期组织各类易经文化游学活动，欢迎您提前报名预约。
              可致电400-888-9999或填写在线表单，我们的客服人员将为您提供详细信息。
            </p>
            <Link 
              href="/contact" 
              className="bg-white text-primary hover:bg-neutral transition-colors px-8 py-3 rounded-md text-lg inline-block"
            >
              预约咨询
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 