"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CarouselItem } from '@/components/Carousel';

interface PageBannerCarouselProps {
  items: CarouselItem[];
  height?: string; // 允许自定义高度
}

const PageBannerCarousel: React.FC<PageBannerCarouselProps> = ({ 
  items, 
  height = '300px' 
}: PageBannerCarouselProps) => {
  const [activeIndex, setActiveIndex] = React.useState<number>(0);
  const [isTransitioning, setIsTransitioning] = React.useState<boolean>(false);
  const [imageError, setImageError] = React.useState<Record<number, boolean>>({});

  // 自动轮播
  React.useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  const goToNext = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setActiveIndex((prevIndex: number) => (prevIndex === items.length - 1 ? 0 : prevIndex + 1));
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const goToPrevious = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setActiveIndex((prevIndex: number) => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const goToIndex = (index: number) => {
    if (!isTransitioning && index !== activeIndex) {
      setIsTransitioning(true);
      setActiveIndex(index);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const handleImageError = (index: number) => {
    setImageError((prev: Record<number, boolean>) => ({...prev, [index]: true}));
  };

  return (
    <div className="relative w-full overflow-hidden rounded-lg bg-gray-100" style={{ height }}>
      {/* 轮播图内容 */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {items.map((item: CarouselItem, index: number) => (
          <div key={item.id} className="min-w-full relative h-full">
            {/* 添加默认背景渐变色，保证即使没有图片也能看到内容 */}
            <div className={`absolute inset-0 bg-gradient-to-br ${
              index % 3 === 0 
                ? 'from-primary/80 to-primary/40' 
                : index % 3 === 1
                  ? 'from-secondary/80 to-secondary/40'
                  : 'from-[#2a3f5f]/80 to-[#2a3f5f]/40'
            }`}></div>
            
            {/* 尝试加载图片，如果有效的话 */}
            {!imageError[index] && item.image && (
              <div className="absolute inset-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  onError={() => handleImageError(index)}
                  priority={index === 0}
                />
              </div>
            )}
            
            {/* 装饰元素 */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 right-10 w-20 h-20 border-4 border-white/30 rounded-full"></div>
              <div className="absolute bottom-10 left-10 w-32 h-32 border-2 border-white/20 rounded-full"></div>
              <div className="absolute top-20 left-[40%] w-12 h-12 bg-white/10 rounded-full"></div>
              {index % 2 === 0 ? (
                <div className="absolute bottom-20 right-[30%] w-16 h-16 border border-white/40 transform rotate-45"></div>
              ) : (
                <div className="absolute top-[30%] left-10 w-14 h-14 border-2 border-white/30 transform rotate-12"></div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 导航按钮 - 横幅尺寸下隐藏 */}
      <div className="hidden md:block">
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/30 text-white p-1 rounded-full hover:bg-black/50 transition-colors"
          onClick={goToPrevious}
          aria-label="上一张"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/30 text-white p-1 rounded-full hover:bg-black/50 transition-colors"
          onClick={goToNext}
          aria-label="下一张"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* 指示器 */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex space-x-1">
        {items.map((_: CarouselItem, index: number) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === activeIndex ? 'bg-white' : 'bg-white/50'
            } hover:bg-white/90`}
            onClick={() => goToIndex(index)}
            aria-label={`跳转到第${index + 1}张轮播图`}
          />
        ))}
      </div>
    </div>
  );
};

export default PageBannerCarousel; 