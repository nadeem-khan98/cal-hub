"use client";

import { useEffect, useState, useMemo } from "react";
import { Trash2, MessageSquare, Mail, Calendar, Eye, X, Check, Inbox, Search, Reply } from "lucide-react";

interface ContactMessage {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

type FilterType = "all" | "read" | "unread";

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");

  const fetchMessages = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/messages");
    const data = await res.json();
    if (data.success) setMessages(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!confirm("Are you sure you want to delete this message?")) return;
    const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    if (res.ok) {
      if (selectedMessage?._id === id) setSelectedMessage(null);
      fetchMessages();
    }
  };

  const toggleReadStatus = async (id: string, currentStatus: boolean, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const res = await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !currentStatus }),
    });
    if (res.ok) {
      setMessages(prev => prev.map(m => m._id === id ? { ...m, read: !currentStatus } : m));
      if (selectedMessage?._id === id) setSelectedMessage(prev => prev ? { ...prev, read: !currentStatus } : null);
    }
  };

  const handleRowClick = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (!msg.read) toggleReadStatus(msg._id, msg.read);
  };

  const filteredMessages = useMemo(() => {
    const q = search.toLowerCase();
    return messages
      .filter(m => filter === "all" ? true : filter === "read" ? m.read : !m.read)
      .filter(m => !q || `${m.firstName} ${m.lastName} ${m.email} ${m.message}`.toLowerCase().includes(q));
  }, [messages, filter, search]);

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="text-gray-900 dark:text-gray-100 h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shrink-0">
        <h1 className="text-2xl font-bold flex items-center text-gray-800 dark:text-gray-200">
          <Inbox className="mr-3 text-blue-600" size={26} /> Message Inbox
        </h1>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <span className="text-sm font-bold bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-3 py-1.5 rounded-full border border-orange-200 dark:border-orange-800">
              {unreadCount} Unread
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col lg:flex-row transition-colors">
        {/* Left Panel: List */}
        <div className={`w-full lg:w-2/5 flex flex-col border-r border-gray-200 dark:border-gray-700 ${selectedMessage ? "hidden lg:flex" : "flex"}`}>
          {/* Search + Filter */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-3 bg-gray-50 dark:bg-gray-800/50 shrink-0">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "unread", "read"] as FilterType[]).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                    filter === f
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {f === "all" ? `All (${messages.length})` : f === "unread" ? `Unread (${unreadCount})` : `Read (${messages.length - unreadCount})`}
                </button>
              ))}
            </div>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <div className="p-8 space-y-4">
                {Array(5).fill(0).map((_, i) => <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />)}
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center text-gray-500">
                <MessageSquare size={40} className="mb-3 text-gray-300 dark:text-gray-600" />
                <p className="font-medium">No messages found</p>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter</p>
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div
                  key={msg._id}
                  onClick={() => handleRowClick(msg)}
                  className={`p-4 cursor-pointer transition-colors relative group ${
                    selectedMessage?._id === msg._id
                      ? "bg-blue-50 dark:bg-blue-900/20"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800/60"
                  }`}
                >
                  {!msg.read && (
                    <span className="absolute top-5 left-2 w-2 h-2 rounded-full bg-blue-600"></span>
                  )}
                  <div className="ml-4">
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <h4 className={`font-semibold text-sm leading-snug ${!msg.read ? "text-gray-900 dark:text-gray-100" : "text-gray-600 dark:text-gray-400"}`}>
                        {msg.firstName} {msg.lastName}
                      </h4>
                      <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                        {new Date(msg.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-1.5">{msg.email}</p>
                    <p className={`text-sm line-clamp-1 ${!msg.read ? "text-gray-800 dark:text-gray-200" : "text-gray-500 dark:text-gray-500"}`}>
                      {msg.message}
                    </p>
                    <div className="flex items-center space-x-3 mt-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={e => toggleReadStatus(msg._id, msg.read, e)} className="text-xs text-gray-400 hover:text-blue-600 transition flex items-center">
                        <Check size={12} className="mr-1" /> {msg.read ? "Unread" : "Read"}
                      </button>
                      <button onClick={e => handleDelete(msg._id, e)} className="text-xs text-gray-400 hover:text-red-600 transition flex items-center">
                        <Trash2 size={12} className="mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel: Message Detail */}
        <div className={`flex-1 flex-col bg-white dark:bg-gray-900 ${!selectedMessage ? "hidden lg:flex" : "flex"}`}>
          {selectedMessage ? (
            <div className="flex flex-col h-full">
              {/* Top bar */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center shrink-0 bg-gray-50 dark:bg-gray-800/50">
                <button onClick={() => setSelectedMessage(null)} className="lg:hidden flex items-center text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 mr-3">
                  <X size={18} className="mr-1" /> Back
                </button>
                <div className="flex items-center gap-2 ml-auto">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: Your message on CalcHub`}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition"
                  >
                    <Reply size={16} /> Reply
                  </a>
                  <button
                    onClick={() => toggleReadStatus(selectedMessage._id, selectedMessage.read)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition"
                    title={selectedMessage.read ? "Mark as unread" : "Mark as read"}
                  >
                    <Check size={16} className={selectedMessage.read ? "text-blue-500" : ""} />
                    {selectedMessage.read ? "Unread" : "Read"}
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMessage._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-8">
                <div className="flex items-start justify-between mb-8 pb-6 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl mr-5 shadow-md shrink-0">
                      {selectedMessage.firstName.charAt(0)}{selectedMessage.lastName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-gray-900 dark:text-white capitalize">
                        {selectedMessage.firstName} {selectedMessage.lastName}
                      </h3>
                      <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 dark:text-blue-400 hover:underline flex items-center mt-1.5 text-sm">
                        <Mail size={14} className="mr-1.5 shrink-0" /> {selectedMessage.email}
                      </a>
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-400 dark:text-gray-500 shrink-0 ml-4">
                    <div className="flex items-center justify-end mb-1">
                      <Calendar size={12} className="mr-1.5" />
                      {new Date(selectedMessage.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </div>
                    <div>{new Date(selectedMessage.createdAt).toLocaleTimeString()}</div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                  {selectedMessage.message.split("\n").map((line, i) => (
                    <p key={i} className="mb-3 last:mb-0 text-gray-700 dark:text-gray-300 leading-relaxed text-[15px]">
                      {line}
                    </p>
                  ))}
                </div>

                {/* Quick Reply */}
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: Your message on CalcHub`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm hover:shadow-md"
                  >
                    <Reply size={18} /> Reply via Email
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-300 dark:text-gray-700">
              <Eye size={56} className="mb-4" />
              <p className="font-semibold text-gray-400 dark:text-gray-500">Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
