"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

// 动态导入客户端组件
const PageBanner = dynamic(() => import('@/components/PageBanner'), { ssr: false });
const ImageFallback = dynamic(() => import('@/components/ImageFallback'), { ssr: false });

// 元数据已移到metadata.ts文件中
// export const metadata: Metadata = {
//   title: '服务项目 | 易文化研究与环境能量设计',
//   description: '探索环境能量设计师提供的风水设计、空间能量优化和个人咨询服务',
// };

export default function ServicesPage() {
  // 服务内容数据
  const services = [
    {
      id: 1,
      title: '住宅风水设计',
      description: '根据易经五行理论和业主生辰八字，为住宅提供全方位的风水布局优化方案。',
      icon: '🏠',
      features: [
        '户型布局与功能区规划',
        '睡眠区域的能量平衡',
        '厨卫空间的五行调和',
        '客厅风水布局优化',
        '居家装饰与色彩搭配建议'
      ],
      image: '/images/article-featured-1.jpg'
    },
    {
      id: 2,
      title: '办公空间优化',
      description: '为企业办公环境提供基于易经原理的空间规划，营造积极向上的工作氛围。',
      icon: '🏢',
      features: [
        '办公区域能量场评估',
        '工位布局与朝向设计',
        '会议空间能量优化',
        '企业前台与接待区设计',
        '办公室色彩与装饰方案'
      ],
      image: '/images/article-featured-2.jpg'
    },
    {
      id: 3,
      title: '商业店铺风水',
      description: '针对零售、餐饮等商业空间，提供财位规划和客流引导的专业风水方案。',
      icon: '🏪',
      features: [
        '店面选址与朝向评估',
        '商业财位规划与布局',
        '客流动线优化设计',
        '橱窗与展示区规划',
        '品牌形象与空间氛围塑造'
      ],
      image: '/images/article-featured-1.jpg'
    },
    {
      id: 4,
      title: '环境能量评估',
      description: '对现有环境进行专业的能量场评估，发现潜在的不和谐因素并提供改善建议。',
      icon: '⚡',
      features: [
        '空间能量场全面检测',
        '阴阳平衡度评估',
        '五行相生相克分析',
        '空间不和谐因素排查',
        '个性化改善方案制定'
      ],
      image: '/images/article-featured-2.jpg'
    },
    {
      id: 5,
      title: '个人八字分析',
      description: '通过分析个人生辰八字，了解先天五行特性，为环境设计提供个性化依据。',
      icon: '📊',
      features: [
        '个人八字五行分析',
        '先天命盘解读',
        '事业财运发展建议',
        '适宜居住环境分析',
        '个人色彩与方位建议'
      ],
      image: '/images/article-featured-1.jpg'
    },
    {
      id: 6,
      title: '风水文化培训',
      description: '为企业团队或个人提供易经风水知识培训，传授实用的环境优化技巧。',
      icon: '🎓',
      features: [
        '易经基础知识讲解',
        '风水实用技巧培训',
        '办公环境自我调整方法',
        '居家风水入门课程',
        '企业团队定制培训'
      ],
      image: '/images/article-featured-2.jpg'
    }
  ];

  // 咨询流程
  const consultingProcess = [
    {
      title: '需求沟通',
      description: '了解客户的具体需求、问题和期望，收集相关的空间信息和个人资料。',
      icon: '📝'
    },
    {
      title: '专业评估',
      description: '对环境进行实地考察或远程评估，分析现有空间的能量布局和潜在问题。',
      icon: '🔍'
    },
    {
      title: '方案设计',
      description: '基于评估结果和易经原理，制定个性化的环境优化方案和具体实施建议。',
      icon: '📐'
    },
    {
      title: '落地实施',
      description: '指导客户执行优化方案，调整空间布局和装饰元素，平衡环境能量。',
      icon: '🛠️'
    },
    {
      title: '效果反馈',
      description: '方案实施后跟进回访，了解效果反馈，必要时进行进一步的调整和优化。',
      icon: '🔄'
    }
  ];

  return (
    <div className="min-h-screen pt-4">
      {/* 使用PageBanner组件代替原有横幅 */}
      <PageBanner 
        title="我们的服务" 
        subtitle="全方位易经环境设计服务，满足您的各种需求" 
        patternIndex={4}
      />

      {/* 服务介绍 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-mashan text-primary mb-6">我们能为您做什么</h2>
            <p className="text-gray-700">
              易经环境设计致力于将传统易经智慧与现代空间设计相结合，为客户提供专业的环境优化解决方案。
              无论是居家环境、办公空间还是商业店铺，我们都能为您打造平衡和谐、促进财运与健康的理想空间。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {services.map((service) => (
              <div key={service.id} className="bg-neutral rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white">{service.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 咨询流程 */}
      <section className="py-20 bg-neutral">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-mashan text-primary mb-6">服务流程</h2>
            <p className="text-gray-700">
              我们提供系统化、专业化的服务流程，确保每一位客户都能得到最适合自己的环境优化方案，
              从初步咨询到最终实施，全程提供专业指导。
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* 流程线 */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/20 hidden md:block"></div>
              
              <div className="space-y-12">
                {consultingProcess.map((step, index) => (
                  <div key={index} className="relative">
                    {/* 流程点 */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center z-10 hidden md:flex">
                      {index + 1}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                      <div className={`bg-white p-6 rounded-lg shadow-md ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:order-last md:pl-12'}`}>
                        <div className="text-3xl text-primary mb-3">{step.icon}</div>
                        <h3 className="text-xl font-bold text-primary mb-2">{step.title}</h3>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                      <div></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 服务优势 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-mashan text-primary mb-6">我们的优势</h2>
            <p className="text-gray-700">
              易经环境设计凭借多年行业经验和专业团队，为客户提供科学、系统、有效的易经环境优化方案。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start bg-neutral p-6 rounded-lg">
              <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center shrink-0 mr-4">
                <span className="text-2xl text-primary">💼</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary mb-2">丰富的行业经验</h3>
                <p className="text-gray-600">
                  我们的团队拥有15年以上的易经环境设计经验，服务过200多家企业和500多位个人客户，
                  积累了丰富的实战经验和成功案例。
                </p>
              </div>
            </div>
            
            <div className="flex items-start bg-neutral p-6 rounded-lg">
              <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center shrink-0 mr-4">
                <span className="text-2xl text-primary">🔍</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary mb-2">专业评估方法</h3>
                <p className="text-gray-600">
                  我们采用科学的评估体系，结合传统易经理论和现代空间设计原则，进行全面、系统的环境分析。
                </p>
              </div>
            </div>
            
            <div className="flex items-start bg-neutral p-6 rounded-lg">
              <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center shrink-0 mr-4">
                <span className="text-2xl text-primary">🎨</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary mb-2">美学与实用并重</h3>
                <p className="text-gray-600">
                  我们的设计方案不仅注重风水原理，也兼顾现代审美和实用功能，让空间既和谐又美观实用。
                </p>
              </div>
            </div>
            
            <div className="flex items-start bg-neutral p-6 rounded-lg">
              <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center shrink-0 mr-4">
                <span className="text-2xl text-primary">👤</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary mb-2">个性化定制服务</h3>
                <p className="text-gray-600">
                  我们深入了解每位客户的具体需求和个人特点，提供完全个性化的定制方案，而非千篇一律的模板。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 服务案例展示 */}
      <section className="py-20 bg-neutral">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-mashan text-primary mb-6">成功案例</h2>
            <p className="text-gray-700">
              以下是我们近期完成的部分项目案例，展示了易经环境设计在不同类型空间中的实际应用。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: '北京某科技公司办公室',
                category: '办公空间',
                image: '/images/article-featured-1.jpg',
                description: '通过调整工位布局和五行元素平衡，提升团队协作效率和创造力。'
              },
              {
                title: '上海豪宅设计项目',
                category: '住宅设计',
                image: '/images/article-featured-2.jpg',
                description: '根据业主八字和家庭成员需求，打造和谐、富贵、健康的居住空间。'
              },
              {
                title: '广州某购物中心商铺',
                category: '商业空间',
                image: '/images/articles/yin-yang.jpg',
                description: '优化店铺能量流动和财位布局，客流量提升40%，营业额增长35%。'
              }
            ].map((project, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="relative h-48">
                  <ImageFallback
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    fallbackSrc="/images/placeholder.jpg"
                  />
                  <div className="absolute top-3 right-3 bg-primary text-white text-sm px-3 py-1 rounded">
                    {project.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <Link 
                    href="/cases" 
                    className="inline-flex items-center text-primary hover:underline"
                  >
                    查看详情
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/cases" 
              className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
            >
              查看更多案例
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 服务预约 */}
      <section className="py-20 bg-gradient-to-br from-primary/90 via-primary/80 to-accent/80 relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-pattern-yijing opacity-30"></div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-mashan mb-8">
              开启您的和谐空间之旅
            </h2>
            <p className="text-lg mb-10">
              无论您需要家居风水调整、办公空间规划还是商业店铺布局，我们都能为您提供专业的易经环境设计解决方案。填写预约表单，我们的专家将尽快与您联系。
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