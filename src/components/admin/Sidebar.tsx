'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaTachometerAlt, 
  FaEnvelope, 
  FaBuilding, 
  FaQuestionCircle, 
  FaCog 
} from 'react-icons/fa';
import LogoutButton from './LogoutButton';

export default function Sidebar() {
  const pathname = usePathname();
  
  const menuItems = [
    { href: '/admin/dashboard', label: '仪表盘', icon: <FaTachometerAlt /> },
    { href: '/admin/messages', label: '留言管理', icon: <FaEnvelope /> },
    { href: '/admin/branches', label: '分支机构', icon: <FaBuilding /> },
    { href: '/admin/faqs', label: '常见问题', icon: <FaQuestionCircle /> },
    { href: '/admin/settings', label: '系统设置', icon: <FaCog /> },
  ];

  return (
    <div className="bg-gray-800 text-white w-64 flex-shrink-0 h-screen">
      <div className="p-5">
        <h2 className="text-2xl font-bold mb-5 text-center">管理系统</h2>
        
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                    pathname === item.href 
                      ? 'bg-primary text-white' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      <div className="absolute bottom-5 w-64 px-5">
        <div className="border-t border-gray-700 pt-4">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
} 