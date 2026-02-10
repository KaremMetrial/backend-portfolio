import React from "react";
import { useSkills } from "../hooks/useSkills";

const Skills: React.FC = () => {
  const { skills, loading, error } = useSkills();

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
        <p className="text-red-400">Error loading skills: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h2 className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-4 mono">
            02 // TECH_STACK
          </h2>
          <h3 className="text-4xl font-bold text-white">
            The tools I use to build robust systems.
          </h3>
        </div>
        <div className="text-neutral-500 text-sm mono">
          // Total Expertise: <span className="text-white">High</span>
        </div>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="group p-6 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all duration-300 hover:bg-white/[0.07]"
          >
            <div className="text-[10px] text-neutral-500 mono uppercase tracking-widest mb-2 flex items-center justify-between">
              {skill.category}
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 scale-0 group-hover:scale-100 transition-transform"></div>
            </div>
            <div className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
              {skill.name}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 p-8 glass rounded-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="m18 16 4-4-4-4" />
              <path d="m6 8-4 4 4 4" />
              <path d="m14.5 4-5 16" />
            </svg>
          </div>
          <div>
            <h4 className="text-xl font-bold text-white mb-2">
              Looking for a specific skill?
            </h4>
            <p className="text-neutral-400 max-w-2xl">
              While my core expertise is PHP & Laravel, I am highly adaptable
              and have worked with various technologies including Python
              (FastAPI), Node.js, and Infrastructure as Code (Terraform).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills;
