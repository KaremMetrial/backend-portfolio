import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  fcp?: number;
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
  tti?: number;
}

interface UsePerformanceMonitoringReturn {
  metrics: PerformanceMetrics;
  loading: boolean;
}

export const usePerformanceMonitoring = (): UsePerformanceMonitoringReturn => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [loading, setLoading] = useState(true);
  const metricsRef = useRef<PerformanceMetrics>({});

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        switch (entry.entryType) {
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              metricsRef.current.fcp = entry.startTime;
              setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
            }
            break;
          case 'largest-contentful-paint':
            metricsRef.current.lcp = entry.startTime;
            setMetrics(prev => ({ ...prev, lcp: entry.startTime }));
            break;
          case 'first-input':
            const firstInputEntry = entry as any;
            if (firstInputEntry.processingStart && firstInputEntry.startTime) {
              metricsRef.current.fid = firstInputEntry.processingStart - firstInputEntry.startTime;
              setMetrics(prev => ({ ...prev, fid: firstInputEntry.processingStart - firstInputEntry.startTime }));
            }
            break;
          case 'layout-shift':
            const layoutShiftEntry = entry as any;
            if (!layoutShiftEntry.hadRecentInput) {
              metricsRef.current.cls = (metricsRef.current.cls || 0) + layoutShiftEntry.value;
              setMetrics(prev => ({ 
                ...prev, 
                cls: (prev.cls || 0) + layoutShiftEntry.value 
              }));
            }
            break;
          case 'navigation':
            const navEntry = entry as any;
            if (navEntry.responseStart && navEntry.requestStart && navEntry.navigationStart) {
              metricsRef.current.ttfb = navEntry.responseStart - navEntry.requestStart;
              metricsRef.current.tti = navEntry.domContentLoadedEventEnd - navEntry.navigationStart;
              setMetrics(prev => ({
                ...prev,
                ttfb: navEntry.responseStart - navEntry.requestStart,
                tti: navEntry.domContentLoadedEventEnd - navEntry.navigationStart,
              }));
            }
            break;
        }
      }
    });

    // Observe different performance metrics
    try {
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
    } catch (e) {
      console.warn('Performance Observer not fully supported:', e);
    }

    // Get navigation timing
    if (performance.getEntriesByType) {
      const navEntries = performance.getEntriesByType('navigation') as any[];
      if (navEntries.length > 0) {
        const navEntry = navEntries[0];
        metricsRef.current.ttfb = navEntry.responseStart - navEntry.requestStart;
        metricsRef.current.tti = navEntry.domContentLoadedEventEnd - navEntry.navigationStart;
        setMetrics(prev => ({
          ...prev,
          ttfb: navEntry.responseStart - navEntry.requestStart,
          tti: navEntry.domContentLoadedEventEnd - navEntry.navigationStart,
        }));
      }
    }

    // Send metrics to analytics (you can replace this with your analytics service)
    const sendMetrics = () => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        Object.entries(metricsRef.current).forEach(([metric, value]) => {
          if (value !== undefined) {
            (window as any).gtag('event', metric, {
              event_category: 'Performance',
              value: Math.round(value as number),
            });
          }
        });
      }
    };

    // Send metrics when page is hidden or unloaded
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        sendMetrics();
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', sendMetrics);

    // Clean up
    return () => {
      observer.disconnect();
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', sendMetrics);
    };
  }, []);

  useEffect(() => {
    // Mark as loaded after initial metrics collection
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return { metrics, loading };
};

// Hook for performance budgets
export const usePerformanceBudget = (budgets: {
  fcp?: number;
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
}) => {
  const { metrics } = usePerformanceMonitoring();
  const [violations, setViolations] = useState<string[]>([]);

  useEffect(() => {
    const newViolations: string[] = [];

    Object.entries(budgets).forEach(([metric, budget]) => {
      const value = metrics[metric as keyof PerformanceMetrics];
      if (value !== undefined && budget !== undefined && value > budget) {
        newViolations.push(`${metric} (${Math.round(value)}ms) exceeded budget (${budget}ms)`);
      }
    });

    setViolations(newViolations);
  }, [metrics, budgets]);

  return { violations, metrics };
};
