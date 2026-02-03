import { useState, useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
  fcp: number;
  tti: number;
  dnsLookup: number;
  tcpConnect: number;
  sslNegotiation: number;
  serverResponse: number;
  domParse: number;
  resourceLoad: number;
  totalLoadTime: number;
  bundleSize: number;
  cacheHitRate: number;
  memoryUsage: number;
  cpuUsage: number;
}

export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [alerts, setAlerts] = useState<any[]>([]);

  const collectMetrics = useCallback(async () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    // Simplified metrics collection
    const lcpEntry = performance.getEntriesByType('largest-contentful-paint')[0];
    const lcp = lcpEntry ? lcpEntry.startTime : 0;
    
    const fidEntry = performance.getEntriesByType('first-input')[0] as any;
    const fid = fidEntry ? fidEntry.processingStart - fidEntry.startTime : 0;
    
    let cls = 0;
    const clsEntries = performance.getEntriesByType('layout-shift');
    clsEntries.forEach((entry: any) => {
      if (!entry.hadRecentInput) {
        cls += entry.value;
      }
    });

    const newMetrics: PerformanceMetrics = {
      lcp,
      fid,
      cls,
      ttfb: 0,
      fcp: 0,
      tti: 0,
      dnsLookup: 0,
      tcpConnect: 0,
      sslNegotiation: 0,
      serverResponse: 0,
      domParse: 0,
      resourceLoad: 0,
      totalLoadTime: 0,
      bundleSize: 0,
      cacheHitRate: 0,
      memoryUsage: 0,
      cpuUsage: 0
    };

    setMetrics(newMetrics);
    return newMetrics;
  }, []);

  const getPerformanceScore = useCallback((metrics: PerformanceMetrics) => {
    let score = 100;

    // Deduct points based on performance
    if (metrics.lcp > 2500) score -= 20;
    if (metrics.fid > 100) score -= 15;
    if (metrics.cls > 0.1) score -= 15;
    if (metrics.ttfb > 800) score -= 10;

    return Math.max(0, score);
  }, []);

  return {
    metrics,
    alerts,
    collectMetrics,
    getPerformanceScore,
    setAlerts
  };
};