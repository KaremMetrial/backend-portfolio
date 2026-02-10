import React, { useState, useEffect } from "react";
import { AdminTable } from "../components/AdminTable";
import AdminModal from "../components/AdminModal";
import ImageUpload from "../components/ImageUpload";
import api from "../utils/api";

const AboutPage: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({
    title: "",
    description: "",
    image: "",
    stats: [],
  });

  // Local state for stats editing
  const [stats, setStats] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      setLoading(true);
      const response = await api.get("/about");
      const about = response.data.data || response.data;
      setData(about ? [about] : []);
    } catch (error) {
      console.error("Failed to fetch about", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setFormData({
      title: item.title || "",
      description: item.description || "",
      image: item.image || "",
    });

    // Parse stats if they come as object or array
    let initialStats = [];
    if (item.stats) {
      if (Array.isArray(item.stats)) {
        initialStats = item.stats;
      } else if (typeof item.stats === "object") {
        initialStats = Object.entries(item.stats).map(([label, value]) => ({
          label,
          value: String(value),
        }));
      }
    }
    setStats(initialStats);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Transform stats array back to object if needed by backend,
      // but our model usually takes array/json
      const payload = {
        ...formData,
        stats: stats.filter((s) => s.label && s.value),
      };

      await api.put("/about", payload);
      setIsModalOpen(false);
      fetchAbout();
    } catch (error) {
      console.error("Failed to save about content", error);
      alert("Error saving about content");
    }
  };

  const addStat = () => {
    setStats([...stats, { label: "", value: "" }]);
  };

  const removeStat = (index: number) => {
    setStats(stats.filter((_, i) => i !== index));
  };

  const updateStat = (
    index: number,
    field: "label" | "value",
    value: string,
  ) => {
    const newStats = [...stats];
    newStats[index][field] = value;
    setStats(newStats);
  };

  const columns = [
    { key: "title", label: "Title" },
    {
      key: "description",
      label: "Description",
      render: (val: string) => (
        <span className="truncate max-w-xs block">{val}</span>
      ),
    },
    {
      key: "stats",
      label: "Stats Count",
      render: (val: any) => {
        const count = Array.isArray(val)
          ? val.length
          : typeof val === "object"
            ? Object.keys(val).length
            : 0;
        return <span>{count} Items</span>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-600 bg-clip-text text-transparent">About Section</h1>
          <p className="text-gray-400 mt-2">
            Manage your bio and professional statistics.
          </p>
        </div>
      </div>

      <AdminTable
        title="About Content"
        columns={columns}
        data={data}
        onEdit={handleEdit}
        onDelete={() => alert("Cannot delete singleton resource")}
      />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit About Section"
      >
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Title</label>
            <input
              required
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500/50"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">
              Description / Bio
            </label>
            <textarea
              required
              rows={6}
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500/50"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <ImageUpload
              label="Profile Image"
              value={formData.image}
              onChange={(url) => setFormData({ ...formData, image: url })}
              type="profile"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-400">
                Statistics
              </label>
              <button
                type="button"
                onClick={addStat}
                className="text-xs bg-purple-500/20 text-purple-400 px-3 py-1.5 rounded-lg border border-purple-500/30 hover:bg-purple-500/30 transition-all font-bold"
              >
                + Add Stat
              </button>
            </div>

            <div className="space-y-3">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex gap-3 items-start animate-in fade-in slide-in-from-top-1"
                >
                  <input
                    placeholder="Label (e.g. Projects)"
                    className="flex-1 bg-black/40 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-purple-500/50"
                    value={stat.label}
                    onChange={(e) => updateStat(index, "label", e.target.value)}
                  />
                  <input
                    placeholder="Value (e.g. 50+)"
                    className="w-32 bg-black/40 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-purple-500/50"
                    value={stat.value}
                    onChange={(e) => updateStat(index, "value", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeStat(index)}
                    className="p-2.5 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-white/5">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-bold transition-all active:scale-95"
            >
              Update About Section
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default AboutPage;