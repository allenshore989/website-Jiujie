// 系统字体配置

// 使用系统字体
const systemFontStack = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
  "Helvetica Neue", Arial, "Noto Sans", sans-serif, 
  "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", 
  "Noto Color Emoji"`;

// 为中文内容使用系统中文字体
const chineseFontStack = `"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", 
  "WenQuanYi Micro Hei", ${systemFontStack}`;

// 使用系统衬线字体作为装饰字体
const decorativeFontStack = `"STKaiti", "KaiTi", "KaiTi_GB2312", ${chineseFontStack}`;

// 使用系统字体作为后备，不从Google加载
export const inter = {
  variable: '--font-inter',
  style: { fontFamily: systemFontStack }
};

// 导出字体CSS变量名
export const notoSansSC = {
  variable: '--font-noto-sans-sc',
  style: { fontFamily: chineseFontStack }
};

export const maShangZheng = {
  variable: '--font-ma-shan-zheng',
  style: { fontFamily: decorativeFontStack }
}; 