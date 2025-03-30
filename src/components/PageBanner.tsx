"use client";

import React from 'react';
import Image from 'next/image';
import PageBannerCarousel from '@/components/PageBannerCarousel';
import { carouselItems } from '@/data/carouselData';

interface PageBannerProps {
  title: string;
  subtitle?: string;
  image?: string; // 保留image字段以确保接口兼容性
  patternIndex?: number; // 新增: 背景图案索引
}

const PageBanner: React.FC<PageBannerProps> = ({ 
  title, 
  subtitle, 
  image,
  patternIndex // 可以指定特定的背景图案
}: PageBannerProps) => {
  // 保留渐变背景作为备选
  const getBannerGradient = () => {
    const gradients = [
      'from-primary/90 to-primary/50',
      'from-secondary/90 to-secondary/50',
      'from-[#2a3f5f]/90 to-[#2a3f5f]/50',
      'from-[#1e3a8a]/90 to-[#3b82f6]/50',
      'from-[#374151]/90 to-[#6b7280]/50'
    ];
    
    const hash = title.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    const index = hash % gradients.length;
    return gradients[index];
  };

  const gradientClass = getBannerGradient();
  
  return (
    <div className="relative w-full flex items-center justify-center overflow-hidden">
      {/* 使用轮播图组件替换固定背景 */}
      <div className="w-full">
        <PageBannerCarousel items={carouselItems} />
      </div>
      
      {/* 页面标题覆盖在轮播图上 */}
      <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/40 backdrop-blur-sm">
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-mashan mb-4">{title}</h1>
          {subtitle && <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

export default PageBanner; 