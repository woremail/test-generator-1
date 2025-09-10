
'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  joinDate: string;
  lastActive: string;
}

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    password: '',
    confirmPassword: ''
  });

  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Sarah Johnson', email: 'sarah.johnson@school.edu', role: 'Teacher', department: 'Science', status: 'Active', joinDate: '2023-01-15', lastActive: '2024-01-15 10:30 AM' },
    { id: 2, name: 'Mike Chen', email: 'mike.chen@school.edu', role: 'Teacher', department: 'Mathematics', status: 'Active', joinDate: '2023-03-20', lastActive: '2024-01-14 09:15 AM' },
    { id: 3, name: 'Emma Wilson', email: 'emma.wilson@school.edu', role: 'Admin', department: 'Administration', status: 'Active', joinDate: '2022-09-10', lastActive: '2024-01-15 11:45 AM' },
    { id: 4, name: 'David Brown', email: 'david.brown@school.edu', role: 'Teacher', department: 'Science', status: 'Inactive', joinDate: '2023-05-08', lastActive: '2023-12-20 03:20 PM' },
    { id: 5, name: 'Lisa Garcia', email: 'lisa.garcia@school.edu', role: 'Teacher', department: 'History', status: 'Active', joinDate: '2023-08-12', lastActive: '2024-01-13 02:45 PM' },
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === '' || user.role === filterRole;
    const matchesStatus = filterStatus === '' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userForm.name || !userForm.email || !userForm.role || !userForm.department || !userForm.password) {
      alert('Please fill in all required fields');
      return;
    }

    if (userForm.password !== userForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (users.some(u => u.email === userForm.email)) {
      alert('A user with this email already exists');
      return;
    }

    const newUser: User = {
      id: Date.now(),
      name: userForm.name,
      email: userForm.email,
      role: userForm.role,
      department: userForm.department,
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      lastActive: 'Never'
    };

    setUsers(prev => [newUser, ...prev]);
    setUserForm({ name: '', email: '', role: '', department: '', password: '', confirmPassword: '' });
    setShowAddUser(false);
    alert('User created successfully!');
  };

  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userForm.name || !userForm.email || !userForm.role || !userForm.department) {
      alert('Please fill in all required fields');
      return;
    }

    if (!editingUser) return;

    if (users.some(u => u.email === userForm.email && u.id !== editingUser.id)) {
      alert('A user with this email already exists');
      return;
    }

    const updatedUser: User = {
      ...editingUser,
      name: userForm.name,
      email: userForm.email,
      role: userForm.role,
      department: userForm.department
    };

    setUsers(prev => prev.map(u => u.id === editingUser.id ? updatedUser : u));
    setUserForm({ name: '', email: '', role: '', department: '', password: '', confirmPassword: '' });
    setEditingUser(null);
    setShowEditUser(false);
    alert('User updated successfully!');
  };

  const openEditUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      password: '',
      confirmPassword: ''
    });
    setShowEditUser(true);
  };

  const deleteUser = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (confirm(`Are you sure you want to delete user "${user?.name}"? This action cannot be undone.`)) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      alert('User deleted successfully!');
    }
  };

  const toggleUserStatus = (userId: number) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
        : user
    ));
    
    const user = users.find(u => u.id === userId);
    alert(`User "${user?.name}" ${user?.status === 'Active' ? 'deactivated' : 'activated'} successfully!`);
  };

  const resetPassword = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (confirm(`Are you sure you want to reset password for "${user?.name}"? They will receive an email with reset instructions.`)) {
      alert(`Password reset email sent to ${user?.email}`);
    }
  };

  const UserModal = ({ isEdit = false }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              {isEdit ? 'Edit User' : 'Add New User'}
            </h3>
            <button
              onClick={() => {
                if (isEdit) {
                  setShowEditUser(false);
                  setEditingUser(null);
                } else {
                  setShowAddUser(false);
                }
                setUserForm({ name: '', email: '', role: '', department: '', password: '', confirmPassword: '' });
              }}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>
        </div>
        
        <form onSubmit={isEdit ? handleEditUser : handleAddUser} className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={userForm.name}
                onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter full name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email address"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                value={userForm.role}
                onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Teacher">Teacher</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select
                value={userForm.department}
                onChange={(e) => setUserForm(prev => ({ ...prev, department: e.target.value }))}
                className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Department</option>
                <option value="Administration">Administration</option>
                <option value="Science">Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="History">History</option>
                <option value="English">English</option>
              </select>
            </div>
            
            {!isEdit && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={userForm.password}
                    onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter password"
                    minLength={6}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={userForm.confirmPassword}
                    onChange={(e) => setUserForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm password"
                    minLength={6}
                    required
                  />
                </div>
              </>
            )}
          </div>
          
          <div className="flex space-x-3 mt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer whitespace-nowrap"
            >
              {isEdit ? 'Update User' : 'Create User'}
            </button>
            <button
              type="button"
              onClick={() => {
                if (isEdit) {
                  setShowEditUser(false);
                  setEditingUser(null);
                } else {
                  setShowAddUser(false);
                }
                setUserForm({ name: '', email: '', role: '', department: '', password: '', confirmPassword: '' });
              }}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer whitespace-nowrap"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole="Admin" currentPage="users" />
      
      <div className="flex-1 overflow-y-auto p-2 ml-[256px]">
        <div className="p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
                <p className="text-gray-600">Manage user accounts, roles, and permissions</p>
              </div>
              <button
                onClick={() => setShowAddUser(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer whitespace-nowrap"
              >
                <i className="ri-add-line mr-2"></i>
                Add User
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Users</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search by name or email..."
                  />
                  <i className="ri-search-line absolute left-3 top-2.5 text-gray-400"></i>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Role</label>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Roles</option>
                  <option value="Admin">Admin</option>
                  <option value="Teacher">Teacher</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterRole('');
                    setFilterStatus('');
                  }}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg cursor-pointer whitespace-nowrap"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Users ({filteredUsers.length})
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Active: {filteredUsers.filter(u => u.status === 'Active').length}</span>
                  <span>Inactive: {filteredUsers.filter(u => u.status === 'Inactive').length}</span>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">User</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Role</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Department</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Last Active</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'Admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{user.department}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600 text-sm">{user.lastActive}</td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => openEditUser(user)}
                            className="text-blue-600 hover:text-blue-700 cursor-pointer"
                            title="Edit User"
                          >
                            <i className="ri-edit-line"></i>
                          </button>
                          <button 
                            onClick={() => toggleUserStatus(user.id)}
                            className={`cursor-pointer ${
                              user.status === 'Active' 
                                ? 'text-orange-600 hover:text-orange-700' 
                                : 'text-green-600 hover:text-green-700'
                            }`}
                            title={user.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                          >
                            <i className={`ri-${user.status === 'Active' ? 'pause' : 'play'}-circle-line`}></i>
                          </button>
                          <button 
                            onClick={() => resetPassword(user.id)}
                            className="text-gray-600 hover:text-gray-700 cursor-pointer"
                            title="Reset Password"
                          >
                            <i className="ri-lock-line"></i>
                          </button>
                          <button 
                            onClick={() => deleteUser(user.id)}
                            className="text-red-600 hover:text-red-700 cursor-pointer"
                            title="Delete User"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-user-line text-2xl text-gray-400"></i>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showAddUser && <UserModal />}
      {showEditUser && <UserModal isEdit={true} />}
    </div>
  );
}
