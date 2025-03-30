"use client";

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import AdminButton from '@/components/AdminButton';

// 导入关于页面数据类型
interface AboutPageData {
  mission: {
    title: string;
    content: string[];
    features: {
      title: string;
      description: string;
    }[];
  };
  history: {
    title: string;
    events: {
      year: string;
      description: string;
    }[];
  };
  team: {
    title: string;
    members: {
      name: string;
      title: string;
      image: string;
      description: string;
    }[];
  };
}

// 动态导入客户端组件，添加错误边界处理
const PageBanner = dynamic(() => import('@/components/PageBanner'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] bg-neutral flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">加载页面横幅...</p>
      </div>
    </div>
  ),
});

// 备用横幅组件
const FallbackBanner = () => (
  <div className="w-full h-[300px] bg-primary/10 flex items-center justify-center">
    <div className="text-center p-8">
      <h1 className="text-3xl font-mashan text-primary mb-4">关于我们</h1>
      <p className="text-gray-700 max-w-2xl mx-auto">
        易经环境设计是一家专注于将传统易经哲学与现代空间设计相结合的专业机构
      </p>
    </div>
  </div>
);

// 包装PageBanner的客户端组件，用于错误处理
const ClientBannerWrapper = () => {
  const [hasError, setHasError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  
  React.useEffect(() => {
    // 添加全局错误处理用于捕获动态组件的错误
    const handleError = (event: ErrorEvent) => {
      console.error('Banner加载失败，使用备用横幅', event);
      setErrorMessage(event.message || '未知错误');
      setHasError(true);
    };
    
    window.addEventListener('error', handleError);
    
    // 检查banner图片是否存在
    // 确保只在客户端执行
    if (typeof window !== 'undefined') {
      const img = new window.Image();
      img.src = '/images/banners/banner-pattern1.svg';
      img.onerror = () => {
        console.error('Banner图片加载失败');
        setErrorMessage('Banner图片加载失败');
        setHasError(true);
      };
    }
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);
  
  if (hasError) {
    console.log('使用备用横幅，错误原因:', errorMessage);
    return <FallbackBanner />;
  }
  
  return (
    <React.Suspense fallback={<FallbackBanner />}>
      <PageBanner 
        title="关于我们" 
        subtitle="专注于将易经智慧融入现代环境设计的专业团队"
        patternIndex={1} // 使用第一种背景图案
      />
    </React.Suspense>
  );
};

export default function AboutPage() {
  // 在服务器端渲染时使用备用横幅
  const [isMounted, setIsMounted] = React.useState(false);
  const [aboutData, setAboutData] = React.useState<AboutPageData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    setIsMounted(true);
    
    // 获取关于页面数据
    const fetchAboutData = async () => {
      try {
        const response = await fetch('/api/about');
        
        if (!response.ok) {
          throw new Error(`获取关于页面数据失败: ${response.status}`);
        }
        
        const data = await response.json();
        setAboutData(data);
      } catch (error) {
        console.error('加载关于页面数据出错:', error);
        setError('无法加载关于页面数据');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAboutData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* 使用客户端包装器处理错误 */}
      {isMounted ? (
        <ClientBannerWrapper />
      ) : (
        <FallbackBanner />
      )}

      {/* 公司简介 */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-mashan text-primary mb-6">
                {aboutData?.mission?.title || "我们的使命"}
              </h2>
              {aboutData?.mission?.content.map((paragraph: string, index: number) => (
                <p key={index} className="text-gray-700 mb-4">
                  {paragraph}
                </p>
              )) || (
                <>
                  <p className="text-gray-700 mb-4">
                    易经环境设计成立于2008年，是一家专注于将中国传统易经哲学与现代空间设计相结合的专业机构。我们的使命是通过专业的环境设计，帮助人们创造和谐、平衡的生活和工作空间，从而提升生活质量和工作效率。
                  </p>
                  <p className="text-gray-700 mb-6">
                    我们的团队由经验丰富的易经专家、室内设计师和建筑师组成，致力于为客户提供全方位的环境解决方案。我们相信，一个好的环境不仅要美观实用，更要与人的身心和自然规律相协调。
                  </p>
                </>
              )}
              <div className="flex flex-col md:flex-row gap-4">
                {aboutData?.mission?.features.map((feature: { title: string; description: string }, index: number) => (
                  <div key={index} className="flex items-center p-4 bg-neutral rounded-lg">
                    <span className="text-2xl text-primary mr-4">✦</span>
                    <div>
                      <h3 className="text-lg font-bold text-primary">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                )) || (
                  <>
                    <div className="flex items-center p-4 bg-neutral rounded-lg">
                      <span className="text-2xl text-primary mr-4">✦</span>
                      <div>
                        <h3 className="text-lg font-bold text-primary">理论与实践相结合</h3>
                        <p className="text-sm text-gray-600">将古老易经理论用于现代空间设计</p>
                      </div>
                    </div>
                    <div className="flex items-center p-4 bg-neutral rounded-lg">
                      <span className="text-2xl text-primary mr-4">✦</span>
                      <div>
                        <h3 className="text-lg font-bold text-primary">个性化定制方案</h3>
                        <p className="text-sm text-gray-600">根据客户需求量身打造专属设计</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
              <Image 
                src="/images/placeholder.svg" 
                alt="易经环境设计办公室" 
                fill
                className="object-cover"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  // 图片加载失败时使用占位符
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/placeholder.svg";
                  console.error('图片加载失败，使用占位符');
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 公司历史 */}
      <section className="py-20 bg-neutral">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-mashan text-primary text-center mb-16">
            {aboutData?.history?.title || "我们的历程"}
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* 时间轴 */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/20"></div>
              
              {/* 历史事件 */}
              <div className="space-y-12">
                {aboutData?.history?.events.map((event: { year: string; description: string }, index: number) => (
                  <div key={index} className="relative">
                    <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {index % 2 === 0 ? (
                        <>
                          <div className="md:text-right md:pr-12">
                            <h3 className="text-xl font-bold text-primary">{event.year}</h3>
                            <p className="text-gray-700">{event.description}</p>
                          </div>
                          <div className="md:pl-12"></div>
                        </>
                      ) : (
                        <>
                          <div className="md:pr-12"></div>
                          <div className="md:pl-12">
                            <h3 className="text-xl font-bold text-primary">{event.year}</h3>
                            <p className="text-gray-700">{event.description}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )) || (
                  // 默认历程内容
                  <>
                    <div className="relative">
                      <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary"></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:text-right md:pr-12">
                          <h3 className="text-xl font-bold text-primary">2008年</h3>
                          <p className="text-gray-700">易经环境设计在北京成立，初期主要提供住宅风水咨询服务。</p>
                        </div>
                        <div className="md:pl-12"></div>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary"></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:pr-12"></div>
                        <div className="md:pl-12">
                          <h3 className="text-xl font-bold text-primary">2012年</h3>
                          <p className="text-gray-700">业务扩展至商业空间设计领域，并完成首个大型商业项目。</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 团队介绍 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-mashan text-primary text-center mb-16">
            {aboutData?.team?.title || "专业团队"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aboutData?.team?.members.map((member: { name: string; title: string; image: string; description: string }, index: number) => (
              <div key={index} className="bg-neutral rounded-lg overflow-hidden shadow-lg">
                <div className="h-64 relative">
                  <Image
                    src={member.image || "/images/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover"
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      // 图片加载失败时使用占位符
                      const target = e.target as HTMLImageElement;
                      target.src = "/images/placeholder.svg";
                      console.error(`团队成员图片加载失败: ${member.image}`);
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-2">{member.name}</h3>
                  <p className="text-primary/70 mb-4">{member.title}</p>
                  <p className="text-gray-600">{member.description}</p>
                </div>
              </div>
            )) || (
              // 默认团队成员
              [
                {
                  name: "张大师",
                  title: "首席设计师",
                  image: "/images/placeholder.svg",
                  description: "20年易经环境设计经验，专注于商业空间的风水布局优化。曾为多家知名企业提供办公环境设计服务。"
                },
                {
                  name: "李教授",
                  title: "易经学术顾问",
                  image: "/images/placeholder.svg",
                  description: "国内知名易学专家，著有《现代空间与易经》等多部著作。负责团队的理论指导与培训工作。"
                },
                {
                  name: "王设计师",
                  title: "室内空间设计师",
                  image: "/images/placeholder.svg",
                  description: "将现代设计理念与传统风水学巧妙结合，打造美观与实用兼备的空间。擅长住宅与商业空间设计。"
                }
              ].map((member, index) => (
                <div key={index} className="bg-neutral rounded-lg overflow-hidden shadow-lg">
                  <div className="h-64 relative">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        // 图片加载失败时使用占位符
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/placeholder.svg";
                        console.error(`团队成员图片加载失败: ${member.image}`);
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-primary mb-2">{member.name}</h3>
                    <p className="text-primary/70 mb-4">{member.title}</p>
                    <p className="text-gray-600">{member.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 企业价值观 */}
      <section className="py-20 bg-neutral">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-mashan text-primary text-center mb-12">我们的价值观</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <span className="text-2xl text-primary">☯</span>
                </div>
                <h3 className="text-xl font-bold text-primary mb-4">尊重传统，拥抱创新</h3>
                <p className="text-gray-600">
                  我们深度尊重传统易经文化的精髓，同时积极探索与现代设计理念和技术的融合，创造出既有文化底蕴又符合现代审美的空间方案。
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <span className="text-2xl text-primary">⚖️</span>
                </div>
                <h3 className="text-xl font-bold text-primary mb-4">平衡与和谐</h3>
                <p className="text-gray-600">
                  我们相信环境设计的核心是创造平衡与和谐，无论是阴阳平衡、五行相生，还是人与环境的和谐共处，都是我们追求的目标。
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <span className="text-2xl text-primary">🔍</span>
                </div>
                <h3 className="text-xl font-bold text-primary mb-4">专业与诚信</h3>
                <p className="text-gray-600">
                  我们坚持专业水准，提供有理有据的环境评估和设计方案，拒绝迷信和伪科学，以诚信态度赢得客户的信任和尊重。
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <span className="text-2xl text-primary">🌱</span>
                </div>
                <h3 className="text-xl font-bold text-primary mb-4">可持续发展</h3>
                <p className="text-gray-600">
                  我们注重环境的可持续性，提倡使用环保材料和节能设计，将生态理念融入易经环境设计中，为客户创造健康、绿色的生活空间。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 联系我 */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="chinese-title text-3xl mb-6">开启您的环境能量之旅</h2>
          <p className="chinese-text text-xl max-w-2xl mx-auto mb-8">
            如果您对易经环境设计服务感兴趣，或者希望了解更多信息，欢迎随时联系我们
          </p>
          <Link 
            href="/contact" 
            className="bg-white text-primary hover:bg-neutral transition-colors px-8 py-3 rounded-md chinese-text text-lg inline-block"
          >
            联系我们
          </Link>
        </div>
      </section>

      {/* Admin Button */}
      <AdminButton
        href="/admin/dashboard/settings?tab=about"
        className="fixed bottom-4 right-4 z-50"
      />
    </div>
  );
} 