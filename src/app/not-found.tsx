"use client";

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-8xl font-bold text-primary mb-2">
          404
        </h1>
        <h2 className="text-2xl font-bold mb-6">
          页面未找到
        </h2>
        <p className="mb-8">
          您访问的页面不存在。
        </p>
        <div className="flex justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
} 