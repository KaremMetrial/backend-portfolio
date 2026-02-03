import { useState, useEffect, useCallback, useRef } from 'react';

interface BundleInfo {
  name: string;
  size: number;
  loaded: boolean;
  loadTime: number;
  dependencies: string[];
}

interface CodeSplittingOptions {
  threshold?: number;
  priority?: 'high' | 'medium' | 'low';
  preload?: boolean;
  cache?: boolean;
}

export const useCodeSplitting = () => {
  const [bundles, setBundles] = useState<BundleInfo[]>([]);
  const [loadingBundles, setLoadingBundles] = useState<Set<string>>(new Set());
  const [errorBundles, setErrorBundles] = useState<Set<string>>(new Set());
  const bundleRefs = useRef<Map<string, Promise<any>>>(new Map());

  const loadBundle = useCallback(async (
    bundleName: string, 
    importFunction: () => Promise<any>,
    options: CodeSplittingOptions = {}
  ): Promise<any> => {
    const { threshold = 10000, priority = 'medium', preload = false, cache = true } = options;

    if (loadingBundles.has(bundleName) || errorBundles.has(bundleName)) {
      return bundleRefs.current.get(bundleName);
    }

    // Check if already loaded
    const existingBundle = bundles.find(b => b.name === bundleName);
    if (existingBundle && existingBundle.loaded) {
      return Promise.resolve(existingBundle);
    }

    setLoadingBundles(prev => new Set([...prev, bundleName]));

    const startTime = performance.now();

    try {
      const module = await importFunction();
      const loadTime = performance.now() - startTime;

      const bundleInfo: BundleInfo = {
        name: bundleName,
        size: JSON.stringify(module).length,
        loaded: true,
        loadTime,
        dependencies: []
      };

      setBundles(prev => {
        const filtered = prev.filter(b => b.name !== bundleName);
        return [...filtered, bundleInfo];
      });

      setLoadingBundles(prev => {
        const newSet = new Set(prev);
        newSet.delete(bundleName);
        return newSet;
      });

      bundleRefs.current.set(bundleName, Promise.resolve(module));
      return module;

    } catch (error) {
      console.error(`Failed to load bundle ${bundleName}:`, error);
      
      setErrorBundles(prev => new Set([...prev, bundleName]));
      setLoadingBundles(prev => {
        const newSet = new Set(prev);
        newSet.delete(bundleName);
        return newSet;
      });

      throw error;
    }
  }, [bundles, loadingBundles, errorBundles]);

  const preloadBundle = useCallback(async (
    bundleName: string, 
    importFunction: () => Promise<any>
  ) => {
    try {
      await loadBundle(bundleName, importFunction, { preload: true });
    } catch (error) {
      console.warn(`Failed to preload bundle ${bundleName}:`, error);
    }
  }, [loadBundle]);

  const getBundleStatus = useCallback((bundleName: string) => {
    const bundle = bundles.find(b => b.name === bundleName);
    if (!bundle) {
      return { status: 'not-loaded', bundle: null };
    }
    if (loadingBundles.has(bundleName)) {
      return { status: 'loading', bundle };
    }
    if (errorBundles.has(bundleName)) {
      return { status: 'error', bundle };
    }
    return { status: 'loaded', bundle };
  }, [bundles, loadingBundles, errorBundles]);

  const getBundleStats = useCallback(() => {
    const totalSize = bundles.reduce((acc, bundle) => acc + bundle.size, 0);
    const totalLoadTime = bundles.reduce((acc, bundle) => acc + bundle.loadTime, 0);
    const loadedCount = bundles.filter(b => b.loaded).length;
    const loadingCount = loadingBundles.size;
    const errorCount = errorBundles.size;

    return {
      totalBundles: bundles.length,
      loadedBundles: loadedCount,
      loadingBundles: loadingCount,
      errorBundles: errorCount,
      totalSize,
      averageLoadTime: bundles.length > 0 ? totalLoadTime / bundles.length : 0,
      bundles
    };
  }, [bundles, loadingBundles, errorBundles]);

  return {
    loadBundle,
    preloadBundle,
    getBundleStatus,
    getBundleStats,
    bundles,
    loadingBundles: Array.from(loadingBundles),
    errorBundles: Array.from(errorBundles)
  };
};

