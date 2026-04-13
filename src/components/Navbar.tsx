"use client";

import { useState } from "react";
import Link from "next/link";
import { Calculator, Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import SearchBar from "@/components/SearchBar";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-2 text-gray-900 dark:text-gray-100 hover:text-blue-600 transition-colors group"
            >
              <div className="bg-blue-600 text-white p-2 rounded-lg group-hover:bg-blue-700 transition">
                <Calculator size={20} className="stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-lg tracking-tight">CalcHub</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex ml-2 space-x-6">
            <Link
              href="/tools"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 px-1 py-2 text-sm font-semibold transition-colors"
            >
              Tools
            </Link>
            <Link
              href="/blog"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 px-1 py-2 text-sm font-semibold transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 px-1 py-2 text-sm font-semibold transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 justify-center max-w-sm mx-4">
            <SearchBar />
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center space-x-3 flex-shrink-0">
            <ThemeToggle />
            <Link
              href="/contact"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 px-1 py-2 text-sm font-semibold transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/tools"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
            >
              Use a Tool
            </Link>
          </div>

          {/* Mobile: Theme + hamburger */}
          <div className="flex md:hidden items-center space-x-3">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 p-2 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-lg border-b border-gray-100 dark:border-gray-800">
          <div className="px-4 pt-4 pb-6 space-y-1 flex flex-col">
            {/* Mobile Search */}
            <div className="pb-3 mb-2 border-b border-gray-100 dark:border-gray-800">
              <SearchBar onClose={() => setIsOpen(false)} />
            </div>

            <Link
              href="/tools"
              onClick={() => setIsOpen(false)}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-3 rounded-md text-base font-medium"
            >
              Tools
            </Link>
            <Link
              href="/blog"
              onClick={() => setIsOpen(false)}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-3 rounded-md text-base font-medium"
            >
              Blog
            </Link>
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-3 rounded-md text-base font-medium"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-3 rounded-md text-base font-medium"
            >
              Contact
            </Link>
            <Link
              href="/tools"
              onClick={() => setIsOpen(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white block text-center px-3 py-3 rounded-md text-base font-medium mt-2"
            >
              Use a Tool
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
