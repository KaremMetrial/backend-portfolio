import React, { useState, useEffect } from "react";
import { AdminTable } from "../components/AdminTable";
import AdminModal from "../components/AdminModal";
import api from "../utils/api";

const SkillsPage: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    name: "",
    category: "Framework",
  });

  const categories = ["Language", "Framework", "Database", "Tools", "Concept"];

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await api.get("/skills");
      setData(response.data.data || response.data);
    } catch (error) {
      console.error("Failed to fetch skills", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      category: "Framework",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/skills/${editingItem.id}`, formData);
      } else {
        await api.post("/skills", formData);
      }

      setIsModalOpen(false);
      fetchSkills();
    } catch (error) {
      console.error("Failed to save skill", error);
      alert("Error saving skill");
    }
  };

  const handleDelete = (item: any) => {
    if (confirm("Are you sure?")) {
      api.delete(`/skills/${item.id}`).then(() => fetchSkills());
    }
  };

  const columns = [
    { key: "name", label: "Skill Name" },
    {
      key: "category",
      label: "Category",
      render: (val: string) => (
        <span className="px-2 py-1 bg-white/5 border border-white/5 rounded text-xs text-gray-400">
          {val}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-600 bg-clip-text text-transparent">Skills</h1>
          <p className="text-gray-400 mt-2">
            Manage your tech stack and expertise.
          </p>
        </div>
      </div>

      <AdminTable
        title="Skills List"
        columns={columns}
        data={data}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Skill" : "Add Skill"}
      >
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">
              Skill Name
            </label>
            <input
              required
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500/50"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g. Laravel"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">
              Category
            </label>
            <select
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500/50"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
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
              {editingItem ? "Update Skill" : "Save Skill"}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default SkillsPage;