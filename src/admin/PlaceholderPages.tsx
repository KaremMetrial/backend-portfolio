import React from "react";

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="glass p-8 rounded-xl text-center py-20">
    <h2 className="text-3xl font-bold mb-4">{title}</h2>
    <p className="text-gray-400">This module is under construction.</p>
  </div>
);

export const HeroPage = () => (
  <PlaceholderPage title="Hero Section Management" />
);
export const AboutPage = () => (
  <PlaceholderPage title="About Section Management" />
);
export const ProjectsPage = () => (
  <PlaceholderPage title="Projects Management" />
);
export const ExperiencePage = () => (
  <PlaceholderPage title="Experience Management" />
);
export const ContactPage = () => <PlaceholderPage title="Contact & Messages" />;
export const SettingsPage = () => <PlaceholderPage title="Site Settings" />;
