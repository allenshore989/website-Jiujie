"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminEntryPage() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <div className="mx-auto w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-mashan">
              易经
            </div>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 font-mashan">
            管理系统入口
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            请选择您要进入的管理区域
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          <Link href="/admin/login" className="group w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-primary/80 group-hover:text-primary/70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" aria-hidden="true">
                <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
              </svg>
            </span>
            管理员登录
          </Link>
          
          <Link href="/admin/dashboard" className="w-full flex justify-center py-3 px-4 border border-primary text-sm font-medium rounded-md text-primary bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            直接进入管理面板
          </Link>
        </div>
        
        <div className="mt-6 text-center">
          <Link href="/" className="font-medium text-sm text-gray-600 hover:text-gray-900">
            返回网站首页
          </Link>
        </div>
      </div>
    </div>
  );
} 