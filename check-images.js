/**
 * 图片文件检查脚本
 * 用于检查项目中的图片文件是否为真实的图片文件
 * 识别出伪装成图片的文本文件，帮助修复显示问题
 */

const fs = require('fs');
const path = require('path');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);

// 图片文件扩展名
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico'];

// 图片文件的魔术数字 (文件头部特征字节)
const MAGIC_NUMBERS = {
  jpg: Buffer.from([0xFF, 0xD8, 0xFF]),
  png: Buffer.from([0x89, 0x50, 0x4E, 0x47]),
  gif: Buffer.from([0x47, 0x49, 0x46, 0x38]),
  webp: Buffer.from([0x52, 0x49, 0x46, 0x46]),
  // SVG文件是XML文本，通常以<?xml或<svg开头
  svg: Buffer.from('<svg'),
  svg2: Buffer.from('<?xml'),
};

// 确定文件类型是否匹配扩展名
async function isRealImage(filePath) {
  try {
    const extension = path.extname(filePath).toLowerCase();
    
    // 如果不是常见图片扩展名，直接跳过
    if (!IMAGE_EXTENSIONS.includes(extension)) {
      return { isImage: false, type: 'not-image' };
    }
    
    // 读取文件的前20个字节
    const fd = await fs.promises.open(filePath, 'r');
    const buffer = Buffer.alloc(20);
    await fd.read(buffer, 0, 20, 0);
    await fd.close();
    
    const fileContent = await readFile(filePath, { encoding: 'utf8', flag: 'r' });
    
    // 检查是否为SVG文件
    if (extension === '.svg') {
      const isSvg = buffer.includes(MAGIC_NUMBERS.svg) || buffer.includes(MAGIC_NUMBERS.svg2);
      return { 
        isImage: isSvg, 
        type: isSvg ? 'svg' : 'not-svg',
        content: fileContent.length > 100 ? fileContent.substring(0, 100) + '...' : fileContent
      };
    }
    
    // 检查JPG文件
    if (extension === '.jpg' || extension === '.jpeg') {
      const isJpg = buffer.slice(0, 3).equals(MAGIC_NUMBERS.jpg);
      return { 
        isImage: isJpg, 
        type: isJpg ? 'jpg' : 'not-jpg',
        content: !isJpg ? (fileContent.length > 100 ? fileContent.substring(0, 100) + '...' : fileContent) : null
      };
    }
    
    // 检查PNG文件
    if (extension === '.png') {
      const isPng = buffer.slice(0, 4).equals(MAGIC_NUMBERS.png);
      return { 
        isImage: isPng, 
        type: isPng ? 'png' : 'not-png',
        content: !isPng ? (fileContent.length > 100 ? fileContent.substring(0, 100) + '...' : fileContent) : null
      };
    }
    
    // 检查GIF文件
    if (extension === '.gif') {
      const isGif = buffer.slice(0, 3).equals(MAGIC_NUMBERS.gif);
      return { 
        isImage: isGif, 
        type: isGif ? 'gif' : 'not-gif',
        content: !isGif ? (fileContent.length > 100 ? fileContent.substring(0, 100) + '...' : fileContent) : null
      };
    }
    
    // 检查WebP文件
    if (extension === '.webp') {
      const isWebp = buffer.slice(0, 4).equals(MAGIC_NUMBERS.webp);
      return { 
        isImage: isWebp, 
        type: isWebp ? 'webp' : 'not-webp',
        content: !isWebp ? (fileContent.length > 100 ? fileContent.substring(0, 100) + '...' : fileContent) : null
      };
    }
    
    return { isImage: false, type: 'unknown', content: null };
  } catch (error) {
    return { 
      isImage: false, 
      type: 'error',
      error: error.message
    };
  }
}

// 递归遍历目录
async function scanDirectory(directory, results = { issues: [], valid: [] }) {
  const entries = await readdir(directory, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    
    if (entry.isDirectory()) {
      await scanDirectory(fullPath, results);
    } else if (entry.isFile()) {
      const fileExt = path.extname(entry.name).toLowerCase();
      
      if (IMAGE_EXTENSIONS.includes(fileExt)) {
        const result = await isRealImage(fullPath);
        
        if (!result.isImage) {
          results.issues.push({
            path: fullPath,
            type: result.type,
            content: result.content,
            error: result.error
          });
        } else {
          results.valid.push({
            path: fullPath,
            type: result.type
          });
        }
      }
    }
  }
  
  return results;
}

// 主函数
async function main() {
  const imagesDir = path.join(__dirname, 'public', 'images');
  console.log('开始扫描图片文件目录:', imagesDir);
  
  const results = await scanDirectory(imagesDir);
  
  console.log('\n===== 检测到的图片问题 =====');
  if (results.issues.length === 0) {
    console.log('未发现问题，所有图片文件格式正确！');
  } else {
    console.log(`发现 ${results.issues.length} 个问题：`);
    results.issues.forEach((issue, index) => {
      console.log(`\n${index + 1}. 问题文件: ${issue.path}`);
      console.log(`   问题类型: ${issue.type}`);
      if (issue.content) {
        console.log(`   文件内容: ${issue.content}`);
      }
      if (issue.error) {
        console.log(`   错误信息: ${issue.error}`);
      }
      
      // 推荐修复
      const ext = path.extname(issue.path).toLowerCase();
      if (issue.content && issue.content.includes('<svg')) {
        console.log('   建议修复: 此文件实际是SVG格式，请重命名为.svg扩展名或替换为真实图片');
      } else if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
        console.log('   建议修复: 替换为真实的图片文件，或使用正确的扩展名');
      }
    });
  }
  
  console.log('\n===== 有效图片文件 =====');
  console.log(`发现 ${results.valid.length} 个有效图片文件`);
  
  console.log('\n检查完成！');
}

main().catch(error => {
  console.error('脚本执行出错:', error);
}); 