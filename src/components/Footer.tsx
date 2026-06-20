import Link from "next/link";
import { Calculator } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#0B0F19] border-t border-gray-200 dark:border-gray-800 mt-auto transition-colors duration-300">
      <div className="max-w-6xl mx-auto py-16 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
            <div className="bg-blue-600 text-white p-2 rounded-xl shadow-md">
              <Calculator size={22} className="stroke-[2.5]" />
            </div>
            <span className="font-bold text-xl tracking-tight">CalcHub</span>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">
            <Link href="/tools" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Tools</Link>
            <Link href="/blog" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blog</Link>
            <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</Link>
            <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</Link>
          </nav>
        </div>
        
        <div className="mt-16 pt-10 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm font-bold text-gray-400 dark:text-gray-500 tracking-wide uppercase">
            &copy; {new Date().getFullYear()} CalcHub
          </p>
          <div className="flex space-x-10 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            <Link href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
