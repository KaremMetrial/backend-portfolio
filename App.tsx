
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import ExperienceTimeline from './components/ExperienceTimeline';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { PerformanceMonitor } from './src/components/PerformanceMonitor';
import { usePerformanceMonitoring } from './src/hooks/usePerformanceMonitoring';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');
  const { collectMetrics } = usePerformanceMonitoring();

  useEffect(() => {
    // Collect initial performance metrics
    collectMetrics();
    
    // Preload critical resources
    const link1 = document.createElement('link');
    link1.rel = 'preload';
    link1.as = 'style';
    link1.href = '/assets/main.css';
    document.head.appendChild(link1);

    const link2 = document.createElement('link');
    link2.rel = 'preload';
    link2.as = 'script';
    link2.href = '/assets/main.js';
    document.head.appendChild(link2);

    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [collectMetrics]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] selection:bg-indigo-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 grid-pattern opacity-30 pointer-events-none -z-10" />
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <Navbar activeSection={activeSection} />
      
      <main className="max-w-7xl mx-auto px-6 lg:px-12">
        <section id="home" className="min-h-screen flex items-center pt-20">
          <Hero />
        </section>

        <section id="about" className="py-24 border-t border-white/5">
          <About />
        </section>

        <section id="skills" className="py-24 border-t border-white/5">
          <Skills />
        </section>

        <section id="projects" className="py-24 border-t border-white/5">
          <Projects />
        </section>

        <section id="experience" className="py-24 border-t border-white/5">
          <ExperienceTimeline />
        </section>

        <section id="contact" className="py-24 border-t border-white/5">
          <Contact />
        </section>
      </main>

      <Footer />
      <PerformanceMonitor />
    </div>
  );
};

export default App;
