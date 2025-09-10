'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';

interface Department {
  id: number;
  name: string;
  head: string;
  teacherCount: number;
  subjects: string[];
  status: string;
  created: string;
}

interface Subject {
  id: number;
  name: string;
  department: string;
  teacherCount: number;
  booksCount: number;
  status: string;
}

export default function OrganizationSetup() {
  const [activeTab, setActiveTab] = useState('departments');
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showEditDepartment, setShowEditDepartment] = useState(false);
  const [showEditSubject, setShowEditSubject] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const [departmentForm, setDepartmentForm] = useState({
    name: '',
    head: '',
    description: ''
  });

  const [subjectForm, setSubjectForm] = useState({
    name: '',
    department: '',
    description: '',
    code: ''
  });

  const [departments, setDepartments] = useState<Department[]>([
    { id: 1, name: 'Science', head: 'Dr. Sarah Johnson', teacherCount: 8, subjects: ['Biology', 'Chemistry', 'Physics'], status: 'Active', created: '2023-01-15' },
    { id: 2, name: 'Mathematics', head: 'Prof. Mike Chen', teacherCount: 5, subjects: ['Algebra', 'Geometry', 'Calculus'], status: 'Active', created: '2023-01-20' },
    { id: 3, name: 'History', head: 'Dr. Lisa Garcia', teacherCount: 4, subjects: ['World History', 'Modern History'], status: 'Active', created: '2023-02-10' },
    { id: 4, name: 'English', head: 'Ms. Emma Wilson', teacherCount: 6, subjects: ['Literature', 'Grammar', 'Writing'], status: 'Active', created: '2023-02-15' },
  ]);

  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, name: 'Biology', department: 'Science', teacherCount: 3, booksCount: 12, status: 'Active' },
    { id: 2, name: 'Chemistry', department: 'Science', teacherCount: 2, booksCount: 8, status: 'Active' },
    { id: 3, name: 'Physics', department: 'Science', teacherCount: 3, booksCount: 10, status: 'Active' },
    { id: 4, name: 'Algebra', department: 'Mathematics', teacherCount: 2, booksCount: 6, status: 'Active' },
    { id: 5, name: 'Geometry', department: 'Mathematics', teacherCount: 2, booksCount: 5, status: 'Active' },
    { id: 6, name: 'World History', department: 'History', teacherCount: 2, booksCount: 7, status: 'Active' },
    { id: 7, name: 'Literature', department: 'English', teacherCount: 3, booksCount: 15, status: 'Active' },
    { id: 8, name: 'Grammar', department: 'English', teacherCount: 2, booksCount: 4, status: 'Inactive' },
  ]);

  const handleAddDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!departmentForm.name || !departmentForm.head) {
      alert('Please fill in all required fields');
      return;
    }

    if (departments.some(d => d.name.toLowerCase() === departmentForm.name.toLowerCase())) {
      alert('A department with this name already exists');
      return;
    }

    const newDepartment: Department = {
      id: Date.now(),
      name: departmentForm.name,
      head: departmentForm.head,
      teacherCount: 0,
      subjects: [],
      status: 'Active',
      created: new Date().toISOString().split('T')[0]
    };

    setDepartments(prev => [newDepartment, ...prev]);
    setDepartmentForm({ name: '', head: '', description: '' });
    setShowAddDepartment(false);
    alert('Department created successfully!');
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subjectForm.name || !subjectForm.department || !subjectForm.code) {
      alert('Please fill in all required fields');
      return;
    }

    if (subjects.some(s => s.name.toLowerCase() === subjectForm.name.toLowerCase())) {
      alert('A subject with this name already exists');
      return;
    }

    const newSubject: Subject = {
      id: Date.now(),
      name: subjectForm.name,
      department: subjectForm.department,
      teacherCount: 0,
      booksCount: 0,
      status: 'Active'
    };

    setSubjects(prev => [newSubject, ...prev]);
    
    // Update department subjects
    setDepartments(prev => prev.map(dept => 
      dept.name === subjectForm.department 
        ? { ...dept, subjects: [...dept.subjects, subjectForm.name] }
        : dept
    ));
    
    setSubjectForm({ name: '', department: '', description: '', code: '' });
    setShowAddSubject(false);
    alert('Subject created successfully!');
  };

  const handleEditDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!departmentForm.name || !departmentForm.head || !editingDepartment) {
      alert('Please fill in all required fields');
      return;
    }

    if (departments.some(d => d.name.toLowerCase() === departmentForm.name.toLowerCase() && d.id !== editingDepartment.id)) {
      alert('A department with this name already exists');
      return;
    }

    const updatedDepartment = {
      ...editingDepartment,
      name: departmentForm.name,
      head: departmentForm.head
    };

    setDepartments(prev => prev.map(d => d.id === editingDepartment.id ? updatedDepartment : d));
    setDepartmentForm({ name: '', head: '', description: '' });
    setEditingDepartment(null);
    setShowEditDepartment(false);
    alert('Department updated successfully!');
  };

  const deleteDepartment = (departmentId: number) => {
    const department = departments.find(d => d.id === departmentId);
    if (department && department.subjects.length > 0) {
      alert('Cannot delete department with existing subjects. Please reassign or delete subjects first.');
      return;
    }
    
    if (confirm(`Are you sure you want to delete "${department?.name}" department?`)) {
      setDepartments(prev => prev.filter(d => d.id !== departmentId));
      alert('Department deleted successfully!');
    }
  };

  const deleteSubject = (subjectId: number) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (confirm(`Are you sure you want to delete "${subject?.name}" subject?`)) {
      setSubjects(prev => prev.filter(s => s.id !== subjectId));
      
      // Remove from department subjects
      if (subject) {
        setDepartments(prev => prev.map(dept => 
          dept.name === subject.department 
            ? { ...dept, subjects: dept.subjects.filter(s => s !== subject.name) }
            : dept
        ));
      }
      
      alert('Subject deleted successfully!');
    }
  };

  const DepartmentModal = ({ isEdit = false }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              {isEdit ? 'Edit Department' : 'Add New Department'}
            </h3>
            <button
              onClick={() => {
                if (isEdit) {
                  setShowEditDepartment(false);
                  setEditingDepartment(null);
                } else {
                  setShowAddDepartment(false);
                }
                setDepartmentForm({ name: '', head: '', description: '' });
              }}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>
        </div>
        
        <form onSubmit={isEdit ? handleEditDepartment : handleAddDepartment} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department Name</label>
            <input
              type="text"
              value={departmentForm.name}
              onChange={(e) => setDepartmentForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter department name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department Head</label>
            <input
              type="text"
              value={departmentForm.head}
              onChange={(e) => setDepartmentForm(prev => ({ ...prev, head: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter department head name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={departmentForm.description}
              onChange={(e) => setDepartmentForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter department description"
              rows={3}
            />
          </div>
          
          <div className="flex space-x-3 mt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer whitespace-nowrap"
            >
              {isEdit ? 'Update Department' : 'Create Department'}
            </button>
            <button
              type="button"
              onClick={() => {
                if (isEdit) {
                  setShowEditDepartment(false);
                  setEditingDepartment(null);
                } else {
                  setShowAddDepartment(false);
                }
                setDepartmentForm({ name: '', head: '', description: '' });
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

  const SubjectModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Add New Subject</h3>
            <button
              onClick={() => {
                setShowAddSubject(false);
                setSubjectForm({ name: '', department: '', description: '', code: '' });
              }}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>
        </div>
        
        <form onSubmit={handleAddSubject} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject Name</label>
            <input
              type="text"
              value={subjectForm.name}
              onChange={(e) => setSubjectForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter subject name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject Code</label>
            <input
              type="text"
              value={subjectForm.code}
              onChange={(e) => setSubjectForm(prev => ({ ...prev, code: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter subject code (e.g., BIO101)"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              value={subjectForm.department}
              onChange={(e) => setSubjectForm(prev => ({ ...prev, department: e.target.value }))}
              className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Department</option>
              {departments.filter(d => d.status === 'Active').map(dept => (
                <option key={dept.id} value={dept.name}>{dept.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={subjectForm.description}
              onChange={(e) => setSubjectForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter subject description"
              rows={3}
            />
          </div>
          
          <div className="flex space-x-3 mt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer whitespace-nowrap"
            >
              Create Subject
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddSubject(false);
                setSubjectForm({ name: '', department: '', description: '', code: '' });
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
      <Sidebar userRole="Admin" currentPage="organization" />
      
      <div className="flex-1 overflow-y-auto p-2 ml-[256px]">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Organization Setup</h1>
            <p className="text-gray-600">Manage departments, subjects, and organizational structure</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6">
            <button
              onClick={() => setActiveTab('departments')}
              className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer whitespace-nowrap ${
                activeTab === 'departments'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Departments
            </button>
            <button
              onClick={() => setActiveTab('subjects')}
              className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer whitespace-nowrap ${
                activeTab === 'subjects'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Subjects
            </button>
          </div>

          {/* Departments Tab */}
          {activeTab === 'departments' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Departments</h2>
                <button
                  onClick={() => setShowAddDepartment(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-add-line mr-2"></i>
                  Add Department
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((department) => (
                  <div key={department.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{department.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        department.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {department.status}
                      </span>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <i className="ri-user-line w-4 h-4 mr-2"></i>
                        Head: {department.head}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <i className="ri-team-line w-4 h-4 mr-2"></i>
                        Teachers: {department.teacherCount}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <i className="ri-book-line w-4 h-4 mr-2"></i>
                        Subjects: {department.subjects.length}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <i className="ri-calendar-line w-4 h-4 mr-2"></i>
                        Created: {department.created}
                      </div>
                    </div>

                    {department.subjects.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-gray-700 mb-2">Subjects:</p>
                        <div className="flex flex-wrap gap-1">
                          {department.subjects.slice(0, 3).map((subject, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                              {subject}
                            </span>
                          ))}
                          {department.subjects.length > 3 && (
                            <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded">
                              +{department.subjects.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <button
                        onClick={() => {
                          setEditingDepartment(department);
                          setDepartmentForm({
                            name: department.name,
                            head: department.head,
                            description: ''
                          });
                          setShowEditDepartment(true);
                        }}
                        className="text-blue-600 hover:text-blue-700 cursor-pointer text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteDepartment(department.id)}
                        className="text-red-600 hover:text-red-700 cursor-pointer text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subjects Tab */}
          {activeTab === 'subjects' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Subjects</h2>
                <button
                  onClick={() => setShowAddSubject(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-add-line mr-2"></i>
                  Add Subject
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Subject</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Department</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Teachers</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Books</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects.map((subject) => (
                        <tr key={subject.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {subject.name.substring(0, 2)}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{subject.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-gray-600">{subject.department}</td>
                          <td className="py-4 px-6 text-gray-600">{subject.teacherCount}</td>
                          <td className="py-4 px-6 text-gray-600">{subject.booksCount}</td>
                          <td className="py-4 px-6">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              subject.status === 'Active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {subject.status}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-700 cursor-pointer">
                                <i className="ri-edit-line"></i>
                              </button>
                              <button 
                                onClick={() => deleteSubject(subject.id)}
                                className="text-red-600 hover:text-red-700 cursor-pointer"
                              >
                                <i className="ri-delete-bin-line"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showAddDepartment && <DepartmentModal />}
      {showEditDepartment && <DepartmentModal isEdit={true} />}
      {showAddSubject && <SubjectModal />}
    </div>
  );
}