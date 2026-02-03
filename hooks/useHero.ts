import { useState, useEffect } from 'react';

interface HeroData {
  name: string;
  title: string;
  subtitle: string;
  description: string;
  heroImage: string | null;
  backgroundImages: any | null;
  stats: {
    yearsExp: number;
    projects: number;
    uptime: string;
  };
  ctaButtons: {
    viewProjects: string;
    contactMe: string;
  };
}

interface UseHeroReturn {
  hero: HeroData | null;
  loading: boolean;
  error: string | null;
}

export const useHero = (): UseHeroReturn => {
  const [hero, setHero] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://127.0.0.1:8000/api/hero');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform the API response to match our frontend types
        // Note: API resources already decode JSON, so no need to parse again
        const transformedHero: HeroData = {
          name: data.name,
          title: data.title,
          subtitle: data.subtitle,
          description: data.description,
          heroImage: data.hero_image,
          backgroundImages: data.background_images,
          stats: data.stats,
          ctaButtons: data.cta_buttons
        };
        
        setHero(transformedHero);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch hero content');
      } finally {
        setLoading(false);
      }
    };

    fetchHero();
  }, []);

  return { hero, loading, error };
};