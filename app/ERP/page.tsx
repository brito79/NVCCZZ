"use client";

import { useState, useEffect } from 'react';
import { FiMenu, FiX, FiHome, FiDollarSign, FiFileText, FiUsers, FiSettings, FiChevronDown, FiChevronRight, FiTool } from 'react-icons/fi';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

// Add these interfaces for role checking
interface Role {
  id: string;
  name: string;
  description: string;
  permissions: {
    name: string;
    value: boolean;
  }[];
}

interface UserResponse {
  success: boolean;
  data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    role: Role;
  };
}

type MenuItem = {
  id: string;
  title: string;
  icon: React.ReactNode;
  path?: string;
  adminOnly?: boolean;
  subItems?: {
    id: string;
    title: string;
    path: string;
    adminOnly?: boolean;
  }[];
};

const ERP = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [expandedMenuItems, setExpandedMenuItems] = useState<string[]>([]);
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Fetch user role on component mount
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        setUserLoading(true);
        const token = sessionStorage.getItem('token');
        const userId = sessionStorage.getItem('userID');
        
        if (!token) {
          setAuthError('Authentication token not found');
          return;
        }
        
        if (!userId) {
          setAuthError('User ID not found in session');
          return;
        }

        const response = await fetch(`https://nvccz-pi.vercel.app/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.status}`);
        }

        const data: UserResponse = await response.json();
        
        if (data.success && data.data.role?.name === 'admin') {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error('Error fetching user role:', err);
        setAuthError(err instanceof Error ? err.message : 'Failed to verify user permissions');
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  // Define menu items with adminOnly flag where needed
  const menuItems: MenuItem[] = [
    {
      id: 'Dashboard',
      title: 'Dashboard',
      icon: <FiHome className="shrink-0" />,
      path: '/ERP/Dashboard',
    },
    {
      id: 'Accounting',
      title: 'Accounting',
      icon: <FiDollarSign className="shrink-0" />,
      subItems: [
        {
          id: 'Expenses',
          title: 'Expenses',
          path: '/ERP/Accounting/Expenses',
        }
      ],
    },
    {
      id: 'invoices',
      title: 'Invoices',
      icon: <FiFileText className="shrink-0" />,
      subItems: [
        {
          id: 'create-invoice',
          title: 'Create Invoice',
          path: '/ERP/Invoices/Create',
          adminOnly: true // Only admins can create invoices
        },
        {
          id: 'invoice-history',
          title: 'Invoice History',
          path: '/ERP/Invoices/History',
        },
      ],
    },
    {
      id: 'Reports',
      title: 'Reports',
      icon: <FiFileText className="shrink-0" />,
      path: '/ERP/Reports',
      adminOnly: true // Only admins can access reports
    },
    {
      id: 'Tools',
      title: 'Tools',
      icon: <FiTool className="shrink-0" />,
      path: '/ERP/Tools',
      adminOnly: true // Only admins can access tools
    },
  ];

  // Filter menu items based on admin status
  const filteredMenuItems = menuItems.filter(item => {
    // Show all items if user is admin or item is not adminOnly
    if (isAdmin || !item.adminOnly) {
      // For items with subItems, also filter the subItems
      if (item.subItems) {
        return {
          ...item,
          subItems: item.subItems.filter(subItem => isAdmin || !subItem.adminOnly)
        };
      }
      return true;
    }
    return false;
  }).map(item => {
    // Ensure we return the item with filtered subItems
    if (item.subItems) {
      return {
        ...item,
        subItems: item.subItems.filter(subItem => isAdmin || !subItem.adminOnly)
      };
    }
    return item;
  }).filter(item => {
    // Remove items that have no subItems left after filtering
    if (item.subItems) {
      return item.subItems.length > 0;
    }
    return true;
  });


  const toggleMenu = () => {
    setIsMenuCollapsed(!isMenuCollapsed);
  };

  const toggleSubMenu = (menuId: string) => {
    if (expandedMenuItems.includes(menuId)) {
      setExpandedMenuItems(expandedMenuItems.filter(id => id !== menuId));
    } else {
      setExpandedMenuItems([...expandedMenuItems, menuId]);
    }
  };

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Modern Glass Sidebar with Navy Gradient */}
      <div 
        className={`backdrop-blur-lg border-r border-gray-200/30 transition-all duration-300 ease-in-out shadow-xl
          bg-gradient-to-b from-white/95 via-navy-50/80 to-white/95
          ${isMenuCollapsed ? 'w-20' : 'w-64'} flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between border-b border-gray-200/30">
          {!isMenuCollapsed && (
            <h1 className="text-1xl font-light tracking-tight bg-gradient-to-r from-navy-600 to-navy-800 bg-clip-text text-transparent">
              <span className="font-medium">NVCCZ</span> Accounting
            </h1>
          )}
          <button 
            onClick={toggleMenu}
            className="p-2 rounded-lg hover:bg-gray-100/50 text-gray-500 hover:text-navy-700 transition-all duration-200 hover:scale-105"
          >
            {isMenuCollapsed ? <FiMenu size={20} /> : <FiX size={20} />}
          </button>
        </div>
  
        {/* Navigation Menu */}
        <nav className="mt-6 px-2 flex-1">
          {filteredMenuItems.map((item) => (
            <div key={item.id} className="mb-1 relative group">
              {item.path && !item.subItems ? (
                // Regular clickable menu item (Dashboard, Reports, Tools)
                <Link href={item.path}>
                  <div
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200
                      ${isActive(item.path) 
                        ? 'bg-white text-navy-700 font-medium shadow-sm border border-gray-200/30' 
                        : 'text-gray-600 hover:bg-white/90 hover:text-navy-600 hover:shadow-xs hover:translate-x-1'}
                      ${isMenuCollapsed ? 'justify-center' : 'justify-between'}`}
                  >
                    <div className="flex items-center">
                      <span className={`transition-all duration-200 ${isActive(item.path) ? 'text-navy-600 scale-110' : 'text-gray-500 hover:scale-110'}`}>
                        {item.icon}
                      </span>
                      {!isMenuCollapsed && <span className="ml-3 font-light tracking-wide transition-all duration-200 group-hover:font-normal">{item.title}</span>}
                    </div>
                  </div>
                </Link>
              ) : (
                // Dropdown menu item (Accounting, Invoices)
                <div
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200
                    ${isMenuCollapsed ? 'justify-center' : 'justify-between'}
                    ${item.subItems?.some(subItem => isActive(subItem.path)) 
                      ? 'text-navy-700' 
                      : 'text-gray-600 hover:bg-white/90 hover:text-navy-600 hover:shadow-xs hover:translate-x-1'}`}
                  onClick={() => item.subItems && toggleSubMenu(item.id)}
                >
                  <div className="flex items-center">
                    <span className="transition-all duration-200 text-gray-500 hover:scale-110">
                      {item.icon}
                    </span>
                    {!isMenuCollapsed && <span className="ml-3 font-light tracking-wide transition-all duration-200 group-hover:font-normal">{item.title}</span>}
                  </div>
                  {!isMenuCollapsed && item.subItems && (
                    <span className={`text-gray-400 transition-all duration-200 ${expandedMenuItems.includes(item.id) ? 'rotate-180' : ''} hover:scale-125`}>
                      <FiChevronDown size={16} />
                    </span>
                  )}
                </div>
              )}
              
              {/* Animated bottom border */}
              <div className={`absolute bottom-0 left-0 h-0.5 bg-navy-600 transition-all duration-300 ease-in-out 
                ${isMenuCollapsed ? 'w-0' : 'w-full scale-x-0 group-hover:scale-x-100 origin-left'} 
                ${item.path && isActive(item.path) ? 'scale-x-100' : ''}`} />
  
              {/* Submenu Items */}
              {!isMenuCollapsed && item.subItems && expandedMenuItems.includes(item.id) && (
                <div className="ml-8 mt-1 mb-2 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Link href={subItem.path} key={subItem.id} className="relative group">
                      <div
                        className={`px-3 py-2 rounded-lg cursor-pointer text-sm transition-all duration-200
                          ${isActive(subItem.path) 
                            ? 'bg-white text-navy-700 font-normal shadow-xs border border-gray-200/20' 
                            : 'text-gray-500 hover:bg-white/90 hover:text-navy-600 hover:translate-x-2 hover:shadow-xs'}`}
                      >
                        <span className="font-light tracking-wide transition-all duration-200 group-hover:font-normal">{subItem.title}</span>
                        {/* Animated bottom border for subitems */}
                        <div className={`absolute bottom-0 left-0 h-0.5 bg-navy-600 transition-all duration-300 ease-in-out 
                          w-full scale-x-0 group-hover:scale-x-100 origin-left 
                          ${isActive(subItem.path) ? 'scale-x-100' : ''}`} />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
  
        {/* Beautiful Home Button at Bottom */}
        <div className="p-4 border-t border-gray-200/30">
          <Link href="/">
            <div className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200
              ${isActive('/') 
                ? 'bg-white text-navy-700 font-medium shadow-sm border border-gray-200/30' 
                : 'text-gray-600 hover:bg-white/90 hover:text-navy-600 hover:shadow-xs hover:translate-x-1'}
              ${isMenuCollapsed ? 'justify-center' : 'justify-between'}`}
            >
              <div className="flex items-center" onClick={() => {
                router.push('/')
              }}>
                <span className={`transition-all duration-200 ${isActive('/') ? 'text-navy-600 scale-110' : 'text-gray-500 hover:scale-110'}`}>
                  <FiHome size={20} />
                </span>
                {!isMenuCollapsed && (
                  <span className="ml-3 font-light tracking-wide transition-all duration-200 hover:font-normal">
                    Home
                  </span>
                )}
              </div>
            </div>
          </Link>
        </div>
      </div>
  
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200/50 p-4">
          <h2 className="text-2xl font-light text-gray-800 tracking-tight">
            {menuItems.find(item => item.path && isActive(item.path))?.title}
            {menuItems.some(item => item.subItems?.some(sub => isActive(sub.path))) && 
              ` / ${menuItems
                .flatMap(item => item.subItems || [])
                .find(subItem => isActive(subItem.path))?.title}`}
          </h2>
        </header>
        
        <main className="p-6 bg-gray-50/50 min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ERP;