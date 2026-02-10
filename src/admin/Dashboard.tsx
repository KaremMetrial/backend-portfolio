import React, { useState, useEffect } from "react";
import { Users, Eye, Code, Activity, Mail, MailOpen, Briefcase, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import api from "./utils/api";

interface DashboardStats {
  projects: number;
  skills: number;
  experiences: number;
  messages: number;
  unreadMessages: number;
}

interface RecentMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const StatCard = ({ title, value, icon: Icon, color, link }: any) => {
  const content = (
    <div className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-all duration-300 hover:border-purple-500/30 group cursor-pointer">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="text-2xl font-bold mt-2 text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-${color}-500/10 text-${color}-400 group-hover:scale-110 transition-transform`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );

  return link ? <Link to={link}>{content}</Link> : content;
};

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    skills: 0,
    experiences: 0,
    messages: 0,
    unreadMessages: 0,
  });
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [projectsRes, skillsRes, experiencesRes, messagesRes] = await Promise.all([
        api.get("/projects"),
        api.get("/skills"),
        api.get("/experiences"),
        api.get("/contact-messages"),
      ]);

      const projects = projectsRes.data.data || [];
      const skills = skillsRes.data.data || [];
      const experiences = experiencesRes.data.data || [];
      const messages = messagesRes.data.data || [];

      setStats({
        projects: projects.length,
        skills: skills.length,
        experiences: experiences.length,
        messages: messages.length,
        unreadMessages: messages.filter((m: any) => !m.is_read).length,
      });

      // Get 5 most recent messages
      setRecentMessages(messages.slice(0, 5));
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-gray-600 bg-clip-text text-transparent">
        Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Projects"
          value={stats.projects}
          icon={Code}
          color="blue"
          link="/admin/projects"
        />
        <StatCard
          title="Skills"
          value={stats.skills}
          icon={Wrench}
          color="green"
          link="/admin/skills"
        />
        <StatCard
          title="Experiences"
          value={stats.experiences}
          icon={Briefcase}
          color="purple"
          link="/admin/experience"
        />
        <StatCard
          title="Messages"
          value={stats.messages}
          icon={Mail}
          color="indigo"
          link="/admin/messages"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Messages</h3>
            {stats.unreadMessages > 0 && (
              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                {stats.unreadMessages} unread
              </span>
            )}
          </div>
          <div className="space-y-4">
            {recentMessages.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Mail size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No messages yet</p>
              </div>
            ) : (
              recentMessages.map((message) => (
                <Link
                  key={message.id}
                  to="/admin/messages"
                  className="flex items-start py-3 border-b border-white/5 last:border-0 hover:bg-white/5 rounded-lg px-3 transition-colors"
                >
                  <div className="flex-shrink-0 mr-3">
                    {message.is_read ? (
                      <MailOpen size={16} className="text-gray-500 mt-1" />
                    ) : (
                      <Mail size={16} className="text-blue-400 mt-1" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${message.is_read ? "text-gray-300" : "text-white font-semibold"}`}>
                      {message.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {message.message.substring(0, 60)}...
                    </p>
                  </div>
                  <span className="ml-auto text-xs text-gray-500 flex-shrink-0">
                    {getTimeAgo(message.created_at)}
                  </span>
                </Link>
              ))
            )}
          </div>
          {recentMessages.length > 0 && (
            <Link
              to="/admin/messages"
              className="block mt-4 text-center text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              View all messages →
            </Link>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4 text-white">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400 flex items-center gap-2">
                <Code size={16} className="text-blue-400" />
                Published Projects
              </span>
              <span className="text-white text-lg font-bold">{stats.projects}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400 flex items-center gap-2">
                <Wrench size={16} className="text-green-400" />
                Technical Skills
              </span>
              <span className="text-white text-lg font-bold">{stats.skills}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400 flex items-center gap-2">
                <Briefcase size={16} className="text-purple-400" />
                Work Experiences
              </span>
              <span className="text-white text-lg font-bold">{stats.experiences}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400 flex items-center gap-2">
                <Mail size={16} className="text-indigo-400" />
                Total Messages
              </span>
              <span className="text-white text-lg font-bold">{stats.messages}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-t border-white/10 pt-4">
              <span className="text-gray-400 flex items-center gap-2">
                <Activity size={16} className="text-green-400" />
                Portfolio Status
              </span>
              <span className="text-green-400 text-sm px-2 py-1 bg-green-500/10 rounded">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;