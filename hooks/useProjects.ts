import { useState, useEffect } from 'react';
import { Project } from '../types';

interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

export const useProjects = (): UseProjectsReturn => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://127.0.0.1:8000/api/projects');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform the API response to match our frontend types
        const transformedProjects: Project[] = data.data.map((project: any) => ({
          id: project.id.toString(),
          title: project.title,
          description: project.description,
          longDescription: project.long_description,
          techStack: JSON.parse(project.tech_stack),
          features: JSON.parse(project.features),
          architecture: project.architecture,
          githubUrl: project.github_url || undefined,
          liveUrl: project.live_url || undefined,
          image: project.image
        }));
        
        setProjects(transformedProjects);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, loading, error };
};