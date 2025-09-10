'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';

interface ContentItem {
  id: number;
  title: string;
  type: 'book' | 'question' | 'quiz';
  author: string;
  subject: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted: string;
  lastModified: string;
  flagged: boolean;
  views: number;
  reports: number;
}

interface ActivityLog {
  id: number;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  ip: string;
  status: 'success' | 'warning' | 'error';
}

export default function ContentMonitoring() {
  const [activeTab, setActiveTab] = useState('content');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);

  const [contentItems, setContentItems] = useState<ContentItem[]>([
    { id: 1, title: 'Advanced Biology Chapter 12', type: 'book', author: 'Sarah Johnson', subject: 'Biology', status: 'pending', submitted: '2024-01-15', lastModified: '2024-01-15', flagged: false, views: 45, reports: 0 },
    { id: 2, title: 'Photosynthesis Quiz Questions', type: 'question', author: 'Sarah Johnson', subject: 'Biology', status: 'approved', submitted: '2024-01-14', lastModified: '2024-01-14', flagged: true, views: 123, reports: 2 },
    { id: 3, title: 'Mathematics Final Exam', type: 'quiz', author: 'Mike Chen', subject: 'Mathematics', status: 'approved', submitted: '2024-01-13', lastModified: '2024-01-14', flagged: false, views: 89, reports: 0 },
    { id: 4, title: 'Chemistry Lab Manual', type: 'book', author: 'Emma Wilson', subject: 'Chemistry', status: 'rejected', submitted: '2024-01-12', lastModified: '2024-01-13', flagged: false, views: 12, reports: 1 },
    { id: 5, title: 'World War II Questions', type: 'question', author: 'Lisa Garcia', subject: 'History', status: 'pending', submitted: '2024-01-11', lastModified: '2024-01-12', flagged: false, views: 67, reports: 0 },
  ]);

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    { id: 1, user: 'Sarah Johnson', action: 'Created new book', target: 'Advanced Biology Chapter 12', timestamp: '2024-01-15 10:30 AM', ip: '192.168.1.101', status: 'success' },
    { id: 2, user: 'Mike Chen', action: 'Updated quiz questions', target: 'Mathematics Final Exam', timestamp: '2024-01-15 09:15 AM', ip: '192.168.1.102', status: 'success' },
    { id: 3, user: 'Emma Wilson', action: 'Failed login attempt', target: 'Admin Panel', timestamp: '2024-01-15 08:45 AM', ip: '192.168.1.103', status: 'error' },
    { id: 4, user: 'Lisa Garcia', action: 'Deleted question set', target: 'Ancient History Quiz', timestamp: '2024-01-14 04:20 PM', ip: '192.168.1.104', status: 'warning' },
    { id: 5, user: 'David Brown', action: 'Generated new quiz', target: 'Physics Chapter 5 Quiz', timestamp: '2024-01-14 02:30 PM', ip: '192.168.1.105', status: 'success' },
  ]);

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === '' || item.status === filterStatus;
    const matchesType = filterType === '' || item.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleBulkApprove = () => {
    if (selectedItems.length === 0) {
      alert('Please select items to approve');
      return;
    }
    
    setContentItems(prev => prev.map(item => 
      selectedItems.includes(item.id) 
        ? { ...item, status: 'approved' as const }
        : item
    ));
    
    setSelectedItems([]);
    alert(`${selectedItems.length} items approved successfully`);
  };

  const handleBulkReject = () => {
    if (selectedItems.length === 0) {
      alert('Please select items to reject');
      return;
    }
    
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      setContentItems(prev => prev.map(item => 
        selectedItems.includes(item.id) 
          ? { ...item, status: 'rejected' as const }
          : item
      ));
      
      setSelectedItems([]);
      alert(`${selectedItems.length} items rejected successfully`);
    }
  };

  const toggleSelection = (itemId: number) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const selectAll = () => {
    if (selectedItems.length === filteredContent.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredContent.map(item => item.id));
    }
  };

  const updateItemStatus = (itemId: number, status: 'approved' | 'rejected') => {
    setContentItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, status } : item
    ));
    alert(`Item ${status} successfully`);
  };

  const flagContent = (itemId: number) => {
    setContentItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, flagged: !item.flagged } : item
    ));
  };

  const viewDetails = (content: ContentItem) => {
    setSelectedContent(content);
    setShowDetails(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const ContentDetailsModal = () => (
    selectedContent && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-auto ">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Content Details</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <p className="text-gray-900">{selectedContent.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                  {selectedContent.type}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <p className="text-gray-900">{selectedContent.author}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <p className="text-gray-900">{selectedContent.subject}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(selectedContent.status)}`}>
                  {selectedContent.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Views</label>
                <p className="text-gray-900">{selectedContent.views}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Submitted</label>
                <p className="text-gray-900">{selectedContent.submitted}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reports</label>
                <p className="text-gray-900">{selectedContent.reports}</p>
              </div>
            </div>

            {selectedContent.reports > 0 && (
              <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                <h4 className="font-medium text-red-800 mb-2">Reports</h4>
                <p className="text-sm text-red-700">This content has been reported {selectedContent.reports} time(s). Please review carefully.</p>
              </div>
            )}

            <div className="flex space-x-3">
              {selectedContent.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      updateItemStatus(selectedContent.id, 'approved');
                      setShowDetails(false);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer whitespace-nowrap"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      updateItemStatus(selectedContent.id, 'rejected');
                      setShowDetails(false);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer whitespace-nowrap"
                  >
                    Reject
                  </button>
                </>
              )}
              <button
                onClick={() => flagContent(selectedContent.id)}
                className={`font-medium py-2 px-4 rounded-lg cursor-pointer whitespace-nowrap ${
                  selectedContent.flagged
                    ? 'bg-gray-600 hover:bg-gray-700 text-white'
                    : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                }`}
              >
                {selectedContent.flagged ? 'Unflag' : 'Flag'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userRole="Admin" currentPage="monitoring" />
      
      <div className="flex-1 overflow-y-auto p-2 ml-[256px]">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Monitoring</h1>
            <p className="text-gray-600">Monitor and moderate content, track user activities</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer whitespace-nowrap ${
                activeTab === 'content'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Content Review
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer whitespace-nowrap ${
                activeTab === 'activity'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Activity Logs
            </button>
          </div>

          {/* Content Review Tab */}
          {activeTab === 'content' && (
            <div>
              {/* Filters */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search Content</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Search..."
                      />
                      <i className="ri-search-line absolute left-3 top-2.5 text-gray-400"></i>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Types</option>
                      <option value="book">Books</option>
                      <option value="question">Questions</option>
                      <option value="quiz">Quizzes</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end space-x-2">
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setFilterStatus('');
                        setFilterType('');
                      }}
                      className=" bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg cursor-pointer whitespace-nowrap"
                    >
                      Clear Filters
                    </button>
                 
                    <button
                      onClick={handleBulkApprove}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-3 rounded-lg cursor-pointer whitespace-nowrap"
                    >
                      Bulk Approve
                    </button>
                    <button
                      onClick={handleBulkReject}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-3 rounded-lg cursor-pointer whitespace-nowrap"
                    >
                      Bulk Reject
                    </button>
                  
                  </div>
                </div>
              </div>

              {/* Content Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Content Items ({filteredContent.length})
                    </h3>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center text-sm text-gray-600">
                        <input
                          type="checkbox"
                          checked={selectedItems.length === filteredContent.length && filteredContent.length > 0}
                          onChange={selectAll}
                          className="mr-2"
                        />
                        Select All
                      </label>
                      {selectedItems.length > 0 && (
                        <span className="text-sm text-blue-600 font-medium">
                          {selectedItems.length} selected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">
                          <input
                            type="checkbox"
                            checked={selectedItems.length === filteredContent.length && filteredContent.length > 0}
                            onChange={selectAll}
                          />
                        </th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Content</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Type</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Author</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Views</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Reports</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContent.map((item) => (
                        <tr key={item.id} className={`border-b border-gray-100 hover:bg-gray-50 ${selectedItems.includes(item.id) ? 'bg-blue-50' : ''}`}>
                          <td className="py-4 px-6">
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(item.id)}
                              onChange={() => toggleSelection(item.id)}
                            />
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              {item.flagged && (
                                <i className="ri-flag-fill text-red-500"></i>
                              )}
                              <div>
                                <p className="font-medium text-gray-900">{item.title}</p>
                                <p className="text-sm text-gray-600">{item.subject}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                              {item.type}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-600">{item.author}</td>
                          <td className="py-4 px-6">
                            <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-600">{item.views}</td>
                          <td className="py-4 px-6">
                            {item.reports > 0 ? (
                              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                {item.reports}
                              </span>
                            ) : (
                              <span className="text-gray-400">0</span>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => viewDetails(item)}
                                className="text-blue-600 hover:text-blue-700 cursor-pointer"
                                title="View Details"
                              >
                                <i className="ri-eye-line"></i>
                              </button>
                              {item.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => updateItemStatus(item.id, 'approved')}
                                    className="text-green-600 hover:text-green-700 cursor-pointer"
                                    title="Approve"
                                  >
                                    <i className="ri-check-line"></i>
                                  </button>
                                  <button
                                    onClick={() => updateItemStatus(item.id, 'rejected')}
                                    className="text-red-600 hover:text-red-700 cursor-pointer"
                                    title="Reject"
                                  >
                                    <i className="ri-close-line"></i>
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => flagContent(item.id)}
                                className={`cursor-pointer ${item.flagged ? 'text-gray-600 hover:text-gray-700' : 'text-yellow-600 hover:text-yellow-700'}`}
                                title={item.flagged ? 'Unflag' : 'Flag'}
                              >
                                <i className={`ri-flag-${item.flagged ? 'fill' : 'line'}`}></i>
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

          {/* Activity Logs Tab */}
          {activeTab === 'activity' && (
            <div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">User</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Action</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Target</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Timestamp</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">IP Address</th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activityLogs.map((log) => (
                        <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {log.user.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span className="font-medium text-gray-900">{log.user}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-gray-600">{log.action}</td>
                          <td className="py-4 px-6 text-gray-600">{log.target}</td>
                          <td className="py-4 px-6 text-gray-600 text-sm">{log.timestamp}</td>
                          <td className="py-4 px-6 text-gray-600 text-sm font-mono">{log.ip}</td>
                          <td className="py-4 px-6">
                            <span className={`px-2 py-1 text-xs rounded-full ${getActivityStatusColor(log.status)}`}>
                              {log.status}
                            </span>
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

      {showDetails && <ContentDetailsModal />}
    </div>
  );
}