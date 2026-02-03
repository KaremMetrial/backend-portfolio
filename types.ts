
export interface Skill {
  name: string;
  category: 'Language' | 'Framework' | 'Database' | 'Tools' | 'Concept';
  icon?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  techStack: string[];
  features: string[];
  architecture: string;
  githubUrl?: string;
  liveUrl?: string;
  image: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string[];
}
