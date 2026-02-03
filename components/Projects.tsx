
import React from 'react';
import { Project } from '../types';
import { useProjects } from '../hooks/useProjects';

const Projects: React.FC = () => {
  const { projects, loading, error } = useProjects();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-400">Error loading projects: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-16">
        <h2 className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-4 mono">03 // CASE_STUDIES</h2>
        <h3 className="text-4xl font-bold text-white mb-4">Architecture-first approach.</h3>
        <p className="text-neutral-400 max-w-2xl">
          Visualizing backend work is challenging. Here I highlight the logic, data flow, and 
          infrastructure decisions that made these projects successful.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div 
            key={project.id}
            className="group flex flex-col bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/5"
          >
            <div className="relative h-48 overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                {project.techStack.slice(0, 3).map((tech, i) => (
                  <span key={i} className="px-2 py-1 rounded bg-black/50 text-[10px] text-neutral-300 mono backdrop-blur-md border border-white/10">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <h4 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                {project.title}
              </h4>
              <p className="text-neutral-400 text-sm mb-6 leading-relaxed flex-1">
                {project.description}
              </p>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div>
                  <div className="text-[10px] text-neutral-500 uppercase tracking-widest mb-2 mono">Key Endpoints / Specs</div>
                  <ul className="space-y-1">
                    {project.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-[12px] text-neutral-300">
                        <span className="w-1 h-1 bg-indigo-500 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <a 
                    href={project.githubUrl} 
                    className="text-xs font-bold text-neutral-400 hover:text-white flex items-center transition-colors"
                  >
                    GITHUB
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                  </a>
                  <button className="text-[10px] bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-md font-bold mono transition-colors">
                    DETAILS_VIEW
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
