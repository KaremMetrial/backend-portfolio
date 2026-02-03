import React, { useState, useRef, useEffect } from 'react';
import { useImageOptimization, useImagePlaceholder, useLazyImageLoading } from '../hooks/useImageOptimization';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  maxWidth?: number;
  maxHeight?: number;
  lazyLoad?: boolean;
  priority?: boolean;
  sizes?: string;
  onLoad?: () => void;
  onError?: (error: string) => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder,
  quality = 80,
  format = 'webp',
  maxWidth = 1200,
  maxHeight = 800,
  lazyLoad = true,
  priority = false,
  sizes,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use image optimization hook
  const { optimizedImage, isLoading, error, preloadImage } = useImageOptimization(src, {
    quality,
    format,
    maxWidth,
    maxHeight,
    lazyLoad: !priority, // Don't lazy load priority images
    placeholder: placeholder || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjNGNEY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+'
  });

  // Generate placeholder if needed
  const { placeholder: generatedPlaceholder } = useImagePlaceholder(
    width || 320,
    height || 200,
    '#f3f4f6'
  );

  // Use lazy loading hook
  const { loadedImages } = useLazyImageLoading();

  // Preload priority images
  useEffect(() => {
    if (priority && src) {
      preloadImage();
    }
  }, [priority, src, preloadImage]);

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Handle image error
  const handleError = (error: string) => {
    setHasError(true);
    onError?.(error);
  };

  // Handle intersection observer for lazy loading
  useEffect(() => {
    if (!lazyLoad || priority || !imgRef.current) return;

    const img = imgRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (optimizedImage?.src) {
              img.src = optimizedImage.src;
              img.srcSet = optimizedImage.srcSet;
              img.sizes = optimizedImage.sizes;
            }
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: '100px 0px',
        threshold: 0.01
      }
    );

    observer.observe(img);
    return () => observer.disconnect();
  }, [lazyLoad, priority, optimizedImage]);

  // Fallback to original src if optimization fails
  useEffect(() => {
    if (error && !hasError) {
      setCurrentSrc(src);
      setHasError(true);
      handleError(error);
    }
  }, [error, hasError, src, handleError]);

  // Set initial src for non-lazy images
  useEffect(() => {
    if (!lazyLoad && !priority && optimizedImage?.src) {
      setCurrentSrc(optimizedImage.src);
    }
  }, [lazyLoad, priority, optimizedImage]);

  // Generate responsive image attributes
  const imgProps = {
    ref: imgRef,
    src: lazyLoad && !priority ? '' : (optimizedImage?.src || currentSrc),
    srcSet: optimizedImage?.srcSet || '',
    sizes: sizes || optimizedImage?.sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    width: optimizedImage?.width || width,
    height: optimizedImage?.height || height,
    alt,
    loading: priority ? 'eager' : (lazyLoad ? 'lazy' : 'eager'),
    onLoad: handleLoad,
    onError: () => handleError('Image failed to load'),
    className: `${className} ${isLoaded ? 'loaded' : 'loading'} ${hasError ? 'error' : ''}`,
    style: {
      opacity: isLoaded ? 1 : 0,
      transition: 'opacity 0.3s ease-in-out',
      backgroundColor: hasError ? '#f3f4f6' : 'transparent'
    } as React.CSSProperties
  };

  return (
    <div 
      ref={containerRef}
      className={`optimized-image-container ${className}`}
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Placeholder */}
      {!isLoaded && !hasError && (
        <div 
          className="image-placeholder"
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {placeholder ? (
            <img src={placeholder} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div 
              dangerouslySetInnerHTML={{ __html: generatedPlaceholder }}
              style={{ width: '100%', height: '100%' }}
            />
          )}
        </div>
      )}

      {/* Loading spinner */}
      {isLoading && !hasError && (
        <div 
          className="loading-spinner"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10
          }}
        />
      )}

      {/* Error state */}
      {hasError && (
        <div 
          className="image-error"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6b7280',
            fontSize: '14px'
          }}
        >
          Failed to load image
        </div>
      )}

      {/* Actual image */}
      <img {...imgProps} />
    </div>
  );
};

