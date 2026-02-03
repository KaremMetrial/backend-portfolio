
import React from 'react';
import { useHero } from '../hooks/useHero';

const Hero: React.FC = () => {
  const { hero, loading, error } = useHero();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-white text-2xl">Loading hero content...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-400 text-2xl">Error loading hero content: {error}</div>
      </div>
    );
  }

  if (!hero) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-white text-2xl">No hero content available</div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span>Available for New Projects</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            I Architect <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Robust</span> Backend Systems.
          </h1>
        </div>
        
        <p className="text-xl text-neutral-400 leading-relaxed max-w-xl">
          Hi, I'm <span className="text-white font-medium">Alex Rivera</span>. A Backend Engineer specialized in 
          building high-performance, secure, and scalable APIs using <span className="text-indigo-400 mono">PHP & Laravel</span>.
        </p>

        <div className="flex flex-wrap gap-4 pt-4">
          <button 
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-white text-black font-bold rounded-lg transition-transform hover:-translate-y-1 active:scale-95 flex items-center space-x-2"
          >
            <span>View Projects</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
          <button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-neutral-900 text-white font-bold rounded-lg border border-white/10 transition-all hover:bg-neutral-800 hover:border-white/20 active:scale-95"
          >
            Contact Me
          </button>
        </div>

        <div className="flex items-center space-x-8 pt-8">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white">5+</span>
            <span className="text-xs text-neutral-500 uppercase tracking-widest">Years Exp.</span>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white">40+</span>
            <span className="text-xs text-neutral-500 uppercase tracking-widest">Projects</span>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white">100%</span>
            <span className="text-xs text-neutral-500 uppercase tracking-widest">Uptime Focus</span>
          </div>
        </div>
      </div>

      <div className="relative flex justify-center lg:justify-end">
        <div className="relative w-72 h-72 lg:w-96 lg:h-96">
          <div className="absolute inset-0 bg-indigo-600/20 blur-3xl rounded-full"></div>
          <div className="relative z-10 w-full h-full rounded-2xl border border-white/10 overflow-hidden bg-neutral-900 group">
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
             <img 
               src="https://picsum.photos/seed/dev/800/800" 
               alt="Alex Rivera" 
               className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
             />
             <div className="absolute bottom-6 left-6 right-6 p-4 glass rounded-xl border border-white/5">
                <div className="mono text-[10px] text-indigo-400 mb-1 font-bold">CURRENTLY_RUNNING</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-white">php artisan system:health</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 rounded uppercase font-bold">Stable</span>
                </div>
             </div>
          </div>
          {/* Decorative floating elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 border border-white/5 rounded-full flex items-center justify-center animate-spin-slow">
            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
