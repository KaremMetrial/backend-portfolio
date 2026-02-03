import { useState, useEffect } from 'react';

interface SiteConfigData {
  siteTitle: string;
  metaDescription: string | null;
  themeColors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  footerContent: string;
  navbarItems: {
    label: string;
    href: string;
    order: number;
  }[];
}

interface UseSiteConfigReturn {
  siteConfig: SiteConfigData | null;
  loading: boolean;
  error: string | null;
}

export const useSiteConfig = (): UseSiteConfigReturn => {
  const [siteConfig, setSiteConfig] = useState<SiteConfigData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSiteConfig = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://127.0.0.1:8000/api/site-config');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform the API response to match our frontend types
        // Note: API resources already decode JSON, so no need to parse again
        const transformedSiteConfig: SiteConfigData = {
          siteTitle: data.site_title,
          metaDescription: data.meta_description,
          themeColors: data.theme_colors,
          footerContent: data.footer_content,
          navbarItems: data.navbar_items
        };
        
        setSiteConfig(transformedSiteConfig);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch site configuration');
      } finally {
        setLoading(false);
      }
    };

    fetchSiteConfig();
  }, []);

  return { siteConfig, loading, error };
};