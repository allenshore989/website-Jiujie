"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// 定义联系信息数据类型
interface ContactInfo {
  address: string;
  phone: string;
  customerService: string;
  email: string;
  businessEmail: string;
  workingHours: string;
  socialMedia?: {
    weixin: string;
    weibo: string;
    xiaohongshu: string;
  }
}

// 定义分支机构数据类型
interface BranchOffice {
  city: string;
  address: string;
  phone: string;
  email: string;
}

// 定义FAQ数据类型
interface FAQ {
  question: string;
  answer: string;
}

// 动态导入客户端组件
const PageBanner = dynamic(() => import('@/components/PageBanner'), { ssr: false });

// 默认分支机构数据
const defaultBranches: BranchOffice[] = [
  {
    city: '北京总部',
    address: '朝阳区建国路88号',
    phone: '010-12345678',
    email: 'beijing@yijingdesign.cn'
  },
  {
    city: '上海分部',
    address: '浦东新区陆家嘴金融中心',
    phone: '021-87654321',
    email: 'shanghai@yijingdesign.cn'
  },
  {
    city: '广州分部',
    address: '天河区珠江新城',
    phone: '020-56781234',
    email: 'guangzhou@yijingdesign.cn'
  },
  {
    city: '成都分部',
    address: '锦江区红星路',
    phone: '028-98765432',
    email: 'chengdu@yijingdesign.cn'
  },
  {
    city: '深圳分部',
    address: '南山区科技园',
    phone: '0755-23456789',
    email: 'shenzhen@yijingdesign.cn'
  },
  {
    city: '杭州分部',
    address: '西湖区文三路',
    phone: '0571-87654321',
    email: 'hangzhou@yijingdesign.cn'
  }
];

// 常见问题
const defaultFAQs: FAQ[] = [
  {
    question: '易经环境设计服务流程是怎样的？',
    answer: '我们的服务流程通常包括：初步咨询、现场勘察、方案设计、实施指导和后续跟进。整个过程中，我们会与客户保持密切沟通，确保设计方案符合客户期望并取得实际效果。'
  },
  {
    question: '需要亲自到现场勘察吗，还是可以远程提供服务？',
    answer: '我们推荐现场勘察以获取最准确的环境信息，但也提供远程咨询服务。远程服务需要客户提供详细的空间图片、平面图和相关信息，我们会基于这些资料提供专业建议。'
  },
  {
    question: '改变住宅或办公空间的风水需要大规模装修吗？',
    answer: '不一定。很多风水优化可以通过调整家具布局、更换装饰品、添加特定元素等小改动实现。我们会根据具体情况提供最经济实用的方案，尽量避免不必要的大规模装修。'
  },
  {
    question: '服务费用是如何计算的？',
    answer: '我们的服务费用根据项目类型、空间大小和服务内容有所不同。一般包括咨询费、方案设计费和实施指导费。您可以联系我们获取详细的报价单。'
  },
  {
    question: '易经风水设计与普通室内设计有什么区别？',
    answer: '易经风水设计在注重美观和功能性的同时，更关注空间的能量流动、五行平衡和对居住者的影响。我们会根据易经原理和客户个人的生辰八字，设计更加和谐、平衡的生活或工作环境。'
  }
];

