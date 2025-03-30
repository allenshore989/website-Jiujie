import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

// 动态导入客户端组件
const PageBanner = dynamic(() => import('@/components/PageBanner'), { ssr: false });
const ImageFallback = dynamic(() => import('@/components/ImageFallback'), { ssr: false });

export const metadata: Metadata = {
  title: '设计案例 | 易经环境设计',
  description: '探索我们如何运用易经原理为居住和工作空间带来和谐与平衡，提升生活品质和事业发展。',
};

export default function CasesPage() {
  // 案例分类数据
  const categories = [
    { id: 'all', name: '全部案例' },
    { id: 'residential', name: '住宅设计' },
    { id: 'office', name: '办公空间' },
    { id: 'commercial', name: '商业店铺' },
    { id: 'cultural', name: '文化空间' }
  ];

  // 案例数据
  const caseStudies = [
    {
      id: 1,
      title: '北京某科技公司办公空间',
      description: '针对这家科技创新公司，我们运用易经五行理论，优化了办公布局和能量流动，重点调整了创意区域的五行元素分布，实现水火平衡，增强团队创造力。项目完成后，团队协作效率提升30%，员工满意度大幅增加。',
      category: 'office',
      image: '/images/article-featured-1.jpg',
      results: ['员工工作效率提升30%', '团队创新能力增强', '办公环境满意度提高45%'],
      features: ['工位布局优化', '会议空间能量调整', '创意区域五行平衡设计']
    },
    {
      id: 2,
      title: '上海豪宅私人定制',
      description: '基于业主夫妇的生辰八字分析，我们为这处豪宅设计了完整的风水布局方案。调整了主卧室的朝向，优化了客厅的财位设置，并针对儿童房进行了特别的学习运势加持。业主反馈家庭关系更加和谐，事业财运也有显著提升。',
      category: 'residential',
      image: '/images/article-featured-2.jpg',
      results: ['家庭和谐度明显提升', '业主工作效率增加', '孩子学习成绩提高'],
      features: ['主卧方位与五行调整', '客厅财位优化设计', '儿童房学习运势布局']
    },
    {
      id: 3,
      title: '成都某茶馆空间设计',
      description: '结合四川茶文化与易经八卦理念，为这家传统茶馆打造了独特的空间体验。我们运用太极阴阳平衡原理，设计了环形布局，优化了水电位置，调整了座位朝向，并精心选择了装饰元素。开业后客流量持续增长，已成为当地文化交流热点。',
      category: 'cultural',
      image: '/images/articles/yin-yang.jpg',
      results: ['日均客流量超预期40%', '顾客平均停留时间延长', '成为本地文化地标'],
      features: ['太极环形空间布局', '阴阳平衡水火设计', '传统文化元素融入']
    },
    {
      id: 4,
      title: '广州某购物中心商铺',
      description: '为这家处于购物中心的零售店进行了全面的风水优化。重新调整了店铺入口的能量流向，优化了商品陈列的五行布局，重点加强了财位区域的设计。改造后，顾客转化率提高35%，商品销售额增长40%。',
      category: 'commercial',
      image: '/images/articles/office-design.jpg',
      results: ['客户转化率提升35%', '日均销售额增长40%', '顾客好评率提高'],
      features: ['入口气场优化设计', '商品陈列五行布局', '财位区域特别强化']
    },
    {
      id: 5,
      title: '杭州湖景别墅设计',
      description: '这座湖景别墅采用了结合自然环境的风水设计理念。我们充分利用了临水的优势，加强了财运水流向，优化了主人房的位置和朝向，并针对家庭成员的八字特点进行了个性化设计。业主表示家庭氛围更加和谐，事业发展也更加顺利。',
      category: 'residential',
      image: '/images/articles/bedroom-sleep.jpg',
      results: ['家庭和谐指数提升', '业主事业有新突破', '居住舒适度大幅提高'],
      features: ['依山傍水格局优化', '主人房个性化设计', '家庭成员八字匹配调整']
    },
    {
      id: 6,
      title: '深圳金融公司办公室',
      description: '针对这家金融公司的特点，我们设计了强调稳定与增长的办公环境。重点优化了交易区域的能量流动，调整了会议室的谈判氛围，并为高管区域创造了专注与决策的有利环境。公司业绩在改造后的两个季度内持续增长。',
      category: 'office',
      image: '/images/articles/business-space.jpg',
      results: ['公司业绩连续两季度增长', '团队稳定性增强', '重要客户签约率提高'],
      features: ['交易区域能量优化', '会议谈判环境设计', '高管区域决策氛围营造']
    }
  ];

  return (
    <div className="min-h-screen pt-4">
      {/* 使用PageBanner组件代替原有横幅 */}
      <PageBanner 
        title="成功案例" 
        subtitle="多年来的精选项目展示，见证我们的专业实力" 
      />

      {/* 案例展示 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {/* 分类筛选 */}
          <div className="flex flex-wrap justify-center mb-12 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                className="px-6 py-2 rounded-full bg-neutral hover:bg-primary hover:text-white transition-colors text-primary"
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* 案例列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.map((caseItem) => (
              <div key={caseItem.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative h-60">
                  <ImageFallback
                    src={caseItem.image}
                    alt={caseItem.title}
                    fill
                    className="object-cover"
                    fallbackSrc="/images/placeholder.jpg"
                  />
                  <div className="absolute top-4 right-4 bg-primary text-white text-sm px-3 py-1 rounded-md shadow-sm">
                    {categories.find(cat => cat.id === caseItem.category)?.name}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-3">{caseItem.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{caseItem.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-gray-700 mb-2">项目亮点</h4>
                    <ul className="text-sm text-gray-600">
                      {caseItem.features.map((feature, index) => (
                        <li key={index} className="flex items-start mb-1">
                          <span className="text-primary mr-2">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-gray-700 mb-2">项目成效</h4>
                    <ul className="text-sm text-gray-600">
                      {caseItem.results.map((result, index) => (
                        <li key={index} className="flex items-start mb-1">
                          <span className="text-primary mr-2">✓</span>
                          <span>{result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button className="mt-2 inline-flex items-center text-primary hover:underline">
                    查看详情
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 案例统计 */}
      <section className="py-16 bg-neutral">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl font-bold text-primary mb-2">200+</div>
              <p className="text-gray-600">成功项目</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl font-bold text-primary mb-2">15+</div>
              <p className="text-gray-600">服务年限</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl font-bold text-primary mb-2">98%</div>
              <p className="text-gray-600">客户满意度</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl font-bold text-primary mb-2">30+</div>
              <p className="text-gray-600">服务城市</p>
            </div>
          </div>
        </div>
      </section>

      {/* 客户评价 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-mashan text-primary text-center mb-16">客户评价</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: '王总',
                company: '某科技公司CEO',
                avatar: '👨‍💼',
                content: '我们公司在易经环境设计团队的帮助下，办公空间焕然一新。员工们普遍反映工作环境更舒适了，团队协作也更加高效。最令人惊喜的是，公司业绩在调整后有了明显提升！'
              },
              {
                name: '李女士',
                company: '上海别墅业主',
                avatar: '👩',
                content: '作为一个对风水持半信半疑态度的人，我对易经环境设计的专业性和科学性印象深刻。他们不仅考虑了风水因素，还将现代设计美学完美融入。现在我们家不仅看起来更美了，居住感受也更加舒适和谐。'
              },
              {
                name: '张老板',
                company: '连锁餐饮创始人',
                avatar: '🧑‍🍳',
                content: '我们的三家门店在风水调整后，客流量和营业额都有显著增长。特别是原来生意较差的那家店，调整后竟然成了表现最好的门店！易经环境设计团队专业、严谨且富有创意，强烈推荐！'
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-neutral p-8 rounded-lg shadow-md relative">
                <div className="absolute top-0 left-6 transform -translate-y-1/2 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <p className="text-gray-600 italic mb-6 mt-4">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div>
                    <p className="font-bold text-primary">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 项目咨询 */}
      <section className="py-20 bg-gradient-to-br from-primary/90 via-primary/80 to-accent/80 relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-pattern-yijing opacity-30"></div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-mashan mb-8">
              想了解您的空间潜力？
            </h2>
            <p className="text-lg mb-10">
              无论是家居住宅、办公空间还是商业店铺，我们都能为您提供专业的易经环境设计方案。
              联系我们，开启您的和谐空间之旅。
            </p>
            <Link 
              href="/contact" 
              className="bg-white text-primary hover:bg-neutral transition-colors px-8 py-3 rounded-md text-lg inline-block"
            >
              免费咨询
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 