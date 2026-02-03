import { useState, useEffect } from 'react';

interface AboutData {
  content: string;
  profileImage: string | null;
  personalDetails: {
    location: string;
    email: string;
    phone?: string;
  };
  funFacts: string[] | null;
}

interface UseAboutReturn {
  about: AboutData | null;
  loading: boolean;
  error: string | null;
}

export const useAbout = (): UseAboutReturn => {
  const [about, setAbout] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://127.0.0.1:8000/api/about');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform the API response to match our frontend types
        // Note: API resources already decode JSON, so no need to parse again
        const transformedAbout: AboutData = {
          content: data.content,
          profileImage: data.profile_image,
          personalDetails: data.personal_details,
          funFacts: data.fun_facts
        };
        
        setAbout(transformedAbout);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch about content');
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  return { about, loading, error };
};