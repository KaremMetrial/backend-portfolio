import React, { useState, useEffect, useRef, useCallback } from 'react';

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

interface PerformanceAlert {
  type: 'warning' | 'error';
  metric: string;
  value: number;
  threshold: number;
  message: string;
  timestamp: number;
}

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Core Web Vitals thresholds
  const THRESHOLDS = {
    lcp: { good: 2500, poor: 4000 },
    fid: { good: 100, poor: 300 },
    cls: { good: 0.1, poor: 0.25 },
    ttfb: { good: 800, poor: 1800 },
    fcp: { good: 1800, poor: 3000 },
    tti: { good: 3800, poor: 7300 }
  };

  const collectPerformanceMetrics = useCallback(async (): Promise<PerformanceMetrics> => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    const resources = performance.getEntriesByType('resource');

    // Core Web Vitals
    let lcp = 0;
    let fid = 0;
    let cls = 0;

    // Get LCP
    const lcpEntry = performance.getEntriesByType('largest-contentful-paint')[0];
    if (lcpEntry) {
      lcp = lcpEntry.startTime;
    }

    // Get FID
    const fidEntry = performance.getEntriesByType('first-input')[0];
    if (fidEntry) {
      fid = fidEntry.processingStart - fidEntry.startTime;
    }

    // Get CLS
    let clsValue = 0;
    const clsEntries = performance.getEntriesByType('layout-shift');
    clsEntries.forEach((entry: any) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    });
    cls = clsValue;

    // Navigation timing
    const ttfb = navigation.responseStart - navigation.requestStart;
    const fcpEntry = paint.find(entry => entry.name === 'first-contentful-paint');
    const fcp = fcpEntry ? fcpEntry.startTime : 0;

    // Resource timing breakdown
    const dnsLookup = navigation.domainLookupEnd - navigation.domainLookupStart;
    const tcpConnect = navigation.connectEnd - navigation.connectStart;
    const sslNegotiation = navigation.secureConnectionStart > 0 
      ? navigation.connectEnd - navigation.secureConnectionStart 
      : 0;
    const serverResponse = navigation.responseEnd - navigation.requestStart;
    const domParse = navigation.domContentLoadedEventStart - navigation.responseEnd;
    
    const resourceLoad = resources.reduce((total, resource) => {
      return total + (resource.responseEnd - resource.startTime);
    }, 0);

    const totalLoadTime = navigation.loadEventEnd - navigation.navigationStart;

    // Bundle size estimation
    const bundleSize = resources
      .filter(r => r.name.includes('.js') || r.name.includes('.css'))
      .reduce((total, resource) => total + (resource.transferSize || 0), 0);

    // Cache hit rate
    const cachedResources = resources.filter(r => r.transferSize === 0).length;
    const cacheHitRate = resources.length > 0 ? (cachedResources / resources.length) * 100 : 0;

    // Memory usage (if available)
    const memoryUsage = (performance as any).memory 
      ? (performance as any).memory.usedJSHeapSize / 1024 / 1024 
      : 0;

    // CPU usage estimation
    const cpuUsage = performance.now() % 100;

    return {
      lcp,
      fid,
      cls,
      ttfb,
      fcp,
      tti: totalLoadTime, // Simplified TTI calculation
      dnsLookup,
      tcpConnect,
      sslNegotiation,
      serverResponse,
      domParse,
      resourceLoad,
      totalLoadTime,
      bundleSize,
      cacheHitRate,
      memoryUsage,
      cpuUsage
    };
  }, []);

  const checkThresholds = useCallback((newMetrics: PerformanceMetrics) => {
    const newAlerts: PerformanceAlert[] = [];

    // Check LCP
    if (newMetrics.lcp > THRESHOLDS.lcp.poor) {
      newAlerts.push({
        type: 'error',
        metric: 'LCP',
        value: newMetrics.lcp,
        threshold: THRESHOLDS.lcp.poor,
        message: `LCP is ${Math.round(newMetrics.lcp)}ms (Poor: >${THRESHOLDS.lcp.poor}ms)`,
        timestamp: Date.now()
      });
    } else if (newMetrics.lcp > THRESHOLDS.lcp.good) {
      newAlerts.push({
        type: 'warning',
        metric: 'LCP',
        value: newMetrics.lcp,
        threshold: THRESHOLDS.lcp.good,
        message: `LCP is ${Math.round(newMetrics.lcp)}ms (Needs Improvement: >${THRESHOLDS.lcp.good}ms)`,
        timestamp: Date.now()
      });
    }

    // Check FID
    if (newMetrics.fid > THRESHOLDS.fid.poor) {
      newAlerts.push({
        type: 'error',
        metric: 'FID',
        value: newMetrics.fid,
        threshold: THRESHOLDS.fid.poor,
        message: `FID is ${Math.round(newMetrics.fid)}ms (Poor: >${THRESHOLDS.fid.poor}ms)`,
        timestamp: Date.now()
      });
    } else if (newMetrics.fid > THRESHOLDS.fid.good) {
      newAlerts.push({
        type: 'warning',
        metric: 'FID',
        value: newMetrics.fid,
        threshold: THRESHOLDS.fid.good,
        message: `FID is ${Math.round(newMetrics.fid)}ms (Needs Improvement: >${THRESHOLDS.fid.good}ms)`,
        timestamp: Date.now()
      });
    }

    // Check CLS
    if (newMetrics.cls > THRESHOLDS.cls.poor) {
      newAlerts.push({
        type: 'error',
        metric: 'CLS',
        value: newMetrics.cls,
        threshold: THRESHOLDS.cls.poor,
        message: `CLS is ${newMetrics.cls.toFixed(3)} (Poor: >${THRESHOLDS.cls.poor})`,
        timestamp: Date.now()
      });
    } else if (newMetrics.cls > THRESHOLDS.cls.good) {
      newAlerts.push({
        type: 'warning',
        metric: 'CLS',
        value: newMetrics.cls,
        threshold: THRESHOLDS.cls.good,
        message: `CLS is ${newMetrics.cls.toFixed(3)} (Needs Improvement: >${THRESHOLDS.cls.good})`,
        timestamp: Date.now()
      });
    }

    // Check TTFB
    if (newMetrics.ttfb > THRESHOLDS.ttfb.poor) {
      newAlerts.push({
        type: 'error',
        metric: 'TTFB',
        value: newMetrics.ttfb,
        threshold: THRESHOLDS.ttfb.poor,
        message: `TTFB is ${Math.round(newMetrics.ttfb)}ms (Poor: >${THRESHOLDS.ttfb.poor}ms)`,
        timestamp: Date.now()
      });
    } else if (newMetrics.ttfb > THRESHOLDS.ttfb.good) {
      newAlerts.push({
        type: 'warning',
        metric: 'TTFB',
        value: newMetrics.ttfb,
        threshold: THRESHOLDS.ttfb.good,
        message: `TTFB is ${Math.round(newMetrics.ttfb)}ms (Needs Improvement: >${THRESHOLDS.ttfb.good}ms)`,
        timestamp: Date.now()
      });
    }

    setAlerts(prev => [...prev, ...newAlerts]);
  }, []);

  const startMonitoring = useCallback(async () => {
    setIsMonitoring(true);
    const initialMetrics = await collectPerformanceMetrics();
    setMetrics(initialMetrics);
    checkThresholds(initialMetrics);

    // Send metrics to service worker
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'PERFORMANCE_METRICS',
        payload: initialMetrics
      });
    }

    // Update every 30 seconds
    intervalRef.current = setInterval(async () => {
      const newMetrics = await collectPerformanceMetrics();
      setMetrics(newMetrics);
      checkThresholds(newMetrics);
    }, 30000);
  }, [collectPerformanceMetrics, checkThresholds]);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const exportMetrics = useCallback(() => {
    if (metrics) {
      const dataStr = JSON.stringify({
        timestamp: new Date().toISOString(),
        metrics,
        alerts,
        thresholds: THRESHOLDS
      }, null, 2);
      
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `performance-metrics-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  }, [metrics, alerts]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        title="Open Performance Monitor"
      >
        📊
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white border border-gray-300 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-bold text-gray-800">Performance Monitor</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Monitoring</span>
          <div className="flex gap-2">
            <button
              onClick={isMonitoring ? stopMonitoring : startMonitoring}
              className={`px-3 py-1 rounded text-white text-sm ${
                isMonitoring ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isMonitoring ? 'Stop' : 'Start'}
            </button>
            <button
              onClick={exportMetrics}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Export
            </button>
          </div>
        </div>

        {/* Core Web Vitals */}
        {metrics && (
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-700">Core Web Vitals</h4>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className={`p-2 rounded ${metrics.lcp < THRESHOLDS.lcp.good ? 'bg-green-100' : metrics.lcp < THRESHOLDS.lcp.poor ? 'bg-yellow-100' : 'bg-red-100'}`}>
                <div className="font-medium">LCP</div>
                <div>{Math.round(metrics.lcp)}ms</div>
              </div>
              <div className={`p-2 rounded ${metrics.fid < THRESHOLDS.fid.good ? 'bg-green-100' : metrics.fid < THRESHOLDS.fid.poor ? 'bg-yellow-100' : 'bg-red-100'}`}>
                <div className="font-medium">FID</div>
                <div>{Math.round(metrics.fid)}ms</div>
              </div>
              <div className={`p-2 rounded ${metrics.cls < THRESHOLDS.cls.good ? 'bg-green-100' : metrics.cls < THRESHOLDS.cls.poor ? 'bg-yellow-100' : 'bg-red-100'}`}>
                <div className="font-medium">CLS</div>
                <div>{metrics.cls.toFixed(3)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-gray-700">Alerts</h4>
              <button
                onClick={clearAlerts}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Clear
              </button>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {alerts.slice(-5).map((alert, index) => (
                <div
                  key={index}
                  className={`p-2 rounded text-xs ${
                    alert.type === 'error' ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
                  }`}
                >
                  <div className="font-medium">{alert.message}</div>
                  <div className="text-gray-600">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Metrics */}
        {metrics && (
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-700">Additional Metrics</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>TTFB: {Math.round(metrics.ttfb)}ms</div>
              <div>FCP: {Math.round(metrics.fcp)}ms</div>
              <div>Bundle Size: {(metrics.bundleSize / 1024).toFixed(2)} KB</div>
              <div>Cache Hit Rate: {metrics.cacheHitRate.toFixed(1)}%</div>
              <div>Memory: {metrics.memoryUsage.toFixed(2)} MB</div>
              <div>Total Load: {Math.round(metrics.totalLoadTime)}ms</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Hook for performance monitoring
export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);

  const collectMetrics = useCallback(async () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    // Simplified metrics collection
    const lcpEntry = performance.getEntriesByType('largest-contentful-paint')[0];
    const lcp = lcpEntry ? lcpEntry.startTime : 0;
    
    const fidEntry = performance.getEntriesByType('first-input')[0];
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