"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Carousel from '@/components/Carousel';
import HomeCarousel from '@/components/HomeCarousel';
import { carouselItems } from '@/data/carouselData';

export default function ClientHomePage() {
  return (
    <>
      {/* 主页轮播图区域 */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <HomeCarousel />
        </div>
      </section>
      
      {/* 特色内容精选 */}
      <section className="py-12 bg-neutral">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-mashan text-primary text-center mb-10">
            我们的服务方向
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 mx-auto">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="text-xl font-bold text-center mb-3">住宅风水设计</h3>
              <p className="text-gray-600 text-center">为您的家居空间打造和谐的能量流动，提升生活品质</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 mx-auto">
                <span className="text-2xl">🏢</span>
              </div>
              <h3 className="text-xl font-bold text-center mb-3">商业空间优化</h3>
              <p className="text-gray-600 text-center">针对办公、商铺等空间的风水布局，促进事业发展</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 mx-auto">
                <span className="text-2xl">👤</span>
              </div>
              <h3 className="text-xl font-bold text-center mb-3">个人命理咨询</h3>
              <p className="text-gray-600 text-center">结合个人八字和环境设计，创造个人专属的和谐空间</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* 简介部分 */}
      <section className="py-20 bg-white">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-mashan text-primary mb-8">
              为什么选择易经环境设计？
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              易经是中国古代哲学的精髓，通过理解阴阳五行、八卦等概念，我们能够创造出与自然和谐共生的空间。我们的设计理念融合了这些古老智慧与现代美学，为您的家居或办公空间带来平衡、和谐与活力。
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-6 mt-10">
              <div className="bg-neutral p-6 rounded-lg shadow-md text-center flex-1 hover:shadow-lg transition-shadow">
                <div className="text-5xl text-primary mb-4">15+</div>
                <p className="text-gray-700">多年设计经验</p>
              </div>
              <div className="bg-neutral p-6 rounded-lg shadow-md text-center flex-1 hover:shadow-lg transition-shadow">
                <div className="text-5xl text-primary mb-4">200+</div>
                <p className="text-gray-700">成功案例</p>
              </div>
              <div className="bg-neutral p-6 rounded-lg shadow-md text-center flex-1 hover:shadow-lg transition-shadow">
                <div className="text-5xl text-primary mb-4">98%</div>
                <p className="text-gray-700">客户满意度</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* 案例轮播图 */}
      <section className="py-16 bg-neutral">
        <div className="container max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-mashan text-primary text-center mb-10">
            成功案例展示
          </h2>
          <Carousel items={carouselItems} />
        </div>
      </section>
      
      {/* 特色服务 */}
      <section className="py-20 bg-white">
        <div className="container max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-mashan text-primary text-center mb-16">
            我们的特色服务
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "住宅风水设计",
                description: "根据易经原理，为您的家居环境进行专业规划与布局，创造和谐舒适的生活空间。"
              },
              {
                title: "办公空间优化",
                description: "针对商业与办公场所，提供基于易经原理的空间规划，提升工作效率与员工福祉。"
              },
              {
                title: "环境能量评估",
                description: "对现有环境进行全面的能量场评估，找出不和谐因素并提供专业改善建议。"
              },
              {
                title: "个性化咨询服务",
                description: "根据您的生辰八字和个人需求，提供量身定制的环境设计与调整方案。"
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="bg-neutral p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
              >
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl text-primary">✦</span>
                </div>
                <h3 className="text-xl font-bold text-primary mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 专家团队 */}
      <section className="py-20 bg-neutral">
        <div className="container max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-mashan text-primary text-center mb-16">
            我们的专家团队
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "张大师",
                title: "首席设计师",
                description: "20年易经环境设计经验，专注于商业空间的风水布局优化。"
              },
              {
                name: "李教授",
                title: "易经学术顾问",
                description: "国内知名易学专家，著有《现代空间与易经》等多部著作。"
              },
              {
                name: "王设计师",
                title: "室内空间设计师",
                description: "将现代设计理念与传统风水学巧妙结合，打造美观与实用兼备的空间。"
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl text-primary">👤</span>
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">
                  {item.name}
                </h3>
                <p className="text-primary/80 mb-4">{item.title}</p>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 联系我们 */}
      <section className="py-20 bg-gradient-to-br from-primary/90 via-primary/80 to-accent/80 relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-pattern-yijing opacity-30"></div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        <div className="container max-w-5xl mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-mashan mb-8">
              开启和谐空间之旅
            </h2>
            <p className="text-lg mb-10">
              无论您需要家居风水调整、办公空间规划还是商业店铺布局，我们都能为您提供专业的易经环境设计解决方案。立即联系我们，开启和谐空间之旅。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="bg-white text-primary hover:bg-neutral transition-colors px-8 py-3 rounded-md text-lg inline-block"
              >
                预约咨询
              </Link>
              <Link 
                href="/admin-entry" 
                className="bg-transparent border border-white text-white hover:bg-white/10 transition-colors px-8 py-3 rounded-md text-lg inline-block"
              >
                管理入口
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}