// Hook for dynamic imports with error handling
export const useDynamicImport = <T = any>(
  importFunction: () => Promise<T>,
  options: {
    fallback?: T;
    retryCount?: number;
    retryDelay?: number;
  } = {}
) => {
  const { fallback, retryCount = 3, retryDelay = 1000 } = options;
  const [module, setModule] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryAttempt, setRetryAttempt] = useState(0);

  const loadModule = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await importFunction();
      setModule(result);
      setLoading(false);
    } catch (err) {
      if (retryAttempt < retryCount) {
        setTimeout(() => {
          setRetryAttempt(prev => prev + 1);
        }, retryDelay);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load module');
        setLoading(false);
        if (fallback) {
          setModule(fallback);
        }
      }
    }
  }, [importFunction, retryAttempt, retryCount, retryDelay, fallback]);

  useEffect(() => {
    loadModule();
  }, [loadModule]);

  const retry = useCallback(() => {
    setRetryAttempt(0);
    loadModule();
  }, [loadModule]);

  return {
    module,
    loading,
    error,
    retry,
    retryAttempt
  };
};

// Hook for route-based code splitting
export const useRouteCodeSplitting = () => {
  const [routeComponents, setRouteComponents] = useState<Map<string, any>>(new Map());
  const [loadingRoutes, setLoadingRoutes] = useState<Set<string>>(new Set());

  const loadRouteComponent = useCallback(async (routePath: string, componentLoader: () => Promise<any>) => {
    if (routeComponents.has(routePath) || loadingRoutes.has(routePath)) {
      return routeComponents.get(routePath);
    }

    setLoadingRoutes(prev => new Set([...prev, routePath]));

    try {
      const component = await componentLoader();
      setRouteComponents(prev => new Map(prev.set(routePath, component)));
      setLoadingRoutes(prev => {
        const newSet = new Set(prev);
        newSet.delete(routePath);
        return newSet;
      });
      return component;
    } catch (error) {
      console.error(`Failed to load route component for ${routePath}:`, error);
      setLoadingRoutes(prev => {
        const newSet = new Set(prev);
        newSet.delete(routePath);
        return newSet;
      });
      throw error;
    }
  }, [routeComponents, loadingRoutes]);

  const preloadRoute = useCallback((routePath: string, componentLoader: () => Promise<any>) => {
    // Preload without waiting
    loadRouteComponent(routePath, componentLoader).catch(console.warn);
  }, [loadRouteComponent]);

  const getRouteComponent = useCallback((routePath: string) => {
    return routeComponents.get(routePath);
  }, [routeComponents]);

  return {
    loadRouteComponent,
    preloadRoute,
    getRouteComponent,
    loadingRoutes: Array.from(loadingRoutes),
    loadedRoutes: Array.from(routeComponents.keys())
  };
};

// Hook for vendor bundle optimization
export const useVendorOptimization = () => {
  const [vendorBundles, setVendorBundles] = useState<Map<string, any>>(new Map());
  const [loadingVendors, setLoadingVendors] = useState<Set<string>>(new Set());

  const loadVendorBundle = useCallback(async (vendorName: string, bundleLoader: () => Promise<any>) => {
    if (vendorBundles.has(vendorName) || loadingVendors.has(vendorName)) {
      return vendorBundles.get(vendorName);
    }

    setLoadingVendors(prev => new Set([...prev, vendorName]));

    try {
      const bundle = await bundleLoader();
      setVendorBundles(prev => new Map(prev.set(vendorName, bundle)));
      setLoadingVendors(prev => {
        const newSet = new Set(prev);
        newSet.delete(vendorName);
        return newSet;
      });
      return bundle;
    } catch (error) {
      console.error(`Failed to load vendor bundle ${vendorName}:`, error);
      setLoadingVendors(prev => {
        const newSet = new Set(prev);
        newSet.delete(vendorName);
        return newSet;
      });
      throw error;
    }
  }, [vendorBundles, loadingVendors]);

  // Preload critical vendor bundles
  const preloadCriticalVendors = useCallback(async () => {
    const criticalVendors = [
      { name: 'react', loader: () => import('react') },
      { name: 'react-dom', loader: () => import('react-dom') }
    ];

    await Promise.all(
      criticalVendors.map(vendor => 
        loadVendorBundle(vendor.name, vendor.loader).catch(console.warn)
      )
    );
  }, [loadVendorBundle]);

  return {
    loadVendorBundle,
    preloadCriticalVendors,
    getVendorBundle: (vendorName: string) => vendorBundles.get(vendorName),
    loadingVendors: Array.from(loadingVendors),
    loadedVendors: Array.from(vendorBundles.keys())
  };
};

