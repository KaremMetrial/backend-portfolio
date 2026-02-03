import { useState, useEffect } from 'react';
import { Skill } from '../types';

interface UseSkillsReturn {
  skills: Skill[];
  loading: boolean;
  error: string | null;
}

export const useSkills = (): UseSkillsReturn => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://127.0.0.1:8000/api/skills');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform the API response to match our frontend types
        const transformedSkills: Skill[] = data.data.map((skill: any) => ({
          name: skill.name,
          category: skill.category as Skill['category'],
          icon: skill.icon || undefined
        }));
        
        setSkills(transformedSkills);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch skills');
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  return { skills, loading, error };
};