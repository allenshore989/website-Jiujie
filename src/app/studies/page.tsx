import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

// 动态导入客户端组件
const PageBanner = dynamic(() => import('@/components/PageBanner'), { ssr: false });

export const metadata: Metadata = {
  title: '易经研究 | 易文化研究与环境能量设计',
  description: '探索易经智慧及其在现代环境能量设计中的应用研究',
};

export default function StudiesPage() {
  return (
    <div className="min-h-screen pt-4">
      {/* 使用PageBanner组件代替原有横幅 */}
      <PageBanner 
        title="易经研究" 
        subtitle="探索古老易经智慧在现代环境设计中的应用" 
      />

      {/* 易经简介 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="chinese-title text-3xl text-[var(--primary)] mb-6 text-center">易经概述</h2>
            <p className="chinese-text text-lg mb-4">
              《易经》，又称《周易》，是中国最古老的经典之一，被誉为"群经之首"。它不仅是一部占卜之书，更是一部蕴含深刻哲学思想的智慧宝典。《易经》由"经"和"传"两部分组成，"经"部分包括六十四卦和卦辞，"传"部分则是对"经"的解释，称为"十翼"。
            </p>
            <p className="chinese-text text-lg mb-4">
              《易经》的核心思想是阴阳变化之理，认为宇宙万物都处于不断的变化之中，而这种变化遵循着特定的规律。通过理解这些规律，人们可以顺应自然，与环境和谐相处，获得更好的生活体验。
            </p>
            <p className="chinese-text text-lg">
              在现代环境能量设计中，《易经》的智慧为我们提供了宝贵的指导原则，帮助我们创造能量平衡、和谐流动的空间环境，提升生活品质。
            </p>
          </div>
        </div>
      </section>

      {/* 易经基本概念 */}
      <section className="py-16 bg-[var(--neutral)]">
        <div className="container mx-auto px-4">
          <h2 className="chinese-title text-3xl text-[var(--primary)] mb-12 text-center">易经基本概念</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="chinese-title text-2xl text-[var(--primary)] mb-4">阴阳学说</h3>
              <p className="chinese-text mb-4">
                阴阳学说是《易经》的核心概念，认为宇宙万物都由阴阳两种对立统一的力量组成。阳代表光明、温暖、刚强、外向等特质，阴代表黑暗、寒冷、柔弱、内向等特质。
              </p>
              <p className="chinese-text">
                在环境能量设计中，我们追求阴阳平衡，通过合理安排空间的光线、色彩、形状等元素，创造一个既有阳刚之气又不失阴柔之美的和谐环境。
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="chinese-title text-2xl text-[var(--primary)] mb-4">五行理论</h3>
              <p className="chinese-text mb-4">
                五行理论是中国古代哲学的重要组成部分，指的是金、木、水、火、土五种基本元素。五行之间存在相生相克的关系：木生火，火生土，土生金，金生水，水生木；木克土，土克水，水克火，火克金，金克木。
              </p>
              <p className="chinese-text">
                在空间设计中，我们通过五行元素的合理配置，创造能量平衡的环境，促进空间能量的良性循环，避免某种元素过盛或不足导致的能量失衡。
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="chinese-title text-2xl text-[var(--primary)] mb-4">八卦系统</h3>
              <p className="chinese-text mb-4">
                八卦是《易经》中描述宇宙基本状态的八种符号，分别是乾（天）、坤（地）、震（雷）、巽（风）、坎（水）、离（火）、艮（山）、兑（泽）。每一卦都代表特定的自然现象和能量场。
              </p>
              <p className="chinese-text">
                在环境能量设计中，我们根据八卦方位和特性，合理规划空间布局和功能区域，使各个区域的能量特性与其功能相匹配，创造一个能量流动顺畅的环境。
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="chinese-title text-2xl text-[var(--primary)] mb-4">六十四卦</h3>
              <p className="chinese-text mb-4">
                六十四卦是由八卦两两组合形成的更复杂系统，每一卦都代表一种特定的状态和变化规律。通过对六十四卦的理解，我们可以更深入地把握宇宙万物的变化规律。
              </p>
              <p className="chinese-text">
                在高级环境能量设计中，我们可以利用六十四卦的智慧，进行更精细的空间能量分析和设计，解决复杂的环境能量问题，创造更高层次的和谐空间。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 易经在现代环境设计中的应用 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="chinese-title text-3xl text-[var(--primary)] mb-12 text-center">易经在现代环境设计中的应用</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-[var(--neutral)] p-8 rounded-lg">
              <div className="w-20 h-20 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-[var(--primary)] text-4xl chinese-title">宅</span>
              </div>
              <h3 className="chinese-title text-xl text-[var(--primary)] mb-3 text-center">住宅空间设计</h3>
              <ul className="chinese-text list-disc list-inside space-y-2">
                <li>根据八卦方位规划房间功能</li>
                <li>利用五行理论平衡室内能量</li>
                <li>通过阴阳原理调整光线与色彩</li>
                <li>结合个人命卦优化居住环境</li>
                <li>化解不良气场，增强有利能量</li>
              </ul>
            </div>
            
            <div className="bg-[var(--neutral)] p-8 rounded-lg">
              <div className="w-20 h-20 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-[var(--primary)] text-4xl chinese-title">商</span>
              </div>
              <h3 className="chinese-title text-xl text-[var(--primary)] mb-3 text-center">商业空间优化</h3>
              <ul className="chinese-text list-disc list-inside space-y-2">
                <li>优化店面布局增强财运能量</li>
                <li>调整办公区域提升工作效率</li>
                <li>设计老板位增强领导能量</li>
                <li>平衡公共区域的人际能量场</li>
                <li>创造有利于商业成功的气场</li>
              </ul>
            </div>
            
            <div className="bg-[var(--neutral)] p-8 rounded-lg">
              <div className="w-20 h-20 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-[var(--primary)] text-4xl chinese-title">人</span>
              </div>
              <h3 className="chinese-title text-xl text-[var(--primary)] mb-3 text-center">个人能量调整</h3>
              <ul className="chinese-text list-disc list-inside space-y-2">
                <li>分析个人五行特质与不足</li>
                <li>设计个人专属能量空间</li>
                <li>调整环境匹配个人命卦</li>
                <li>优化居住环境促进健康</li>
                <li>创造有助于个人发展的能量场</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 研究案例 */}
      <section className="py-16 bg-[var(--neutral)]">
        <div className="container mx-auto px-4">
          <h2 className="chinese-title text-3xl text-[var(--primary)] mb-12 text-center">研究案例</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-64 relative">
                <div className="absolute inset-0 bg-[url('/images/case-study-1.jpg')] bg-cover bg-center"></div>
              </div>
              <div className="p-8">
                <h3 className="chinese-title text-2xl text-[var(--primary)] mb-3">现代办公空间的五行平衡研究</h3>
                <p className="chinese-text mb-4">
                  这项研究探讨了如何在现代办公环境中应用五行理论，通过材质、色彩、形状和植物的合理配置，创造一个能量平衡的工作空间，提升员工效率和健康水平。
                </p>
                <p className="chinese-text mb-4">
                  研究表明，五行平衡的办公环境可以减少员工压力，提高创造力，降低病假率，增强团队凝聚力。
                </p>
                <Link 
                  href="/blog/office-five-elements" 
                  className="inline-block chinese-text text-[var(--primary)] border-b-2 border-[var(--primary)] hover:text-[var(--primary)]/80 hover:border-[var(--primary)]/80 transition-colors"
                >
                  查看详细研究 →
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-64 relative">
                <div className="absolute inset-0 bg-[url('/images/case-study-2.jpg')] bg-cover bg-center"></div>
              </div>
              <div className="p-8">
                <h3 className="chinese-title text-2xl text-[var(--primary)] mb-3">阴阳平衡在居家环境中的实践</h3>
                <p className="chinese-text mb-4">
                  这项研究探讨了阴阳平衡理论在现代家居设计中的应用，包括如何通过光线、色彩、材质和空间布局的设计，创造一个既活力充沛又宁静舒适的居住环境。
                </p>
                <p className="chinese-text mb-4">
                  研究发现，阴阳平衡的家居环境可以改善睡眠质量，增强家庭和谐，提升整体生活质量。
                </p>
                <Link 
                  href="/blog/home-yin-yang-balance" 
                  className="inline-block chinese-text text-[var(--primary)] border-b-2 border-[var(--primary)] hover:text-[var(--primary)]/80 hover:border-[var(--primary)]/80 transition-colors"
                >
                  查看详细研究 →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 学习资源 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="chinese-title text-3xl text-[var(--primary)] mb-6 text-center">易经学习资源</h2>
          <p className="chinese-text text-lg max-w-3xl mx-auto text-center mb-12">
            以下是一些推荐的易经学习资源，帮助您深入了解这门古老智慧
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-[var(--neutral)] p-6 rounded-lg">
              <h3 className="chinese-title text-xl text-[var(--primary)] mb-3">推荐书籍</h3>
              <ul className="chinese-text list-disc list-inside space-y-2">
                <li>《周易译注》 - 黄寿祺、张善文</li>
                <li>《易经的奥秘》 - 曾仕强</li>
                <li>《易经入门》 - 南怀瑾</li>
                <li>《周易今注今译》 - 高亨</li>
                <li>《易经与现代生活》 - 王易堂</li>
              </ul>
            </div>
            
            <div className="bg-[var(--neutral)] p-6 rounded-lg">
              <h3 className="chinese-title text-xl text-[var(--primary)] mb-3">在线课程</h3>
              <ul className="chinese-text list-disc list-inside space-y-2">
                <li>易经基础入门课程</li>
                <li>阴阳五行理论与应用</li>
                <li>八卦与环境能量设计</li>
                <li>易经智慧与现代生活</li>
                <li>易经与健康养生</li>
              </ul>
              <p className="chinese-text mt-4">
                <Link 
                  href="/services" 
                  className="text-[var(--primary)] hover:underline"
                >
                  查看课程详情 →
                </Link>
              </p>
            </div>
            
            <div className="bg-[var(--neutral)] p-6 rounded-lg">
              <h3 className="chinese-title text-xl text-[var(--primary)] mb-3">实践工具</h3>
              <ul className="chinese-text list-disc list-inside space-y-2">
                <li>易经能量评估表</li>
                <li>五行平衡检测工具</li>
                <li>环境能量记录日志</li>
                <li>八卦方位指南针</li>
                <li>个人能量调整建议手册</li>
              </ul>
              <p className="chinese-text mt-4">
                <Link 
                  href="/contact" 
                  className="text-[var(--primary)] hover:underline"
                >
                  获取工具资源 →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 研究交流 */}
      <section className="py-16 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="chinese-title text-3xl mb-6">加入易经研究交流</h2>
          <p className="chinese-text text-xl max-w-2xl mx-auto mb-8">
            如果您对易经研究感兴趣，欢迎加入我们的研究交流群，与志同道合的朋友一起探讨易经智慧
          </p>
          <Link 
            href="/contact" 
            className="bg-white text-[var(--primary)] hover:bg-white/90 px-8 py-3 rounded-md chinese-text text-lg transition-colors inline-block"
          >
            联系我们
          </Link>
        </div>
      </section>
    </div>
  );
} 