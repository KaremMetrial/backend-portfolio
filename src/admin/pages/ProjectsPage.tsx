import React, { useState, useEffect } from "react";
import { AdminTable } from "../components/AdminTable";
import AdminModal from "../components/AdminModal";
import ImageUpload from "../components/ImageUpload";
import api from "../utils/api";

const ProjectsPage: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    title: "",
    description: "",
    tech_stack: "",
    is_featured: false,
    image: "",
    github_url: "",
    live_url: "",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get("/projects");
      setData(response.data.data || response.data);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      description: "",
      tech_stack: "",
      is_featured: false,
      image: "https://picsum.photos/seed/project/800/450",
      github_url: "",
      live_url: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      ...item,
      tech_stack: Array.isArray(item.tech_stack)
        ? item.tech_stack.join(", ")
        : item.tech_stack || "",
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        tech_stack: formData.tech_stack
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean),
        features: editingItem?.features || [],
      };

      if (editingItem) {
        await api.put(`/projects/${editingItem.id}`, payload);
      } else {
        await api.post("/projects", payload);
      }

      setIsModalOpen(false);
      fetchProjects();
    } catch (error) {
      console.error("Failed to save project", error);
      alert("Error saving project");
    }
  };

  const handleDelete = (item: any) => {
    if (confirm("Are you sure?")) {
      api.delete(`/projects/${item.id}`).then(() => fetchProjects());
    }
  };

  const columns = [
    { key: "title", label: "Title" },
    {
      key: "tech_stack",
      label: "Tech Stack",
      render: (val: string[] | string) => {
        const techs = Array.isArray(val) ? val : val ? val.split(", ") : [];
        return (
          <div className="flex gap-1 flex-wrap">
            {techs.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 bg-white/10 rounded text-xs text-gray-400"
              >
                {t}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      key: "is_featured",
      label: "Featured",
      render: (val: any) => {
        const isFeatured = val === true || val === 1 || val === "1";
        return (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${isFeatured ? "bg-purple-500/20 text-purple-400" : "bg-gray-500/20 text-gray-400"}`}
          >
            {isFeatured ? "Yes" : "No"}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-600 bg-clip-text text-transparent">Projects</h1>
          <p className="text-gray-400 mt-2">Showcase your best work.</p>
        </div>
      </div>

      <AdminTable
        title="Project List"
        columns={columns}
        data={data}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Project" : "Add Project"}
      >
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
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
                Featured
              </label>
              <select
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500/50"
                value={formData.is_featured ? "1" : "0"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    is_featured: e.target.value === "1",
                  })
                }
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">
              Description
            </label>
            <textarea
              required
              rows={4}
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500/50"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">
              Tech Stack (comma separated)
            </label>
            <input
              required
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500/50"
              value={formData.tech_stack}
              onChange={(e) =>
                setFormData({ ...formData, tech_stack: e.target.value })
              }
              placeholder="Laravel, React, PostgreSQL"
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <ImageUpload
              label="Project Image"
              value={formData.image}
              onChange={(url) => setFormData({ ...formData, image: url })}
              type="project"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">
                GitHub URL
              </label>
              <input
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500/50"
                value={formData.github_url || ""}
                onChange={(e) =>
                  setFormData({ ...formData, github_url: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">
                Live URL
              </label>
              <input
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500/50"
                value={formData.live_url || ""}
                onChange={(e) =>
                  setFormData({ ...formData, live_url: e.target.value })
                }
              />
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
              {editingItem ? "Update Project" : "Save Project"}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default ProjectsPage;