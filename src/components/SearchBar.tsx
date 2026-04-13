"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Calculator, FileText, Loader2 } from "lucide-react";

interface ToolResult {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
}

interface BlogResult {
  _id: string;
  title: string;
  slug: string;
  metaDescription: string;
}

interface SearchResults {
  tools: ToolResult[];
  blogs: BlogResult[];
}

interface SearchBarProps {
  onClose?: () => void;
}

export default function SearchBar({ onClose }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>({ tools: [], blogs: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasResults = results.tools.length > 0 || results.blogs.length > 0;
  const showEmpty = query.length >= 2 && !isLoading && !hasResults;

  // Debounced search
  const handleSearch = useCallback((value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 2) {
      setResults({ tools: [], blogs: [] });
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(value.trim())}`);
        const data = await res.json();
        setResults(data);
        setIsOpen(true);
      } catch {
        setResults({ tools: [], blogs: [] });
      } finally {
        setIsLoading(false);
      }
    }, 300);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  const handleClear = () => {
    setQuery("");
    setResults({ tools: [], blogs: [] });
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleNavigate = (href: string) => {
    setIsOpen(false);
    setQuery("");
    setResults({ tools: [], blogs: [] });
    onClose?.();
    router.push(href);
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard: Escape to close
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-xs lg:max-w-sm">
      {/* Input */}
      <div className="relative flex items-center">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          ref={inputRef}
          id="global-search"
          type="search"
          autoComplete="off"
          value={query}
          onChange={handleChange}
          onFocus={() => {
            if (hasResults) setIsOpen(true);
          }}
          placeholder="Search tools & blogs…"
          className="w-full pl-9 pr-8 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        {isLoading && (
          <Loader2
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 animate-spin"
          />
        )}
        {!isLoading && query && (
          <button
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (hasResults || showEmpty) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden z-[100]">
          {showEmpty ? (
            <div className="px-4 py-6 text-center text-sm text-gray-400">
              No results for &quot;<span className="font-medium text-gray-600 dark:text-gray-300">{query}</span>&quot;
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {/* Tools Section */}
              {results.tools.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-800">
                    🧮 Tools
                  </div>
                  {results.tools.map((tool) => (
                    <button
                      key={tool._id}
                      onClick={() => handleNavigate(`/tools/${tool.slug}`)}
                      className="w-full flex items-start gap-3 px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left group"
                    >
                      <div className="mt-0.5 w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/60 transition-colors">
                        <Calculator size={14} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {tool.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate leading-relaxed">
                          {tool.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Blogs Section */}
              {results.blogs.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-800">
                    📝 Blogs
                  </div>
                  {results.blogs.map((blog) => (
                    <button
                      key={blog._id}
                      onClick={() => handleNavigate(`/blog/${blog.slug}`)}
                      className="w-full flex items-start gap-3 px-4 py-3 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-left group"
                    >
                      <div className="mt-0.5 w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/60 transition-colors">
                        <FileText size={14} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {blog.title}
                        </p>
                        <p className="text-xs text-gray-400 truncate leading-relaxed">
                          {blog.metaDescription}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
