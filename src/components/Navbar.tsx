"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // 导航链接
  const navLinks = [
    { name: "首页", href: "/" },
    { name: "关于我们", href: "/about" },
    { name: "易经服务", href: "/services" },
    { name: "设计案例", href: "/cases" },
    { name: "易经研究", href: "/studies" },
    { name: "文化游学", href: "/tours" },
    { name: "易经博客", href: "/blog" },
    { name: "联系我们", href: "/contact" },
    { name: "后台管理", href: "/admin/login" },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* 网站Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-primary text-2xl font-mashan">易经环境设计</span>
            </Link>
          </div>

          {/* 桌面端导航菜单 */}
          <nav className="hidden md:ml-6 md:flex md:items-center">
            <div className="flex space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    link.href === "/admin/login"
                      ? "text-white bg-secondary shadow-sm hover:bg-secondary/90"
                      : pathname === link.href
                      ? "text-white bg-primary shadow-sm"
                      : "text-gray-700 hover:text-primary hover:bg-gray-50"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </nav>

          {/* 移动端菜单按钮 */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">打开主菜单</span>
              {mobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 移动端导航菜单 */}
      <div
        className={`${
          mobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } md:hidden bg-white border-b border-gray-200 overflow-hidden transition-all duration-300 ease-in-out`}
      >
        <nav className="px-4 pt-2 pb-3">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    link.href === "/admin/login"
                      ? "bg-secondary text-white hover:bg-secondary/90"
                      : pathname === link.href
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                  } transition-colors`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
} 