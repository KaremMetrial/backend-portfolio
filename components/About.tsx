import React from "react";
import { useAbout } from "../hooks/useAbout";

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
        <div className="text-red-400 text-2xl">
          Error loading about content: {error}
        </div>
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
      <div className="lg:col-span-12 mb-8 md:mb-0 lg:col-span-5">
        <h2 className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-4 mono">
          01 // THE_ENGINEER
        </h2>
        <h3 className="text-4xl font-bold text-white mb-6 leading-tight">
          {about.title || "Mastering logic, architecture, and security."}
        </h3>
        <div className="text-neutral-400 mb-8 leading-relaxed whitespace-pre-wrap">
          {about.description ||
            "I don't just write code; I design systems. With over 5 years of experience in the PHP ecosystem, I've developed a deep appreciation for clean code, solid architecture, and efficient data flow."}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {about.stats.slice(0, 2).map((stat, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-white/5 border border-white/5"
            >
              <div className="text-white font-bold mb-1">{stat.label}</div>
              <p className="text-xs text-neutral-500">{stat.value}</p>
            </div>
          ))}
          {!about.stats.length && (
            <>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="text-white font-bold mb-1">Architecture</div>
                <p className="text-xs text-neutral-500">
                  Domain Driven Design & SOLID principles.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="text-white font-bold mb-1">Security</div>
                <p className="text-xs text-neutral-500">
                  OWASP best practices & OAuth2.
                </p>
              </div>
            </>
          )}
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
            <div className="text-[10px] text-neutral-500 mono">
              KaremSabeyMetrial.sh
            </div>
          </div>
          <div className="p-6 flex-1 mono text-sm overflow-auto max-h-[400px]">
            <div className="flex space-x-2 mb-2">
              <span className="text-emerald-400">➜</span>
              <span className="text-indigo-400">~</span>
              <span className="text-white">whoami</span>
            </div>
            <div className="text-neutral-400 mb-6 italic">
              "
              {about.description?.split("\n")[0] ||
                "Dedicated PHP developer with a passion for Laravel and scalable backends."}
              "
            </div>

            <div className="flex space-x-2 mb-2">
              <span className="text-emerald-400">➜</span>
              <span className="text-indigo-400">~</span>
              <span className="text-white">cat expertise.json</span>
            </div>
            <div className="text-neutral-500">
              {`{`} <br />
              &nbsp;&nbsp;<span className="text-purple-400">"focus"</span>:{" "}
              <span className="text-amber-400">"Backend Engineering"</span>,{" "}
              <br />
              &nbsp;&nbsp;<span className="text-purple-400">"stats"</span>:{" "}
              {`{`} <br />
              {about.stats.map((stat, i) => (
                <React.Fragment key={i}>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <span className="text-purple-400">"{stat.label}"</span>:{" "}
                  <span className="text-amber-400">"{stat.value}"</span>
                  {i < about.stats.length - 1 ? "," : ""} <br />
                </React.Fragment>
              ))}
              &nbsp;&nbsp;{`}`} <br />
              {`}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
