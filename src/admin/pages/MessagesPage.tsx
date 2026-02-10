import React, { useState, useEffect } from "react";
import { AdminTable } from "../components/AdminTable";
import api from "../utils/api";
import { Mail, MailOpen, Trash2, Eye } from "lucide-react";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

const MessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get("/contact-messages");
      setMessages(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch messages", error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsModalOpen(true);

    // Mark as read if not already
    if (!message.is_read) {
      try {
        await api.patch(`/contact-messages/${message.id}/read`);
        fetchMessages(); // Refresh to update read status
      } catch (error) {
        console.error("Failed to mark as read", error);
      }
    }
  };

  const handleDelete = async (message: ContactMessage) => {
    if (!confirm(`Delete message from ${message.name}?`)) return;

    try {
      await api.delete(`/contact-messages/${message.id}`);
      fetchMessages();
    } catch (error) {
      console.error("Failed to delete message", error);
      alert("Error deleting message");
    }
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (message: ContactMessage) => (
        <div className="flex items-center gap-2">
          {!message.is_read && (
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          )}
          <span className={!message.is_read ? "font-bold" : ""}>
            {message.name}
          </span>
        </div>
      ),
    },
    { key: "email", label: "Email" },
    {
      key: "message",
      label: "Message Preview",
      render: (message: ContactMessage) => (
        <span className="text-gray-400 truncate max-w-xs block">
          {message.message.substring(0, 50)}
          {message.message.length > 50 ? "..." : ""}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Received",
      render: (message: ContactMessage) => (
        <span className="text-sm text-gray-500">
          {new Date(message.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
    {
      key: "is_read",
      label: "Status",
      render: (message: ContactMessage) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            message.is_read
              ? "bg-gray-500/20 text-gray-400"
              : "bg-blue-500/20 text-blue-400"
          }`}
        >
          {message.is_read ? "Read" : "Unread"}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white text-xl">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-600 bg-clip-text text-transparent">
            Contact Messages
          </h1>
          <p className="text-gray-400 mt-2">
            View and manage messages from your contact form
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-blue-500/10 border border-blue-500/30 px-4 py-2 rounded-lg">
            <div className="flex items-center gap-2">
              <Mail size={20} className="text-blue-400" />
              <span className="text-blue-400 font-bold">{unreadCount}</span>
              <span className="text-gray-400 text-sm">Unread</span>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg">
            <div className="flex items-center gap-2">
              <MailOpen size={20} className="text-gray-400" />
              <span className="text-white font-bold">{messages.length}</span>
              <span className="text-gray-400 text-sm">Total</span>
            </div>
          </div>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
          <Mail size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No messages yet</h3>
          <p className="text-gray-400">
            Messages from your contact form will appear here
          </p>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider"
                    >
                      {col.label}
                    </th>
                  ))}
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {messages.map((message) => (
                  <tr
                    key={message.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="px-6 py-4 text-sm text-white">
                        {col.render
                          ? col.render(message)
                          : message[col.key as keyof ContactMessage]}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleView(message)}
                          className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                          title="View message"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(message)}
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                          title="Delete message"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Message Detail Modal */}
      {isModalOpen && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Message from {selectedMessage.name}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {new Date(selectedMessage.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  From
                </label>
                <p className="text-white mt-1">{selectedMessage.name}</p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Email
                </label>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="text-blue-400 hover:text-blue-300 mt-1 block"
                >
                  {selectedMessage.email}
                </a>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Message
                </label>
                <div className="mt-2 bg-white/5 border border-white/10 rounded-lg p-4">
                  <p className="text-white whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/5">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: Your message&body=Hi ${selectedMessage.name},%0D%0A%0D%0A`}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg font-bold transition-all text-center"
                >
                  Reply via Email
                </a>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    handleDelete(selectedMessage);
                  }}
                  className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg font-bold transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
