import React, { useState, useEffect } from "react";
import { AdminTable } from "../components/AdminTable";
import AdminModal from "../components/AdminModal";
import api from "../utils/api";

const ExperiencePage: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    role: "",
    company: "",
    period: "",
    description: "",
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const response = await api.get("/experiences");
      setData(response.data.data || response.data);
    } catch (error) {
      console.error("Failed to fetch experiences", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      role: "",
      company: "",
      period: "",
      description: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      ...item,
      description: Array.isArray(item.description)
        ? item.description.join("\n")
        : item.description || "",
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        description: formData.description
          .split("\n")
          .map((s: string) => s.trim())
          .filter(Boolean),
      };

      if (editingItem) {
        await api.put(`/experiences/${editingItem.id}`, payload);
      } else {
        await api.post("/experiences", payload);
      }

      setIsModalOpen(false);
      fetchExperiences();
    } catch (error) {
      console.error("Failed to save experience", error);
      alert("Error saving experience");
    }
  };

  const handleDelete = (item: any) => {
    if (confirm("Are you sure?")) {
      api.delete(`/experiences/${item.id}`).then(() => fetchExperiences());
    }
  };

  const columns = [
    { key: "role", label: "Role" },
    { key: "company", label: "Company" },
    { key: "period", label: "Period" },
    {
      key: "description",
      label: "Responsibilities",
      render: (val: string[] | string) => {
        const items = Array.isArray(val) ? val : val ? [val] : [];
        return (
          <ul className="list-disc list-inside text-xs text-gray-400">
            {items.slice(0, 2).map((item, i) => (
              <li key={i} className="truncate max-w-xs">
                {item}
              </li>
            ))}
            {items.length > 2 && <li>...</li>}
          </ul>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-600 bg-clip-text text-transparent">Experience</h1>
          <p className="text-gray-400 mt-2">Your professional journey.</p>
        </div>
      </div>

      <AdminTable
        title="Experience Timeline"
        columns={columns}
        data={data}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Experience" : "Add Experience"}
      >
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Role</label>
              <input
                required
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500/50"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">
                Company
              </label>
              <input
                required
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500/50"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">
              Period (e.g. 2021 - Present)
            </label>
            <input
              required
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500/50"
              value={formData.period}
              onChange={(e) =>
                setFormData({ ...formData, period: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">
              Responsibilities (One per line)
            </label>
            <textarea
              required
              rows={6}
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500/50"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Led the backend team...&#10;Optimized database queries..."
            />
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
              {editingItem ? "Update Experience" : "Save Experience"}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default ExperiencePage;