import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import ExperienceTimeline from "./components/ExperienceTimeline";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

// Admin Imports
import AdminLayout from "./src/admin/AdminLayout";
import Dashboard from "./src/admin/Dashboard";
import LoginPage from "./src/admin/pages/LoginPage";
import ProtectedRoute from "./src/admin/components/ProtectedRoute";
import HeroPage from "./src/admin/pages/HeroPage";
import ProjectsPage from "./src/admin/pages/ProjectsPage";
import ExperiencePage from "./src/admin/pages/ExperiencePage";
import SkillsPage from "./src/admin/pages/SkillsPage";
import AboutPage from "./src/admin/pages/AboutPage";
import ContactPage from "./src/admin/pages/ContactPage";
import SettingsPage from "./src/admin/pages/SettingsPage";
import MessagesPage from "./src/admin/pages/MessagesPage";

const Portfolio: React.FC = () => {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    // Simple Scroll spy
    const handleScroll = () => {
      const sections = [
        "home",
        "about",
        "skills",
        "projects",
        "experience",
        "contact",
      ];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Portfolio Route */}
        <Route path="/" element={<Portfolio />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="hero" element={<HeroPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="skills" element={<SkillsPage />} />
            <Route path="experience" element={<ExperiencePage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* 404 Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
