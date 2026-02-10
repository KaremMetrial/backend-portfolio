import { useState, useEffect } from "react";

interface AboutData {
  title: string;
  description: string;
  image: string | null;
  stats: { label: string; value: string }[];
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

        const response = await fetch("http://127.0.0.1:8000/api/about");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        const data = responseData.data;

        // Transform the API response to match our frontend types
        const transformedAbout: AboutData = {
          title: data.title,
          description: data.description,
          image: data.image,
          stats: Array.isArray(data.stats) ? data.stats : [],
        };

        setAbout(transformedAbout);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch about content",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  return { about, loading, error };
};