export default function ContactPage() {
  // 定义联系信息状态
  const [contactInfo, setContactInfo] = React.useState<ContactInfo>({
    address: '北京市朝阳区建国路88号',
    phone: '010-12345678',
    customerService: '400-888-9999',
    email: 'contact@yijingdesign.cn',
    businessEmail: 'business@yijingdesign.cn',
    workingHours: '周一至周五: 9:00 - 18:00\n周六: 10:00 - 16:00\n周日: 休息'
  });
  
  // 分支机构状态
  const [branches, setBranches] = React.useState<BranchOffice[]>(defaultBranches);
  
  // FAQ状态
  const [faqs, setFaqs] = React.useState<FAQ[]>(defaultFAQs);
  
  // 加载状态
  const [loading, setLoading] = React.useState(true);

  // 添加表单状态
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  // 添加表单处理函数
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: typeof formData) => ({
      ...prev,
      [name]: value
    }));
  };

  // 从API加载数据
  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // 并行获取所有需要的数据
        const [contactResponse, branchesResponse, faqsResponse] = await Promise.all([
          fetch('/api/contact'),
          fetch('/api/branches'),
          fetch('/api/faqs')
        ]);
        
        // 检查响应是否成功
        if (!contactResponse.ok) {
          throw new Error(`获取联系信息失败: ${contactResponse.status}`);
        }
        
        if (!branchesResponse.ok) {
          throw new Error(`获取分支机构数据失败: ${branchesResponse.status}`);
        }
        
        if (!faqsResponse.ok) {
          throw new Error(`获取FAQ数据失败: ${faqsResponse.status}`);
        }
        
        // 解析数据
        const contactData = await contactResponse.json();
        const branchesData = await branchesResponse.json();
        const faqsData = await faqsResponse.json();
        
        // 更新状态
        setContactInfo({
          address: contactData.address,
          phone: contactData.phone,
          customerService: contactData.customerService,
          email: contactData.email,
          businessEmail: contactData.businessEmail,
          workingHours: contactData.workingHours
        });
        
        setBranches(branchesData);
        setFaqs(faqsData);
        
        setLoading(false);
      } catch (error) {
        console.error('加载数据时出错:', error);
        
        // 使用默认数据作为备用
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证表单
    if (!formData.name || !formData.phone || !formData.message) {
      alert('请填写必填字段！');
      return;
    }
    
    try {
      // 设置提交中状态
      setLoading(true);
      
      // 调用API提交表单数据
      const response = await fetch('/api/contact/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: formData.service,
          message: formData.message
        }),
      });
      
      // 处理响应
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || '提交失败');
      }
      
      // 重置表单
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });
      
      // 显示成功消息
      alert(result.message || '您的咨询已提交，我们会尽快与您联系！');
    } catch (error) {
      console.error('提交表单时出错:', error);
      alert(error instanceof Error ? error.message : '提交失败，请稍后再试！');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-4">
      {/* 使用PageBanner组件代替原有横幅 */}
      <PageBanner 
        title="联系我们" 
        subtitle="随时为您提供专业的易经环境设计咨询服务" 
        patternIndex={2}
      />

      {/* 联系信息和表单 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* 联系信息 */}
            <div>
              <h2 className="text-3xl font-mashan text-primary mb-8">与我们沟通</h2>
              <p className="text-gray-700 mb-12">
                无论您有任何关于易经环境设计的问题或需求，都可以通过以下方式与我们联系。
                我们的专业团队随时准备为您提供咨询和服务。
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center shrink-0 mr-4">
                    <span className="text-2xl text-primary">📍</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-2">公司地址</h3>
                    <p className="text-gray-600">
                      {contactInfo.address.split('\n').map((line: string, i: number) => (
                        <React.Fragment key={i}>
                          {line}<br />
                        </React.Fragment>
                      ))}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center shrink-0 mr-4">
                    <span className="text-2xl text-primary">📞</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-2">联系电话</h3>
                    <p className="text-gray-600">
                      总机: {contactInfo.phone}<br />
                      客服: {contactInfo.customerService}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center shrink-0 mr-4">
                    <span className="text-2xl text-primary">✉️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-2">电子邮箱</h3>
                    <p className="text-gray-600">
                      客户咨询: {contactInfo.email}<br />
                      商务合作: {contactInfo.businessEmail}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center shrink-0 mr-4">
                    <span className="text-2xl text-primary">🕒</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-2">工作时间</h3>
                    <p className="text-gray-600">
                      {contactInfo.workingHours.split('\n').map((line: string, i: number) => (
                        <React.Fragment key={i}>
                          {line}<br />
                        </React.Fragment>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 联系表单 */}
            <div className="bg-neutral p-8 rounded-lg">
              <h2 className="text-2xl font-mashan text-primary mb-6">预约咨询</h2>
              <p className="text-gray-600 mb-8">
                填写以下表单，我们的专业顾问将在24小时内与您联系，为您提供个性化的易经环境设计方案。
              </p>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 mb-2">姓名</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                      placeholder="请输入您的姓名"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 mb-2">电话</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                      placeholder="请输入您的联系电话"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-2">电子邮箱</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="请输入您的电子邮箱"
                  />
                </div>
                
                <div>
                  <label htmlFor="service" className="block text-gray-700 mb-2">咨询服务</label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    <option value="">请选择咨询服务类型</option>
                    <option value="住宅风水设计">住宅风水设计</option>
                    <option value="办公空间优化">办公空间优化</option>
                    <option value="商业店铺风水">商业店铺风水</option>
                    <option value="环境能量评估">环境能量评估</option>
                    <option value="个人八字分析">个人八字分析</option>
                    <option value="其他服务">其他服务</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-gray-700 mb-2">咨询内容</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="请简要描述您的需求或问题"
                  ></textarea>
                </div>
                
                <div>
                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    提交预约
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 分支机构 */}
      <section className="py-20 bg-neutral">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-mashan text-primary text-center mb-16">全国分支机构</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {branches.map((branch: BranchOffice, index: number) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-primary mb-3">{branch.city}</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-start">
                    <span className="text-primary mr-2">📍</span>
                    <span>{branch.address}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-primary mr-2">📞</span>
                    <span>{branch.phone}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-primary mr-2">✉️</span>
                    <span>{branch.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 常见问题 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-mashan text-primary text-center mb-16">常见问题</h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq: FAQ, index: number) => (
              <div key={index} className="bg-neutral p-6 rounded-lg">
                <h3 className="text-lg font-bold text-primary mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 联系号召 */}
      <section className="py-20 bg-gradient-to-br from-primary/90 via-primary/80 to-accent/80 relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-pattern-yijing opacity-30"></div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-mashan mb-8">
              让我们一起打造和谐空间
            </h2>
            <p className="text-lg mb-10">
              无论您是个人还是企业，我们都能为您提供专业的易经环境设计服务。
              联系我们，开启更加和谐、平衡、充满活力的生活和工作空间。
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href={`tel:${contactInfo.customerService}`} 
                className="bg-white text-primary hover:bg-neutral transition-colors px-8 py-3 rounded-md text-lg inline-flex items-center justify-center"
              >
                <span className="mr-2">📞</span> {contactInfo.customerService}
              </a>
              <a 
                href={`mailto:${contactInfo.email}`} 
                className="bg-primary/20 text-white border border-white hover:bg-primary/30 transition-colors px-8 py-3 rounded-md text-lg inline-flex items-center justify-center"
              >
                <span className="mr-2">✉️</span> 发送邮件
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 