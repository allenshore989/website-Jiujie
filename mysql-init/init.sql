-- 创建易经设计网站数据库初始化脚本

-- 设置字符集
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- 使用数据库
USE yijingdb;

-- 创建示例表结构
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contact_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    customer_service VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    business_email VARCHAR(100) NOT NULL,
    working_hours TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS branch_offices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS faqs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'general',
    ordering INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 插入初始联系信息
INSERT INTO contact_info (address, phone, customer_service, email, business_email, working_hours)
VALUES (
    '北京市朝阳区建国路88号',
    '010-12345678',
    '400-888-9999',
    'contact@yijingdesign.cn',
    'business@yijingdesign.cn',
    '周一至周五: 9:00 - 18:00\n周六: 10:00 - 16:00\n周日: 休息'
);

-- 插入初始管理员账户（密码需要根据实际情况进行散列处理）
-- 以下密码仅为示例，生产环境中请务必更改密码并使用适当的散列算法
INSERT INTO users (username, email, password, role)
VALUES ('admin', 'admin@yijingdesign.cn', 'change_this_password', 'admin');

-- 插入分支机构初始数据
INSERT INTO branch_offices (city, address, phone, email) VALUES
('北京总部', '朝阳区建国路88号', '010-12345678', 'beijing@yijingdesign.cn'),
('上海分部', '浦东新区陆家嘴金融中心', '021-87654321', 'shanghai@yijingdesign.cn'),
('广州分部', '天河区珠江新城', '020-56781234', 'guangzhou@yijingdesign.cn'),
('成都分部', '锦江区红星路', '028-98765432', 'chengdu@yijingdesign.cn'),
('深圳分部', '南山区科技园', '0755-23456789', 'shenzhen@yijingdesign.cn'),
('杭州分部', '西湖区文三路', '0571-87654321', 'hangzhou@yijingdesign.cn');

-- 插入FAQ初始数据
INSERT INTO faqs (question, answer, category) VALUES
('易经环境设计服务流程是怎样的？', '我们的服务流程通常包括：初步咨询、现场勘察、方案设计、实施指导和后续跟进。整个过程中，我们会与客户保持密切沟通，确保设计方案符合客户期望并取得实际效果。', 'service'),
('需要亲自到现场勘察吗，还是可以远程提供服务？', '我们推荐现场勘察以获取最准确的环境信息，但也提供远程咨询服务。远程服务需要客户提供详细的空间图片、平面图和相关信息，我们会基于这些资料提供专业建议。', 'service'),
('改变住宅或办公空间的风水需要大规模装修吗？', '不一定。很多风水优化可以通过调整家具布局、更换装饰品、添加特定元素等小改动实现。我们会根据具体情况提供最经济实用的方案，尽量避免不必要的大规模装修。', 'implementation'),
('服务费用是如何计算的？', '我们的服务费用根据项目类型、空间大小和服务内容有所不同。一般包括咨询费、方案设计费和实施指导费。您可以联系我们获取详细的报价单。', 'pricing'),
('易经风水设计与普通室内设计有什么区别？', '易经风水设计在注重美观和功能性的同时，更关注空间的能量流动、五行平衡和对居住者的影响。我们会根据易经原理和客户个人的生辰八字，设计更加和谐、平衡的生活或工作环境。', 'concept'); 