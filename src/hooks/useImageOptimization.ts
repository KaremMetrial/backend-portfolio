import { useState, useEffect, useCallback } from 'react';

interface ImageOptimizationOptions {
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  maxWidth?: number;
  maxHeight?: number;
  lazyLoad?: boolean;
  placeholder?: string;
}

interface OptimizedImage {
  src: string;
  srcSet: string;
  sizes: string;
  width?: number;
  height?: number;
  loading: 'lazy' | 'eager';
  placeholder?: string;
}

export const useImageOptimization = (
  originalSrc: string, 
  options: ImageOptimizationOptions = {}
) => {
  const [optimizedImage, setOptimizedImage] = useState<OptimizedImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    quality = 80,
    format = 'webp',
    maxWidth = 1200,
    maxHeight = 800,
    lazyLoad = true,
    placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjNGNEY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+'
  } = options;

  const generateSrcSet = useCallback((baseSrc: string) => {
    const formats: ('webp' | 'jpeg' | 'png')[] = ['webp', 'jpeg', 'png'];
    const sizes = [320, 640, 768, 1024, 1200, 1920];
    
    const srcSets = formats.map(format => {
      const urls = sizes.map(size => {
        // For external images, we'll use a placeholder optimization service
        // In production, you'd use your own image optimization service
        if (baseSrc.startsWith('http')) {
          return `${baseSrc}?w=${size}&q=${quality}&f=${format}`;
        }
        // For local images, return the original with size query
        return `${baseSrc}?w=${size}&q=${quality}&f=${format}`;
      });
      return urls.join(', ');
    });

    return {
      webp: srcSets[0],
      fallback: srcSets[1]
    };
  }, [quality]);

  const calculateDimensions = useCallback((img: HTMLImageElement) => {
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    
    let width = img.naturalWidth;
    let height = img.naturalHeight;

    if (width > maxWidth) {
      width = maxWidth;
      height = Math.round(maxWidth / aspectRatio);
    }

    if (height > maxHeight) {
      height = maxHeight;
      width = Math.round(maxHeight * aspectRatio);
    }

    return { width, height };
  }, [maxWidth, maxHeight]);

  const optimizeImage = useCallback(async () => {
    if (!originalSrc) return;

    setIsLoading(true);
    setError(null);

    try {
      // Create image to get natural dimensions
      const img = new Image();
      
      img.onload = () => {
        const { width, height } = calculateDimensions(img);
        const srcSet = generateSrcSet(originalSrc);

        const optimized: OptimizedImage = {
          src: originalSrc,
          srcSet: `${srcSet.webp} 1x, ${srcSet.fallback} 2x`,
          sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
          width,
          height,
          loading: lazyLoad ? 'lazy' : 'eager',
          placeholder
        };

        setOptimizedImage(optimized);
        setIsLoading(false);
      };

      img.onerror = () => {
        setError('Failed to load image');
        setIsLoading(false);
      };

      img.src = originalSrc;

    } catch (err) {
      setError('Image optimization failed');
      setIsLoading(false);
    }
  }, [originalSrc, calculateDimensions, generateSrcSet, lazyLoad, placeholder]);

  useEffect(() => {
    optimizeImage();
  }, [optimizeImage]);

  const preloadImage = useCallback(() => {
    if (!originalSrc) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = originalSrc;
    document.head.appendChild(link);
  }, [originalSrc]);

  const getWebPUrl = useCallback((src: string, width?: number) => {
    if (!src) return '';
    
    const w = width || maxWidth;
    return `${src}?w=${w}&q=${quality}&f=webp`;
  }, [maxWidth, quality]);

  const getJPEGUrl = useCallback((src: string, width?: number) => {
    if (!src) return '';
    
    const w = width || maxWidth;
    return `${src}?w=${w}&q=${quality}&f=jpeg`;
  }, [maxWidth, quality]);

  return {
    optimizedImage,
    isLoading,
    error,
    preloadImage,
    getWebPUrl,
    getJPEGUrl,
    regenerate: optimizeImage
  };
};

// Hook for responsive images
export const useResponsiveImages = (images: string[]) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    const totalImages = images.length;

    const loadNextImage = () => {
      if (currentIndex >= totalImages) {
        setIsLoaded(true);
        return;
      }

      const img = new Image();
      img.onload = () => {
        setCurrentImageIndex(currentIndex + 1);
        loadNextImage();
      };
      img.src = images[currentIndex];
    };

    loadNextImage();
  }, [images]);

  return {
    currentImageIndex,
    isLoaded,
    totalImages: images.length,
    progress: isLoaded ? 100 : Math.round((currentImageIndex / images.length) * 100)
  };
};

// Hook for image caching
export const useImageCache = () => {
  const [cachedImages, setCachedImages] = useState<Set<string>>(new Set());

  const cacheImage = useCallback(async (src: string) => {
    if (cachedImages.has(src)) return true;

    try {
      const response = await fetch(src, { mode: 'no-cors' });
      if (response.ok || response.type === 'opaque') {
        setCachedImages(prev => new Set([...prev, src]));
        return true;
      }
    } catch (error) {
      console.warn('Failed to cache image:', src, error);
    }

    return false;
  }, [cachedImages]);

  const isCached = useCallback((src: string) => {
    return cachedImages.has(src);
  }, [cachedImages]);

  return {
    cacheImage,
    isCached,
    cachedImages: Array.from(cachedImages)
  };
};

// Hook for image compression
export const useImageCompression = () => {
  const compressImage = useCallback(async (
    file: File, 
    quality: number = 0.8,
    maxWidth: number = 1920,
    maxHeight: number = 1080
  ): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw image on canvas with new dimensions
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert to blob
        canvas.toBlob(
          (blob) => resolve(blob),
          'image/webp',
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }, []);

  return { compressImage };
};

// Hook for image placeholders
export const useImagePlaceholder = (width: number, height: number, color: string = '#f3f4f6') => {
  const generatePlaceholder = useCallback(() => {
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${color}"/>
        <circle cx="${width/2}" cy="${height/2}" r="${Math.min(width, height) / 4}" fill="${color === '#f3f4f6' ? '#e5e7eb' : '#9ca3af'}" opacity="0.5"/>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }, [width, height, color]);

  return { placeholder: generatePlaceholder() };
};

// Hook for image lazy loading with Intersection Observer
export const useLazyImageLoading = () => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.dataset.src;
            
            if (src && !loadedImages.has(src)) {
              img.src = src;
              img.removeAttribute('data-src');
              setLoadedImages(prev => new Set([...prev, src]));
              observer.unobserve(img);
            }
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01
      }
    );

    // Observe all images with data-src attribute
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => observer.observe(img));

    return () => {
      observer.disconnect();
    };
  }, [loadedImages]);

  return { loadedImages: Array.from(loadedImages) };
};