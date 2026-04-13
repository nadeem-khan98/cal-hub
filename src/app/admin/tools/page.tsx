"use client";

import { useState, useEffect, useCallback } from "react";
import { Trash2, Edit2, Plus, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Tool {
  _id: string;
  name: string;
  slug: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
}

const EMPTY_FORM = {
  name: "",
  slug: "",
  description: "",
  metaTitle: "",
  metaDescription: "",
  category: "",
};

export default function AdminTools() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [successMsg, setSuccessMsg] = useState("");
  const router = useRouter();

  const fetchTools = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/tools");
    const data = await res.json();
    if (data.success) setTools(data.data);
    setLoading(false);
  }, []);

  const fetchCategories = useCallback(async () => {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    if (data.success) setCategories(data.data);
  }, []);

  useEffect(() => {
    fetchTools();
    fetchCategories();
  }, [fetchTools, fetchCategories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/admin/tools/${editingId}` : "/api/admin/tools";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setSuccessMsg(editingId ? "Tool updated successfully!" : "Tool created successfully!");
      setFormData(EMPTY_FORM);
      setShowForm(false);
      setEditingId(null);
      fetchTools();
      router.refresh(); // Ensure server-side data is fresh
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  const handleEdit = (tool: Tool) => {
    setFormData({
      name: tool.name,
      slug: tool.slug,
      description: tool.description,
      metaTitle: tool.metaTitle,
      metaDescription: tool.metaDescription,
      category: tool.category || "",
    });
    setEditingId(tool._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tool?")) return;
    const res = await fetch(`/api/admin/tools/${id}`, { method: "DELETE" });
    if (res.ok) fetchTools();
  };

  const inputClass =
    "w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  // Resolve category name for display
  const getCategoryName = (slug: string) => {
    const cat = categories.find((c) => c.slug === slug);
    return cat ? cat.name : slug || "—";
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Manage Tools</h1>
        <button
          onClick={() => {
            setFormData(EMPTY_FORM);
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
        >
          <Plus size={18} />
          <span>{showForm ? "Cancel" : "Add New Tool"}</span>
        </button>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-xl mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle size={18} />
          <span className="text-sm font-semibold">{successMsg}</span>
        </div>
      )}

      {showForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8 transition-colors">
          <h2 className="text-xl font-semibold mb-5 text-gray-900 dark:text-gray-100">
            {editingId ? "Edit Tool Metadata" : "Create Tool Metadata"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Name</label>
                <input
                  required
                  type="text"
                  className={inputClass}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Slug (Matches Component)</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. bmi-calculator"
                  className={inputClass}
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
            </div>

            {/* Dynamic Category Select */}
            <div>
              <label className={labelClass}>Category</label>
              {categories.length === 0 ? (
                <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-3">
                  No categories found.{" "}
                  <a href="/admin/categories" className="underline font-semibold">
                    Create a category first →
                  </a>
                </div>
              ) : (
                <select
                  className={inputClass}
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">— Select a category —</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea
                required
                rows={3}
                className={inputClass}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Meta Title</label>
                <input
                  required
                  type="text"
                  className={inputClass}
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Meta Description</label>
                <input
                  required
                  type="text"
                  className={inputClass}
                  value={formData.metaDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, metaDescription: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition text-sm font-semibold"
              >
                {editingId ? "Update Tool" : "Save Tool"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300 text-sm">Name</th>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300 text-sm">Slug</th>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300 text-sm">Category</th>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tools.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No tools found.
                  </td>
                </tr>
              ) : (
                tools.map((tool) => (
                  <tr
                    key={tool._id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="p-4 text-gray-900 dark:text-gray-100 font-medium text-sm">
                      {tool.name}
                    </td>
                    <td className="p-4 text-gray-500 dark:text-gray-400 font-mono text-xs">
                      {tool.slug}
                    </td>
                    <td className="p-4">
                      {tool.category ? (
                        <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                          {getCategoryName(tool.category)}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="p-4 flex space-x-3">
                      <button
                        onClick={() => handleEdit(tool)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                        aria-label="Edit tool"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(tool._id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                        aria-label="Delete tool"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
