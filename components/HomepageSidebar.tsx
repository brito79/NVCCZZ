import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBook, 
  FaChartLine,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';

// Navigation items - only Accounting and Performance Management
const NAV_ITEMS = [
  { 
    id: 'accounting', 
    label: 'Accounting', 
    icon: FaBook, 
    isActive: false, 
    type: 'single',
    description: 'Financial Reports'
  },
  { 
    id: 'performance', 
    label: 'Performance Management', 
    icon: FaChartLine, 
    isActive: false, 
    type: 'single',
    description: 'Analytics & KPIs'
  },
];

export default function HomepageSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <motion.aside
      animate={{ width: isOpen ? 280 : 70 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="h-screen sticky top-0 flex flex-col bg-slate-900 border-r border-slate-700/50 shadow-sm relative overflow-hidden"
      style={{ minWidth: isOpen ? 280 : 70 }}
    >
      {/* Header Section */}
      <div className="relative flex flex-col items-center py-6 border-b border-slate-700/40">
        {/* Logo/Brand Area */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mb-6 text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-blue-500/20">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">NVCCZ</h3>
              <p className="text-xs text-slate-400 font-medium">Dashboard</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button */}
        <motion.button
          className="group relative p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/60 hover:border-blue-500/30 transition-all duration-300"
          onClick={toggleSidebar}
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: isOpen ? 0 : 180 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {isOpen ? 
              <FaChevronLeft className="text-blue-400 group-hover:text-blue-300" size={16} /> : 
              <FaChevronRight className="text-blue-400 group-hover:text-blue-300" size={16} />
            }
          </motion.div>
        </motion.button>
      </div>
      {/* Navigation Section */}
      <div className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          {NAV_ITEMS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setHoveredSection(item.id)}
              onHoverEnd={() => setHoveredSection(null)}
              className="relative"
            >
              <AnimatePresence>
                {isOpen ? (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="group relative flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all duration-200 text-slate-300 hover:bg-slate-800/50 border-l-4 border-transparent hover:border-l-4 hover:border-blue-500"
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <item.icon 
                        className="text-blue-400 group-hover:text-blue-300"
                        size={18} 
                      />
                    </div>
                    
                    {/* Text Content */}
                    <div className="min-w-0 flex-1">
                      <span className="font-medium text-slate-200 group-hover:text-white">
                        {item.label}
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="group relative p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-slate-800/50"
                    title={item.label}
                  >
                    <div className="flex items-center justify-center">
                      <item.icon 
                        className="text-blue-400 group-hover:text-blue-300"
                        size={20} 
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </nav>
      </div>

      {/* Footer Section */}
      <div className="px-4 py-4 border-t border-slate-700/40">
        <AnimatePresence>
          {isOpen ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="text-center"
            >
              <div className="text-xs text-slate-500 mb-1">NVCCZ Dashboard</div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-medium">N</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