// Picture element component for WebP with fallback
export const PictureImage: React.FC<{
  src: string;
  alt: string;
  sources?: Array<{
    srcSet: string;
    type: string;
    media?: string;
  }>;
  fallbackSrc?: string;
  className?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: (error: string) => void;
}> = ({
  src,
  alt,
  sources = [],
  fallbackSrc,
  className = '',
  width,
  height,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = (error: string) => {
    setHasError(true);
    onError?.(error);
  };

  // Default WebP source
  const defaultSources = [
    {
      srcSet: `${src}?f=webp`,
      type: 'image/webp',
    },
    {
      srcSet: fallbackSrc || src,
      type: 'image/jpeg',
    }
  ];

  const allSources = sources.length > 0 ? sources : defaultSources;

  return (
    <picture className={`picture-image ${className}`}>
      {allSources.map((source, index) => (
        <source
          key={index}
          srcSet={source.srcSet}
          type={source.type}
          media={source.media}
        />
      ))}
      <img
        src={fallbackSrc || src}
        alt={alt}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={() => handleError('Picture element failed to load')}
        className={`${isLoaded ? 'loaded' : 'loading'} ${hasError ? 'error' : ''}`}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
          width: width ? `${width}px` : '100%',
          height: height ? `${height}px` : 'auto'
        }}
      />
    </picture>
  );
};

// Background image component
export const BackgroundImage: React.FC<{
  src: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  onLoad?: () => void;
  onError?: (error: string) => void;
}> = ({
  src,
  alt = '',
  className = '',
  style = {},
  placeholder,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageStyle, setImageStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const img = new Image();
    
    img.onload = () => {
      setIsLoaded(true);
      setImageStyle({
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        ...style
      });
      onLoad?.();
    };

    img.onerror = () => {
      setHasError(true);
      onError?.('Background image failed to load');
    };

    img.src = src;
  }, [src, style, onLoad, onError]);

  return (
    <div
      className={`background-image ${className} ${isLoaded ? 'loaded' : 'loading'} ${hasError ? 'error' : ''}`}
      style={{
        ...imageStyle,
        position: 'relative',
        minHeight: '100px',
        backgroundColor: hasError ? '#f3f4f6' : placeholder ? 'transparent' : '#f3f4f6'
      }}
    >
      {placeholder && !isLoaded && !hasError && (
        <img
          src={placeholder}
          alt=""
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0
          }}
        />
      )}
      
      {hasError && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6b7280',
            fontSize: '14px',
            zIndex: 1
          }}
        >
          Failed to load background image
        </div>
      )}
    </div>
  );
};

// Progressive image component
export const ProgressiveImage: React.FC<{
  src: string;
  alt: string;
  placeholderSrc?: string;
  className?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: (error: string) => void;
}> = ({
  src,
  alt,
  placeholderSrc,
  className = '',
  width,
  height,
  onLoad,
  onError
}) => {
  const [currentSrc, setCurrentSrc] = useState(placeholderSrc || src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (placeholderSrc && placeholderSrc !== src) {
      // Load placeholder first
      const placeholderImg = new Image();
      placeholderImg.onload = () => {
        // Then load the actual image
        const mainImg = new Image();
        mainImg.onload = () => {
          setCurrentSrc(src);
          setIsLoaded(true);
          onLoad?.();
        };
        mainImg.onerror = () => {
          setHasError(true);
          onError?.('Progressive image failed to load');
        };
        mainImg.src = src;
      };
      placeholderImg.src = placeholderSrc;
    } else {
      // Load main image directly
      const img = new Image();
      img.onload = () => {
        setIsLoaded(true);
        onLoad?.();
      };
      img.onerror = () => {
        setHasError(true);
        onError?.('Progressive image failed to load');
      };
      img.src = src;
    }
  }, [src, placeholderSrc, onLoad, onError]);

  return (
    <div 
      className={`progressive-image ${className}`}
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <img
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${isLoaded ? 'loaded' : 'loading'} ${hasError ? 'error' : ''}`}
        style={{
          opacity: isLoaded ? 1 : 0.7,
          transition: 'opacity 0.5s ease-in-out',
          filter: isLoaded ? 'none' : 'blur(5px)',
          transform: isLoaded ? 'scale(1)' : 'scale(1.05)',
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
      
      {hasError && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '14px',
            zIndex: 10
          }}
        >
          Failed to load image
        </div>
      )}
    </div>
  );
};