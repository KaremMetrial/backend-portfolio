import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Briefcase,
  Mail,
  Settings,
  Globe,
  LogOut,
  MessageSquare,
} from "lucide-react";
import clsx from "clsx";

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    navigate("/admin/login");
  };

  const navItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/messages", icon: MessageSquare, label: "Messages" },
    { path: "/admin/hero", icon: Globe, label: "Hero Section" },
    { path: "/admin/about", icon: User, label: "About" },
    { path: "/admin/projects", icon: FolderGit2, label: "Projects" },
    { path: "/admin/skills", icon: Settings, label: "Skills" },
    { path: "/admin/experience", icon: Briefcase, label: "Experience" },
    { path: "/admin/contact", icon: Mail, label: "Contact Info" },
    { path: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900 text-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-black/60 border-r border-white/10 flex-shrink-0 backdrop-blur-xl">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Admin Panel
          </span>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                "flex items-center px-4 py-3 rounded-lg transition-all duration-200 group relative",
                location.pathname === item.path
                  ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                  : "text-gray-400 hover:bg-white/5 hover:text-white",
              )}
            >
              <item.icon
                size={20}
                className={clsx(
                  "mr-3",
                  location.pathname === item.path
                    ? "text-purple-400"
                    : "text-gray-500 group-hover:text-white",
                )}
              />
              <span className="font-medium">{item.label}</span>
              {location.pathname === item.path && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 rounded-r-full"></div>
              )}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-black/40 border-b border-white/10 flex items-center justify-between px-8 backdrop-blur-xl">
          <h1 className="text-lg font-medium text-gray-200">
            {navItems.find((i) => i.path === location.pathname)?.label ||
              "Dashboard"}
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all flex items-center gap-2 text-sm"
              title="Logout"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold border border-purple-500/30">
              A
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;