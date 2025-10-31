'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Package } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  fallbackSrc?: string;
}

export default function SafeImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className = '',
  sizes,
  fallbackSrc = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center'
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  if (hasError && imgSrc === fallbackSrc) {
    // If even the fallback fails, show a placeholder
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <Package className="w-8 h-8 text-gray-400" />
      </div>
    );
  }

  const imageProps = {
    src: imgSrc,
    alt,
    className,
    onError: handleError,
    ...(sizes && { sizes }),
  };

  if (fill) {
    return <Image {...imageProps} fill />;
  }

  return (
    <Image
      {...imageProps}
      width={width || 400}
      height={height || 300}
    />
  );
}
