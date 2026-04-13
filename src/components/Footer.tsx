import Link from "next/link";
import { Calculator } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-auto">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2 text-gray-900">
            <div className="bg-gray-200 text-gray-700 p-1.5 rounded-md">
              <Calculator size={18} className="stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-lg tracking-tight">CalcHub</span>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-gray-500">
            <Link href="/tools" className="hover:text-gray-900 transition-colors">Tools</Link>
            <Link href="/blog" className="hover:text-gray-900 transition-colors">Blog</Link>
            <Link href="/about" className="hover:text-gray-900 transition-colors">About</Link>
            <Link href="/contact" className="hover:text-gray-900 transition-colors">Contact</Link>
            <Link href="/admin/login" className="hover:text-gray-900 transition-colors">Admin Login</Link>
          </nav>
        </div>
        
        <div className="mt-10 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm font-medium text-gray-400">
            &copy; {new Date().getFullYear()} CalcHub. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm font-medium text-gray-400">
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
