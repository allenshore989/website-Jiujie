// 为react模块提供声明
declare module 'react' {
  import * as React from 'react';
  export = React;
  export as namespace React;
}

// 为next/link模块提供声明
declare module 'next/link' {
  import { LinkProps as NextLinkProps } from 'next/dist/client/link';
  import React from 'react';

  type LinkProps = NextLinkProps & {
    children?: React.ReactNode;
  };

  const Link: React.FC<LinkProps>;
  export default Link;
}

// 为next/image模块提供声明
declare module 'next/image' {
  import { ImageProps as NextImageProps } from 'next/dist/client/image';
  import React from 'react';

  type ImageProps = NextImageProps & {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    quality?: number;
    priority?: boolean;
    placeholder?: 'blur' | 'empty';
    style?: React.CSSProperties;
    className?: string;
    blurDataURL?: string;
  };

  const Image: React.FC<ImageProps>;
  export default Image;
}

// 自定义组件声明
declare module '@/components/*' {
  import { ComponentType } from 'react';
  const Component: ComponentType<any>;
  export default Component;
}

// 自定义CSS模块声明
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// 自定义SCSS模块声明
declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

// 图片文件声明
declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
} 