// Hook for bundle size monitoring
export const useBundleSizeMonitoring = () => {
  const [bundleSizes, setBundleSizes] = useState<Map<string, number>>(new Map());
  const [totalSize, setTotalSize] = useState(0);

  const recordBundleSize = useCallback((bundleName: string, size: number) => {
    setBundleSizes(prev => new Map(prev.set(bundleName, size)));
    setTotalSize(prev => {
      const existingSize = prev - (bundleSizes.get(bundleName) || 0);
      return existingSize + size;
    });
  }, [bundleSizes]);

  const getBundleSize = useCallback((bundleName: string) => {
    return bundleSizes.get(bundleName) || 0;
  }, [bundleSizes]);

  const getBundleSizes = useCallback(() => {
    return {
      bundles: Object.fromEntries(bundleSizes),
      totalSize,
      averageSize: bundleSizes.size > 0 ? totalSize / bundleSizes.size : 0
    };
  }, [bundleSizes, totalSize]);

  return {
    recordBundleSize,
    getBundleSize,
    getBundleSizes
  };
};

// Hook for tree shaking optimization
export const useTreeShaking = () => {
  const [unusedExports, setUnusedExports] = useState<Set<string>>(new Set());
  const [usedExports, setUsedExports] = useState<Set<string>>(new Set());

  const markExportUsed = useCallback((exportName: string) => {
    setUsedExports(prev => new Set([...prev, exportName]));
    setUnusedExports(prev => {
      const newSet = new Set(prev);
      newSet.delete(exportName);
      return newSet;
    });
  }, []);

  const markExportUnused = useCallback((exportName: string) => {
    setUnusedExports(prev => new Set([...prev, exportName]));
    setUsedExports(prev => {
      const newSet = new Set(prev);
      newSet.delete(exportName);
      return newSet;
    });
  }, []);

  const getTreeShakingStats = useCallback(() => {
    return {
      usedExports: Array.from(usedExports),
      unusedExports: Array.from(unusedExports),
      totalExports: usedExports.size + unusedExports.size,
      unusedPercentage: usedExports.size + unusedExports.size > 0 
        ? (unusedExports.size / (usedExports.size + unusedExports.size)) * 100 
        : 0
    };
  }, [usedExports, unusedExports]);

  return {
    markExportUsed,
    markExportUnused,
    getTreeShakingStats
  };
};

// Hook for lazy loading utilities
export const useLazyLoading = () => {
  const [lazyLoaded, setLazyLoaded] = useState<Set<string>>(new Set());

  const lazyLoad = useCallback(async <T>(
    key: string, 
    loader: () => Promise<T>
  ): Promise<T> => {
    if (lazyLoaded.has(key)) {
      // Return cached result or re-execute loader
      return loader();
    }

    try {
      const result = await loader();
      setLazyLoaded(prev => new Set([...prev, key]));
      return result;
    } catch (error) {
      console.error(`Failed to lazy load ${key}:`, error);
      throw error;
    }
  }, [lazyLoaded]);

  const isLoaded = useCallback((key: string) => {
    return lazyLoaded.has(key);
  }, [lazyLoaded]);

  const clearCache = useCallback(() => {
    setLazyLoaded(new Set());
  }, []);

  return {
    lazyLoad,
    isLoaded,
    clearCache,
    loadedItems: Array.from(lazyLoaded)
  };
};