"use client";

import React from 'react';
import Image from 'next/image';
// 使用接口来代替StaticImageData类型
interface ImageSource {
  src: string;
  height: number;
  width: number;
  blurDataURL?: string;
  blurWidth?: number;
  blurHeight?: number;
}

interface ImageFallbackProps {
  src: string | ImageSource;
  fallbackSrc?: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  quality?: number;
  style?: React.CSSProperties;
  sizes?: string;
  onLoad?: () => void;
}

/**
 * 带有回退功能的图片组件，当主图片加载失败时自动显示备用图片
 * 提供更好的用户体验
 */
const ImageFallback = ({
  src,
  fallbackSrc = '/images/placeholder.svg',
  ...props
}: ImageFallbackProps): JSX.Element => {
  const [imgSrc, setImgSrc] = React.useState<string | ImageSource>(src);
  const [error, setError] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  // 当源地址变化时重置状态
  React.useEffect(() => {
    setImgSrc(src);
    setIsLoading(true);
    setError(false);
  }, [src]);

  // 预加载图片检查
  React.useEffect(() => {
    // 确保代码运行在客户端
    if (typeof window !== 'undefined') {
      // 只对字符串类型的src执行预检查
      if (typeof imgSrc === 'string' && !error) {
        const img = new window.Image();
        img.src = imgSrc;
        img.onload = () => {
          setIsLoading(false);
        };
        img.onerror = () => {
          console.warn(`Image failed to load: ${imgSrc}, using fallback`);
          setError(true);
          setImgSrc(fallbackSrc);
        };
      }
    }
  }, [imgSrc, fallbackSrc, error]);

  const handleLoad = (): void => {
    setIsLoading(false);
    if (props.onLoad) {
      props.onLoad();
    }
  };

  const handleError = (): void => {
    console.warn(`Image error occurred: ${imgSrc}, using fallback`);
    setError(true);
    setImgSrc(fallbackSrc);
  };

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <Image
        {...props}
        src={error ? fallbackSrc : imgSrc}
        onError={handleError}
        onLoad={handleLoad}
        className={`${props.className || ''} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      />
    </div>
  );
};

export default ImageFallback; 