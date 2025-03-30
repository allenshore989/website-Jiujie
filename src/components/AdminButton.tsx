"use client";

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// 管理员按钮组件的属性类型定义
export interface AdminButtonProps {
  variant?: 'default' | 'inline' | 'fixed';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  className?: string;
}

// 位置类样式映射
const positionClasses: Record<string, string> = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
};

/**
 * 管理员按钮组件
 * 提供了不同的显示变体和位置选项，便于在网站各处添加管理入口
 */
const AdminButton: React.FC<AdminButtonProps> = ({ 
  variant = 'default',
  position = 'bottom-right',
  className,
}) => {
  // 基于变体选择样式
  const getVariantStyles = () => {
    switch (variant) {
      case 'inline':
        return 'bg-white text-primary border border-primary hover:bg-gray-50';
      case 'fixed':
        return 'bg-white/90 text-primary border border-primary hover:bg-white shadow-md backdrop-blur-sm fixed z-50';
      default:
        return 'bg-primary text-white hover:bg-primary/90';
    }
  };

  // 合并所有样式
  const buttonClasses = cn(
    'py-2 px-4 rounded-md transition-all duration-300 flex items-center gap-2',
    getVariantStyles(),
    variant === 'fixed' && positionClasses[position],
    className
  );

  return (
    <Link href="/admin/login" className={buttonClasses}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        className="w-5 h-5"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 15v3m0 0l3-3m-3 3l-3-3m0-6a5 5 0 1110 0 5 5 0 01-10 0z" 
        />
      </svg>
      管理入口
    </Link>
  );
};

export default AdminButton; 