import { useState, useEffect, useRef } from 'react';
import React from 'react';

interface UseLazyImageReturn {
  isLoaded: boolean;
  isError: boolean;
  imageRef: React.RefObject<HTMLImageElement>;
}

interface UseLazyImageProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export const useLazyImage = (props: UseLazyImageProps): UseLazyImageReturn => {
  const { src, fallbackSrc, alt, width, height } = props;
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    const img = new Image();
    
    // Set dimensions to prevent layout shift
    if (width && height) {
      img.width = width;
      img.height = height;
    }

    img.onload = () => {
      setIsLoaded(true);
    };

    img.onerror = () => {
      setIsError(true);
      // Try fallback if provided
      if (fallbackSrc && fallbackSrc !== src) {
        setCurrentSrc(fallbackSrc);
      }
    };

    img.src = src;

    // Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Start loading when image enters viewport
            if (imageRef.current) {
              imageRef.current.src = currentSrc;
              observer.unobserve(imageRef.current);
            }
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
        threshold: 0.01,
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [src, fallbackSrc, currentSrc, width, height]);

  return { isLoaded, isError, imageRef };
};