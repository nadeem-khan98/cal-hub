import Link from "next/link";
import { Calculator } from "lucide-react";

export default function Navbar() {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2 text-gray-900 hover:text-blue-600 transition-colors group">
              <div className="bg-blue-600 text-white p-2 rounded-lg group-hover:bg-blue-700 transition">
                <Calculator size={22} className="stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-xl tracking-tight">CalcHub</span>
            </Link>
          </div>
          <nav className="hidden md:flex ml-8 space-x-8">
            <Link href="/tools" className="text-gray-500 hover:text-gray-900 px-1 py-2 text-sm font-semibold transition-colors">
              Tools
            </Link>
            <Link href="/blog" className="text-gray-500 hover:text-gray-900 px-1 py-2 text-sm font-semibold transition-colors">
              Blog
            </Link>
            <Link href="/about" className="text-gray-500 hover:text-gray-900 px-1 py-2 text-sm font-semibold transition-colors">
              About
            </Link>
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/contact" className="text-gray-500 hover:text-gray-900 px-1 py-2 text-sm font-semibold transition-colors mr-2">
              Contact
            </Link>
            <Link href="/tools" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
              Use a Tool
            </Link>
          </div>
          <div className="flex md:hidden">
            <button className="text-gray-400 hover:text-gray-900 p-2 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
