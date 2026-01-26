import 'react';

declare module 'react' {
  interface ImgHTMLAttributes {
    fetchpriority?: 'high' | 'low' | 'auto';
  }
}
