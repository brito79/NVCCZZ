'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, User, Shield, Edit, Trash2, ChevronDown, ChevronUp, Search } from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
  createdAt: string;
  updatedAt: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: {
    name: string;
    value: boolean;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface OrgClientProps {
    getUsers: (token: string) => Promise<User[]>;
    getRoles: (token: string) => Promise<Role[]>;
    createUserAction: (formData: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      roleId: string;
    }, token: string) => Promise<{ success: boolean; data?: User; error?: string }>;
    createRoleAction: (formData: {
      name: string;
      description: string;
      permissions: { name: string; value: boolean }[];
    }, token: string) => Promise<{ success: boolean; data?: Role; error?: string }>;
    updateUserAction: (
      userId: string,
      formData: {
        firstName?: string;
        lastName?: string;
        email?: string;
        roleId?: string;
      }, 
      token: string
    ) => Promise<{ success: boolean; data?: User; error?: string }>;
    deleteUserAction: (
      userId: string, 
      token: string
    ) => Promise<{ success: boolean; error?: string }>;
  }

const OrgClient = ({ 
  getUsers,
  getRoles,
  createUserAction,
  createRoleAction,
  updateUserAction,
  deleteUserAction
}: OrgClientProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'firstName', direction: 'asc' });
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    roleId: ''
  });
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: [{ name: 'view_dashboard', value: true }]
  });

  // Get token from sessionStorage
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('token') || '';
    }
    return '';
  };

  // Fetch users and roles
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = getToken();
        if (!token) {
          setError('Authentication required');
          return;
        }

        const [usersData, rolesData] = await Promise.all([
          getUsers(token),
          getRoles(token)
        ]);
        
        setUsers(usersData);
        setRoles(rolesData);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [getUsers, getRoles]);

  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Handle delete user
  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setLoading(true);
        const token = getToken();
        if (!token) {
          setError('Authentication required');
          return;
        }

        const result = await deleteUserAction(userId, token);
        if (result.success) {
          setUsers(users.filter(user => user.id !== userId));
        } else if (result.error) {
          setError(result.error);
        }
      } catch (err) {
        setError('Failed to delete user');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        setError('Authentication required');
        return;
      }

      const { id, ...updateData } = editingUser;
      const result = await updateUserAction(id, updateData, token);
      if (result.success && result.data) {
        setUsers(users.map(user => user.id === result.data?.id ? result.data : user));
        setEditingUser(null);
      } else if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to update user');
    } finally {
      setLoading(false);
    }
  };



  // Sort users
  const sortedUsers = [...users].sort((a, b) => {
    if (a[sortConfig.key as keyof User] < b[sortConfig.key as keyof User]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key as keyof User] > b[sortConfig.key as keyof User]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Create new user
  const handleCreateUser = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        setError('Authentication required');
        return;
      }

      const result = await createUserAction(newUser, token);
      if (result.success && result.data) {
        setUsers([...users, result.data]);
        setShowUserModal(false);
        setNewUser({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          roleId: ''
        });
      } else if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  // Create new role
  const handleCreateRole = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        setError('Authentication required');
        return;
      }

      const result = await createRoleAction(newRole, token);
      if (result.success && result.data) {
        setRoles([...roles, result.data]);
        setShowRoleModal(false);
        setNewRole({
          name: '',
          description: '',
          permissions: [{ name: 'view_dashboard', value: true }]
        });
      } else if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to create role');
    } finally {
      setLoading(false);
    }
  };


  // Get role name by ID
  const getRoleName = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : 'No role';
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-4 bg-red-100 text-red-700 rounded-lg">
      {error}
    </div>
  );

  
    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
          {/* Header */}
          <div className="flex flex-col space-y-4 mb-8 md:flex-row md:justify-between md:items-center md:space-y-0">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Organization Management</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage users and their roles</p>
            </div>
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm transition-colors duration-150"
                onClick={() => setShowUserModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                New User
              </motion.button>
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white text-sm font-medium shadow-sm transition-colors duration-150"
                onClick={() => setShowRoleModal(true)}
              >
                <Shield className="w-4 h-4 mr-2" />
                New Role
              </motion.button>
            </div>
          </div>
    
          {/* Search and Filter Bar */}
          <div className="mb-6 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search users..."
              />
            </div>
            <select className="block w-full sm:w-48 px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <option>All Roles</option>
              {roles.map(role => (
                <option key={role.id}>{role.name}</option>
              ))}
            </select>
          </div>
    
          {/* Users Table */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th 
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer group"
                      onClick={() => requestSort('firstName')}
                    >
                      <div className="flex items-center justify-between">
                        <span>Name</span>
                        {sortConfig.key === 'firstName' ? (
                          sortConfig.direction === 'asc' ? 
                            <ChevronUp className="ml-2 w-4 h-4 text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200" /> : 
                            <ChevronDown className="ml-2 w-4 h-4 text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200" />
                        ) : (
                          <div className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronUp className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th 
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer group"
                      onClick={() => requestSort('roleId')}
                    >
                      <div className="flex items-center justify-between">
                        <span>Role</span>
                        {sortConfig.key === 'roleId' ? (
                          sortConfig.direction === 'asc' ? 
                            <ChevronUp className="ml-2 w-4 h-4 text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200" /> : 
                            <ChevronDown className="ml-2 w-4 h-4 text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200" />
                        ) : (
                          <div className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronUp className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Created
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {sortedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-9 w-9 rounded-md bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.firstName} {user.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                          {getRoleName(user.roleId)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setEditingUser(user)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
    
          {/* Edit User Modal */}
          {editingUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Edit User</h2>
                    <button
                      onClick={() => setEditingUser(null)}
                      className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={editingUser.firstName}
                        onChange={(e) => setEditingUser({...editingUser, firstName: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={editingUser.lastName}
                        onChange={(e) => setEditingUser({...editingUser, lastName: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={editingUser.roleId}
                        onChange={(e) => setEditingUser({...editingUser, roleId: e.target.value})}
                      >
                        <option value="">Select a role</option>
                        {roles.map(role => (
                          <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => setEditingUser(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={handleUpdateUser}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
    
          {/* Create User Modal */}
          {showUserModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Create New User</h2>
                    <button
                      onClick={() => setShowUserModal(false)}
                      className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={newUser.firstName}
                        onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={newUser.lastName}
                        onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={newUser.roleId}
                        onChange={(e) => setNewUser({...newUser, roleId: e.target.value})}
                      >
                        <option value="">Select a role</option>
                        {roles.map(role => (
                          <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => setShowUserModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={handleCreateUser}
                    >
                      Create User
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
    
          {/* Create Role Modal */}
          {showRoleModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Create New Role</h2>
                    <button
                      onClick={() => setShowRoleModal(false)}
                      className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={newRole.name}
                        onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        rows={3}
                        value={newRole.description}
                        onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Permissions</label>
                      <div className="space-y-2">
                        {newRole.permissions.map((perm, index) => (
                          <div key={index} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={perm.value}
                              onChange={() => {
                                const updatedPermissions = [...newRole.permissions];
                                updatedPermissions[index].value = !updatedPermissions[index].value;
                                setNewRole({...newRole, permissions: updatedPermissions});
                              }}
                              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700"
                            />
                            <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">{perm.name}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => setShowRoleModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      onClick={handleCreateRole}
                    >
                      Create Role
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      );
    };
    
    export default OrgClient;