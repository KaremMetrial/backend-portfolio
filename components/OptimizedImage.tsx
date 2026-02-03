import React, { useState } from 'react';
import { useLazyImage } from '../hooks/useLazyImage';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackSrc?: string;
  priority?: boolean; // For above-the-fold images
  sizes?: string;
  loading?: 'lazy' | 'eager';
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  fallbackSrc,
  priority = false,
  sizes,
  loading = 'lazy',
}) => {
  const [isError, setIsError] = useState(false);
  const { isLoaded, imageRef } = useLazyImage({
    src: isError && fallbackSrc ? fallbackSrc : src,
    fallbackSrc,
    alt,
    width,
    height,
  });

  const handleImageError = () => {
    if (fallbackSrc && !isError) {
      setIsError(true);
    }
  };

  return (
    <div className={`optimized-image-container ${className || ''}`}>
      {!isLoaded && (
        <div
          className="image-placeholder"
          style={{
            width: width || '100%',
            height: height || 'auto',
            backgroundColor: '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="loading-spinner" />
        </div>
      )}
      
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`optimized-image ${isLoaded ? 'loaded' : 'loading'}`}
        style={{ display: isLoaded ? 'block' : 'none' }}
        onError={handleImageError}
        loading={priority ? 'eager' : loading}
        sizes={sizes}
        decoding="async"
      />
      
      {isError && fallbackSrc && (
        <img
          src={fallbackSrc}
          alt={alt}
          width={width}
          height={height}
          className="fallback-image"
        />
      )}
    </div>
  );
};

// WebP optimized image component with fallback
export const WebPOptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  fallbackSrc,
  priority = false,
  sizes,
  loading = 'lazy',
}) => {
  const [useWebP, setUseWebP] = useState(false);

  // Check if WebP is supported
  React.useEffect(() => {
    const checkWebPSupport = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, 1, 1);
        setUseWebP(canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0);
      }
    };
    checkWebPSupport();
  }, []);

  const webpSrc = useWebP ? src.replace(/\.(jpg|jpeg|png)$/i, '.webp') : src;

  return (
    <picture>
      {useWebP && (
        <source
          srcSet={webpSrc}
          type="image/webp"
          sizes={sizes}
        />
      )}
      <OptimizedImage
        src={fallbackSrc || src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        fallbackSrc={fallbackSrc}
        priority={priority}
        sizes={sizes}
        loading={loading}
      />
    </picture>
  );
};