
import React, { useState } from 'react';
import { useContact } from '../hooks/useContact';

const Contact: React.FC = () => {
  const { contact, loading, error } = useContact();
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thanks for reaching out! (Demo Only)');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-white text-2xl">Loading contact content...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-400 text-2xl">Error loading contact content: {error}</div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-white text-2xl">No contact content available</div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-16">
      <div>
        <h2 className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-4 mono">05 // LET_S_CONNECT</h2>
        <h3 className="text-4xl font-bold text-white mb-6">Ready to scale your next big project?</h3>
        <p className="text-neutral-400 leading-relaxed mb-12 max-w-md">
          Whether you need a full system overhaul or a specific API integration, I'm here to build 
          high-quality backend solutions that last.
        </p>

        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </div>
            <div>
              <div className="text-xs text-neutral-500 uppercase tracking-widest font-bold">Email Me</div>
              <a href="mailto:alex@rivera.dev" className="text-lg font-bold text-white hover:text-indigo-400 transition-colors">alex@rivera.dev</a>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            </div>
            <div>
              <div className="text-xs text-neutral-500 uppercase tracking-widest font-bold">Open Source</div>
              <a href="https://github.com" target="_blank" className="text-lg font-bold text-white hover:text-indigo-400 transition-colors">github.com/alexrivera</a>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </div>
            <div>
              <div className="text-xs text-neutral-500 uppercase tracking-widest font-bold">Network</div>
              <a href="https://linkedin.com" target="_blank" className="text-lg font-bold text-white hover:text-indigo-400 transition-colors">linkedin.com/in/alexrivera</a>
            </div>
          </div>
        </div>
      </div>

      <div className="glass p-8 rounded-2xl border border-white/10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mono">Your_Name</label>
            <input 
              type="text" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="John Doe"
              value={formState.name}
              onChange={(e) => setFormState({...formState, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mono">Your_Email</label>
            <input 
              type="email" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="john@example.com"
              value={formState.email}
              onChange={(e) => setFormState({...formState, email: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mono">Message_Payload</label>
            <textarea 
              required
              rows={5}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
              placeholder="I have a project idea..."
              value={formState.message}
              onChange={(e) => setFormState({...formState, message: e.target.value})}
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all active:scale-[0.98] shadow-lg shadow-indigo-600/20"
          >
            Send Packet
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
