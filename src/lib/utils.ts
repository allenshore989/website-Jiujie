import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并类名函数
 * 使用clsx和tailwind-merge来智能合并类名，避免冲突
 * @param inputs 任意数量的类名值，可以是字符串、对象、数组
 * @returns 合并后的类名字符串
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 