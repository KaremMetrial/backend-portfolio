import React, { useState, useEffect } from "react";
import { AdminTable } from "../components/AdminTable";
import AdminModal from "../components/AdminModal";
import api from "../utils/api";

const SettingsPage: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({
    site_title: "",
    meta_description: "",
    footer_content: "",
    theme_colors: {
      primary: "#6366f1",
      secondary: "#8b5cf6",
      background: "#0a0a0a",
      text: "#f5f5f5",
    },
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get("/site-config");
      const config = response.data.data || response.data;
      setData(config ? [config] : []);
    } catch (error) {
      console.error("Failed to fetch settings", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setFormData({
      site_title: item.site_title || "",
      meta_description: item.meta_description || "",
      footer_content: item.footer_content || "",
      theme_colors: item.theme_colors || {
        primary: "#6366f1",
        secondary: "#8b5cf6",
        background: "#0a0a0a",
        text: "#f5f5f5",
      },
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put("/site-config", formData);
      setIsModalOpen(false);
      fetchSettings();
    } catch (error) {
      console.error("Failed to save settings", error);
      alert("Error saving settings");
    }
  };

  const columns = [
    { key: "site_title", label: "Site Title" },
    {
      key: "theme_colors",
      label: "Theme",
      render: (colors: any) => (
        <div className="flex gap-2">
          <div
            className="w-4 h-4 rounded-full border border-white/10"
            style={{ backgroundColor: colors.primary }}
            title="Primary"
          ></div>
          <div
            className="w-4 h-4 rounded-full border border-white/10"
            style={{ backgroundColor: colors.background }}
            title="Background"
          ></div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-600 bg-clip-text text-transparent">Site Settings</h1>
          <p className="text-gray-400 mt-2">
            Global configuration, branding, and theme preferences.
          </p>
        </div>
      </div>

      <AdminTable
        title="Configuration"
        columns={columns}
        data={data}
        onEdit={handleEdit}
        onDelete={() => alert("Cannot delete singleton resource")}
      />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Site Configuration"
      >
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">
              Site Title
            </label>
            <input
              required
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500/50"
              value={formData.site_title}
              onChange={(e) =>
                setFormData({ ...formData, site_title: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">
              Meta Description
            </label>
            <textarea
              rows={4}
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500/50"
              value={formData.meta_description}
              onChange={(e) =>
                setFormData({ ...formData, meta_description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Theme Colors
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-gray-500">Primary</label>
                  <input
                    type="color"
                    className="bg-transparent border-none w-8 h-8 cursor-pointer"
                    value={formData.theme_colors.primary}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        theme_colors: {
                          ...formData.theme_colors,
                          primary: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-xs text-gray-500">Background</label>
                  <input
                    type="color"
                    className="bg-transparent border-none w-8 h-8 cursor-pointer"
                    value={formData.theme_colors.background}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        theme_colors: {
                          ...formData.theme_colors,
                          background: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Footer Branding
              </h3>
              <div className="space-y-2">
                <label className="text-xs text-gray-500">Footer Text</label>
                <input
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-purple-500/50"
                  value={formData.footer_content}
                  onChange={(e) =>
                    setFormData({ ...formData, footer_content: e.target.value })
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
              Save Settings
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default SettingsPage;