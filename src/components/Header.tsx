"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const Header = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const menuItems = [
    { href: '/', label: '首页' },
    { href: '/about', label: '关于我们' },
    { href: '/services', label: '服务内容' },
    { href: '/yijing', label: '易经知识' },
    { href: '/blog', label: '博客' },
    { href: '/contact', label: '联系我们' }
  ];
  
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/80 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative h-10 w-10 mr-2">
              <div className="absolute inset-0 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">易</div>
            </div>
            <span className="text-xl font-bold text-primary hidden sm:inline">易经环境设计</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {menuItems.map(item => (
              <Link 
                key={item.href} 
                href={item.href}
                className={`${
                  isActive(item.href) 
                    ? 'text-primary font-medium' 
                    : 'text-foreground hover:text-primary'
                } transition-colors`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* 添加后台入口 - 桌面端 */}
            <Link 
              href="/admin" 
              className="bg-primary/10 text-primary px-3 py-1 rounded-md hover:bg-primary/20 transition-colors text-sm"
            >
              后台管理
            </Link>
          </nav>
          
          {/* Desktop Right Menu - 移除语言切换器，只保留联系按钮 */}
          <div className="hidden lg:flex items-center space-x-6">            
            {/* Contact Button */}
            <Link 
              href="/contact" 
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              联系我们
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden space-x-4">
            {/* 添加后台入口 - 移动端 */}
            <Link 
              href="/admin" 
              className="bg-primary/10 text-primary px-3 py-1 rounded-md hover:bg-primary/20 transition-colors text-sm flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="hidden sm:inline">后台管理</span>
            </Link>
            
            <button
              className="flex items-center justify-center p-2 rounded-md text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-background/95 backdrop-blur-md shadow-md py-4 absolute top-full left-0 right-0">
          <div className="container mx-auto px-4">
            <nav className="flex flex-col space-y-3">
              {menuItems.map(item => (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className={`${
                    isActive(item.href) 
                      ? 'text-primary font-medium' 
                      : 'text-foreground hover:text-primary'
                  } py-2 transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Contact Button in Mobile Menu */}
              <Link 
                href="/contact" 
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors text-center mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                联系我们
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;