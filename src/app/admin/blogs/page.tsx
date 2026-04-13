"use client";

import { useState, useEffect } from "react";
import { Trash2, Edit2, Plus, Settings } from "lucide-react";

interface Blog {
  _id: string; title: string; slug: string; content: string; metaTitle: string; metaDescription: string;
  focusKeyword: string; tags: string[]; faq: { question: string; answer: string }[];
}

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [tools, setTools] = useState<any[]>([]); // For Insert Tool dropdown
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "", slug: "", content: "", metaTitle: "", metaDescription: "", focusKeyword: "", tags: "",
  });
  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);

  const fetchBlogs = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/blogs");
    const data = await res.json();
    if (data.success) setBlogs(data.data);
    setLoading(false);
  };

  const fetchTools = async () => {
    const res = await fetch("/api/admin/tools");
    const data = await res.json();
    if (data.success) setTools(data.data);
  };

  useEffect(() => {
    fetchBlogs();
    fetchTools();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/admin/blogs/${editingId}` : "/api/admin/blogs";
    const method = editingId ? "PUT" : "POST";

    const dataPayload = {
      ...formData,
      tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
      faq: faqs.filter(f => f.question && f.answer)
    };

    const res = await fetch(url, {
      method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(dataPayload),
    });

    if (res.ok) {
      setFormData({ title: "", slug: "", content: "", metaTitle: "", metaDescription: "", focusKeyword: "", tags: "" });
      setFaqs([{ question: "", answer: "" }]);
      setShowForm(false);
      setEditingId(null);
      fetchBlogs();
    }
  };

  const handleEdit = (blog: Blog) => {
    setFormData({
      title: blog.title, slug: blog.slug, content: blog.content, metaTitle: blog.metaTitle, metaDescription: blog.metaDescription, focusKeyword: blog.focusKeyword || "", tags: blog.tags?.join(", ") || "",
    });
    setFaqs(blog.faq?.length > 0 ? blog.faq : [{ question: "", answer: "" }]);
    setEditingId(blog._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    const res = await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
    if (res.ok) fetchBlogs();
  };

  // SEO Helpers
  const titleChars = formData.metaTitle?.length || 0;
  const isTitleGood = titleChars >= 50 && titleChars <= 60;
  const descChars = formData.metaDescription?.length || 0;
  const isDescGood = descChars >= 140 && descChars <= 160;

  const insertToolCTA = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const slug = e.target.value;
    if (!slug) return;
    setFormData(prev => ({ ...prev, content: prev.content + `\n\n[[TOOL:${slug}]]\n\n` }));
    e.target.value = "";
  };

  return (
    <div className="text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Manage Blogs</h1>
        <button onClick={() => {
            setFormData({ title: "", slug: "", content: "", metaTitle: "", metaDescription: "", focusKeyword: "", tags: "" });
            setFaqs([{ question: "", answer: "" }]);
            setEditingId(null);
            setShowForm(!showForm);
          }} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <Plus size={18} /><span>{showForm ? "Cancel" : "Add New Blog"}</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8 transition-colors">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">{editingId ? "Edit Blog" : "Create Blog"}</h2>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Title</label>
                <input required type="text" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Slug</label>
                <input required type="text" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-gray-800 p-6 rounded-xl border border-blue-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center"><Settings size={18} className="mr-2 text-blue-600" /> SEO Content & Linking</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Focus Keyword</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700" value={formData.focusKeyword} onChange={(e) => setFormData({ ...formData, focusKeyword: e.target.value })} placeholder="e.g. bmi calculator guide" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Tags (comma separated)</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="health, fitness" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Meta Title</label>
                    <span className={`text-xs font-semibold ${isTitleGood ? 'text-green-600' : 'text-orange-500'}`}>{titleChars} chars (ideal: 50-60)</span>
                  </div>
                  <input required type="text" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700" value={formData.metaTitle} onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })} />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Meta Description</label>
                    <span className={`text-xs font-semibold ${isDescGood ? 'text-green-600' : 'text-orange-500'}`}>{descChars} chars (ideal: 140-160)</span>
                  </div>
                  <input required type="text" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700" value={formData.metaDescription} onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })} />
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">Content (Markdown)</label>
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md border border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-semibold mr-2">Insert Tool CTA:</span>
                  <select onChange={insertToolCTA} className="text-xs border-0 outline-none bg-transparent dark:text-gray-200 cursor-pointer">
                    <option value="">-- Select --</option>
                    {tools.map(t => <option key={t._id} value={t.slug}>{t.name}</option>)}
                  </select>
                </div>
              </div>
              <textarea required rows={12} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })}></textarea>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">FAQ Section</h3>
              {faqs.map((faq, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input type="text" placeholder="Question" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm" value={faq.question} onChange={e => { const newFaqs = [...faqs]; newFaqs[index].question = e.target.value; setFaqs(newFaqs); }} />
                  <input type="text" placeholder="Answer" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm" value={faq.answer} onChange={e => { const newFaqs = [...faqs]; newFaqs[index].answer = e.target.value; setFaqs(newFaqs); }} />
                </div>
              ))}
              <button type="button" onClick={() => setFaqs([...faqs, { question: "", answer: "" }])} className="text-blue-600 hover:text-blue-700 text-sm font-semibold tracking-wide">+ Add another FAQ</button>
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold transition">
                {editingId ? "Update Blog" : "Save Blog"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
          <table className="w-full text-left border-collapse bg-white dark:bg-gray-900">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <th className="p-4 font-medium text-gray-800 dark:text-gray-200">Title</th>
                <th className="p-4 font-medium text-gray-800 dark:text-gray-200">Slug / SEO Setup</th>
                <th className="p-4 font-medium text-gray-800 dark:text-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.length === 0 ? (
                <tr><td colSpan={3} className="p-4 text-center text-gray-500 dark:text-gray-400">No blogs found.</td></tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog._id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <td className="p-4 text-gray-900 dark:text-gray-100 font-semibold">{blog.title}</td>
                    <td className="p-4">
                      <div className="text-gray-500 dark:text-gray-400 font-mono text-sm">{blog.slug}</div>
                      {blog.focusKeyword && <span className="inline-block mt-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold px-2 py-0.5 rounded-md">{blog.focusKeyword}</span>}
                    </td>
                    <td className="p-4 flex space-x-3 items-center">
                      <button onClick={() => handleEdit(blog)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 transition-colors bg-blue-50 dark:bg-blue-900/30 p-2 rounded-md"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(blog._id)} className="text-red-500 hover:text-red-700 transition-colors bg-red-50 dark:bg-red-900/20 p-2 rounded-md"><Trash2 size={18} /></button>
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
