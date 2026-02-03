import { useState, useEffect } from 'react';
import { Experience } from '../types';

interface UseExperiencesReturn {
  experiences: Experience[];
  loading: boolean;
  error: string | null;
}

export const useExperiences = (): UseExperiencesReturn => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://127.0.0.1:8000/api/experiences');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform the API response to match our frontend types
        const transformedExperiences: Experience[] = data.data.map((experience: any) => ({
          id: experience.id.toString(),
          role: experience.role,
          company: experience.company,
          period: experience.period,
          description: JSON.parse(experience.description)
        }));
        
        setExperiences(transformedExperiences);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch experiences');
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  return { experiences, loading, error };
};