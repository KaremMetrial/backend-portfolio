
import React from 'react';
import { Experience } from '../types';
import { useExperiences } from '../hooks/useExperiences';

const ExperienceTimeline: React.FC = () => {
  const { experiences, loading, error } = useExperiences();

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
        <p className="text-red-400">Error loading experiences: {error}</p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-12 gap-16">
      <div className="lg:col-span-4">
        <h2 className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-4 mono">04 // CAREER_PATH</h2>
        <h3 className="text-4xl font-bold text-white mb-6">Professional progression.</h3>
        <p className="text-neutral-400 leading-relaxed mb-8">
          A history of delivering enterprise-grade code and solving complex business problems 
          through clean software engineering.
        </p>
        <button className="group text-white font-bold flex items-center space-x-2 border-b-2 border-indigo-500 pb-1 hover:text-indigo-400 transition-colors">
          <span>Download Resume (PDF)</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-y-1 transition-transform"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
        </button>
      </div>

      <div className="lg:col-span-8 space-y-12">
        {experiences.map((exp, index) => (
          <div key={exp.id} className="relative pl-8 border-l border-white/10 group">
            <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-indigo-500 border-4 border-[#0a0a0a] group-hover:scale-150 transition-transform"></div>
            
            <div className="mb-2 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <h4 className="text-xl font-bold text-white">{exp.role}</h4>
              <span className="text-xs font-bold text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-full mono border border-indigo-400/20">
                {exp.period}
              </span>
            </div>
            
            <div className="text-sm font-bold text-neutral-500 mb-4 uppercase tracking-widest">
              {exp.company}
            </div>

            <ul className="space-y-3">
              {exp.description.map((item, i) => (
                <li key={i} className="text-neutral-400 text-sm flex items-start">
                  <span className="text-indigo-500 mr-2 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceTimeline;
