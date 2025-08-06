'use client'

import { User, Settings, LogOut, Building2, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter()
  return (
    <div className="fixed top-4 right-4 z-40">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-gray-800/80 backdrop-blur-sm border border-gray-700 hover:bg-gray-700/80 transition-all"
      >
        <User className="w-5 h-5 text-gray-300" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-gray-800/90 backdrop-blur-lg border border-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
              <p>Welcome back</p>
              <p className="font-medium text-white">user@nvccz.com</p>
            </div>
            
            <a
              href="#"
              className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white"
            >
              <User className="mr-3 h-4 w-4" />
              Profile Settings
            </a>
            
            <a
              href="/organization"
              className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white"
            >
              <Building2 className="mr-3 h-4 w-4" />
              Organization
            </a>
            
            <a
              href="https://nvccz-frontend.vercel.app/ERP/Dashboard" target="_blank" rel="noopener noreferrer"
              className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white"
            >
              <LayoutDashboard className="mr-3 h-4 w-4" />
              Accounting
            </a>
            

            
            <div className="border-t border-gray-700" />
            
            <a
              href="#"
              onClick={()=> {
                sessionStorage.clear()
                router.push('/auth')

              }}
              className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign out
            </a>
          </div>
        </div>
      )}
    </div>
  );
}