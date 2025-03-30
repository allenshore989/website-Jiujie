"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// 轮播图背景色配置 - 用作备用
const slideBgColors = [
  'bg-gradient-to-r from-primary/80 to-primary/40',
  'bg-gradient-to-r from-secondary/80 to-secondary/40',
  'bg-gradient-to-r from-neutral-800/80 to-neutral-800/40',
  'bg-gradient-to-r from-primary/70 to-secondary/40',
  'bg-gradient-to-r from-secondary/70 to-primary/40',
];

// 装饰图案类型 - 使用伪类和CSS来显示装饰元素
const decorationClasses = [
  'decoration-pattern-1',
  'decoration-pattern-2',
  'decoration-pattern-3',
  'decoration-pattern-4',
  'decoration-pattern-5'
];

// 轮播图内容
const slideContent = [
  {
    title: '易经设计，传承古典智慧',
    description: '将传统易经哲学与现代设计理念相融合，创造和谐平衡的生活空间',
    image: '/images/carousel/slide1.svg'
  },
  {
    title: '量身定制的环境设计方案',
    description: '根据您的需求和空间特点，提供专业的风水环境规划与设计服务',
    image: '/images/carousel/slide2.svg'
  },
  {
    title: '专业易学顾问团队',
    description: '由经验丰富的易学专家组成，为您的居家和商业空间带来积极能量',
    image: '/images/carousel/slide3.svg'
  },
  {
    title: '现代科技与传统智慧的完美结合',
    description: '运用现代科技手段，精准分析空间能量流动，优化设计方案',
    image: '/images/carousel/slide4.svg'
  },
  {
    title: '打造身心和谐的理想空间',
    description: '通过科学的易经原理应用，创造促进健康、财富和家庭和谐的环境',
    image: '/images/carousel/slide5.svg'
  }
];

const HomeCarousel = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const totalSlides = slideContent.length;

  // 自动轮播效果
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev: number) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  // 手动切换到下一张
  const nextSlide = () => {
    setCurrentSlide((prev: number) => (prev + 1) % totalSlides);
  };

  // 手动切换到上一张
  const prevSlide = () => {
    setCurrentSlide((prev: number) => (prev - 1 + totalSlides) % totalSlides);
  };

  // 直接切换到指定slide
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-lg">
      {/* 轮播内容 */}
      {slideContent.map((content, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* 使用SVG背景图片加上渐变背景色（作为后备方案） */}
          <div className={`absolute inset-0 ${slideBgColors[index % slideBgColors.length]}`}></div>
          
          {/* 使用SVG图片作为背景 */}
          <div className="absolute inset-0 bg-cover bg-center">
            <div className="relative w-full h-full">
              <Image 
                src={content.image} 
                alt={content.title}
                fill
                priority={index === 0}
                className="object-cover"
              />
            </div>
          </div>
          
          {/* 装饰元素 - 使用CSS图案（现在由SVG图片提供） */}
          
          {/* 文字内容 */}
          <div className="container mx-auto h-full px-4 relative z-20">
            <div className="flex flex-col justify-center h-full max-w-3xl">
              <div className="bg-background/20 backdrop-blur-sm p-8 rounded-lg border border-white/10 shadow-xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                  {content.title}
                </h1>
                <p className="text-xl text-white/90 mb-8 max-w-2xl">
                  {content.description}
                </p>
                <Link
                  href="/contact"
                  className="inline-block py-3 px-8 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors duration-300 font-medium"
                >
                  了解更多
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* 轮播控制按钮 */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/30 hover:bg-white/50 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10 text-white transition-all duration-300"
        aria-label="上一张"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/30 hover:bg-white/50 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10 text-white transition-all duration-300"
        aria-label="下一张"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* 轮播指示器 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
        {slideContent.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`切换到第${index + 1}张图片`}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeCarousel; 