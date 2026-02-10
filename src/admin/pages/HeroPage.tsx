import React, { useState, useEffect } from "react";
import { AdminTable } from "../components/AdminTable";
import AdminModal from "../components/AdminModal";
import ImageUpload from "../components/ImageUpload";
import api from "../utils/api";

const HeroPage: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({
    name: "",
    title: "",
    subtitle: "",
    description: "",
    hero_image: "",
    stats: {
      yearsExp: "5",
      projects: "40",
      uptime: "100%",
    },
  });

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      setLoading(true);
      const response = await api.get("/hero");
      const hero = response.data.data || response.data;
      setData(hero ? [hero] : []);
    } catch (error) {
      console.error("Failed to fetch hero", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setFormData({
      name: item.name || "",
      title: item.title || "",
      subtitle: item.subtitle || "",
      description: item.description || "",
      hero_image: item.hero_image || "",
      stats: item.stats || {
        yearsExp: "5",
        projects: "40",
        uptime: "100%",
      },
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put("/hero", formData);
      setIsModalOpen(false);
      fetchHero();
    } catch (error) {
      console.error("Failed to save hero", error);
      alert("Error saving hero content");
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "title", label: "Title" },
    { key: "subtitle", label: "Subtitle" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-600 bg-clip-text text-transparent">Hero Section</h1>
          <p className="text-gray-400 mt-2">
            Manage your homepage hero content.
          </p>
        </div>
      </div>

      <AdminTable
        title="Hero Content"
        columns={columns}
        data={data}
        onEdit={handleEdit}
        onDelete={() => alert("Cannot delete singleton resource")}
      />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Hero Section"
      >
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Name</label>
            <input
              required
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500/50"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">
              Main Title
            </label>
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
              Subtitle
            </label>
            <input
              required
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500/50"
              value={formData.subtitle}
              onChange={(e) =>
                setFormData({ ...formData, subtitle: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">
              Description
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
              label="Hero Image"
              value={formData.hero_image}
              onChange={(url) => setFormData({ ...formData, hero_image: url })}
              type="hero"
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Professional Stats
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-gray-500">Years Exp.</label>
                <input
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-purple-500/50"
                  value={formData.stats.yearsExp}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stats: { ...formData.stats, yearsExp: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-500">Projects</label>
                <input
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-purple-500/50"
                  value={formData.stats.projects}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stats: { ...formData.stats, projects: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-500">Uptime Focus</label>
                <input
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-purple-500/50"
                  value={formData.stats.uptime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stats: { ...formData.stats, uptime: e.target.value },
                    })
                  }
                />
              </div>
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
              Update Hero
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default HeroPage;