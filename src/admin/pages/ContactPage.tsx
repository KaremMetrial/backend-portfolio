import React, { useState, useEffect } from "react";
import { AdminTable } from "../components/AdminTable";
import AdminModal from "../components/AdminModal";
import api from "../utils/api";

const ContactPage: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({
    email: "",
    phone: "",
    location: "",
    availability: "",
    social_links: {
      github: "",
      linkedin: "",
      twitter: "",
      email: "",
    },
  });

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      setLoading(true);
      const response = await api.get("/contact");
      const contact = response.data.data || response.data;
      setData(contact ? [contact] : []);
    } catch (error) {
      console.error("Failed to fetch contact", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setFormData({
      email: item.email || "",
      phone: item.phone || "",
      location: item.location || "",
      availability: item.availability || "",
      social_links: {
        github: item.social_links?.github || "",
        linkedin: item.social_links?.linkedin || "",
        twitter: item.social_links?.twitter || "",
        email: item.social_links?.email || "",
      },
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put("/contact", formData);
      setIsModalOpen(false);
      fetchContact();
    } catch (error) {
      console.error("Failed to save contact info", error);
      alert("Error saving contact info");
    }
  };

  const columns = [
    { key: "email", label: "Primary Email" },
    { key: "location", label: "Location" },
    { key: "availability", label: "Availability Status" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-600 bg-clip-text text-transparent">Contact Info</h1>
          <p className="text-gray-400 mt-2">
            Manage how people can reach you and your social presence.
          </p>
        </div>
      </div>

      <AdminTable
        title="Contact Details"
        columns={columns}
        data={data}
        onEdit={handleEdit}
        onDelete={() => alert("Cannot delete singleton resource")}
      />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Contact Information"
      >
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Email</label>
              <input
                required
                type="email"
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500/50"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">
                Phone (Optional)
              </label>
              <input
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500/50"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">
                Location
              </label>
              <input
                required
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500/50"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">
                Availability Status
              </label>
              <input
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500/50"
                placeholder="e.g. Available for Hire"
                value={formData.availability}
                onChange={(e) =>
                  setFormData({ ...formData, availability: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Social Links
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs text-gray-500">GitHub URL</label>
                <input
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-purple-500/50"
                  value={formData.social_links.github}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      social_links: {
                        ...formData.social_links,
                        github: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-500">LinkedIn URL</label>
                <input
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-purple-500/50"
                  value={formData.social_links.linkedin}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      social_links: {
                        ...formData.social_links,
                        linkedin: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-500">Twitter URL</label>
                <input
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-purple-500/50"
                  value={formData.social_links.twitter}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      social_links: {
                        ...formData.social_links,
                        twitter: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-500">Alternate Email</label>
                <input
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-purple-500/50"
                  value={formData.social_links.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      social_links: {
                        ...formData.social_links,
                        email: e.target.value,
                      },
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
              Update Contact Info
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default ContactPage;