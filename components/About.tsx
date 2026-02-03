
import React from 'react';
import { useAbout } from '../hooks/useAbout';

const About: React.FC = () => {
  const { about, loading, error } = useAbout();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-white text-2xl">Loading about content...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-400 text-2xl">Error loading about content: {error}</div>
      </div>
    );
  }

  if (!about) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-white text-2xl">No about content available</div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-12 gap-16 items-start">
      <div className="lg:col-span-5">
        <h2 className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-4 mono">01 // THE_ENGINEER</h2>
        <h3 className="text-4xl font-bold text-white mb-6">Mastering logic, architecture, and security.</h3>
        <p className="text-neutral-400 mb-6 leading-relaxed">
          I don't just write code; I design systems. With over 5 years of experience in the PHP ecosystem, 
          I've developed a deep appreciation for clean code, solid architecture, and efficient data flow.
        </p>
        <p className="text-neutral-400 mb-8 leading-relaxed">
          My focus lies in building the invisible foundation that powers great user experiences. 
          From complex database schemas to distributed messaging systems, I ensure your application 
          is built to scale from day one.
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <div className="text-white font-bold mb-1">Architecture</div>
            <p className="text-xs text-neutral-500">Domain Driven Design & SOLID principles.</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <div className="text-white font-bold mb-1">Security</div>
            <p className="text-xs text-neutral-500">OWASP best practices & OAuth2.</p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-7 h-full">
        <div className="w-full h-full bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
          <div className="bg-neutral-800 px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
            </div>
            <div className="text-[10px] text-neutral-500 mono">backend_architect.sh</div>
          </div>
          <div className="p-6 flex-1 mono text-sm overflow-auto">
            <div className="flex space-x-2 mb-2">
              <span className="text-emerald-400">➜</span>
              <span className="text-indigo-400">~</span>
              <span className="text-white">whoami</span>
            </div>
            <div className="text-neutral-400 mb-6">
              "Dedicated PHP developer with a passion for Laravel and scalable backends. 
              Always curious about performance optimization and systems engineering."
            </div>

            <div className="flex space-x-2 mb-2">
              <span className="text-emerald-400">➜</span>
              <span className="text-indigo-400">~</span>
              <span className="text-white">cat expertise.json</span>
            </div>
            <div className="text-neutral-500">
              {`{`} <br />
              &nbsp;&nbsp;<span className="text-purple-400">"focus"</span>: <span className="text-amber-400">"Backend Engineering"</span>, <br />
              &nbsp;&nbsp;<span className="text-purple-400">"stack"</span>: [<span className="text-amber-400">"PHP"</span>, <span className="text-amber-400">"Laravel"</span>, <span className="text-amber-400">"MySQL"</span>, <span className="text-amber-400">"Redis"</span>], <br />
              &nbsp;&nbsp;<span className="text-purple-400">"principles"</span>: [<span className="text-amber-400">"DRY"</span>, <span className="text-amber-400">"KISS"</span>, <span className="text-amber-400">"SOLID"</span>], <br />
              &nbsp;&nbsp;<span className="text-purple-400">"hobbies"</span>: [<span className="text-amber-400">"Open Source"</span>, <span className="text-amber-400">"Writing Tech Blogs"</span>] <br />
              {`}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
