'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  userRole: 'Admin' | 'Teacher' | 'Student';
  currentPage: string;
}

export default function Sidebar({ userRole, currentPage }: SidebarProps) { 
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();

  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'ri-dashboard-line', href: '/admin/dashboard' },
    { id: 'users', label: 'User Management', icon: 'ri-user-settings-line', href: '/admin/users' },
    { id: 'organization', label: 'Organization Setup', icon: 'ri-building-line', href: '/admin/organization' },
    { id: 'monitoring', label: 'Content Monitoring', icon: 'ri-shield-check-line', href: '/admin/monitoring' },
    { id: 'profile', label: 'Profile & Settings', icon: 'ri-settings-line', href: '/admin/profile' },
  ];

  const teacherMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'ri-dashboard-line', href: '/teacher/dashboard' },
    { id: 'books', label: 'Books & Chapters', icon: 'ri-book-line', href: '/teacher/books' },
    { id: 'questions', label: 'Question Bank', icon: 'ri-question-answer-line', href: '/teacher/questions' },
    { id: 'quiz', label: 'Quiz Generator', icon: 'ri-file-list-3-line', href: '/teacher/quiz' },
    { id: 'interactiveQuiz', label: 'Interactive Quiz', icon: 'ri-file-list-3-line', href: '/teacher/interactiveQuiz' },
    { id: 'profile', label: 'Profile', icon: 'ri-user-line', href: '/teacher/profile' },
  ];

  const studentMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'ri-dashboard-line', href: '/student/dashboard' },
    { id: 'generate', label: 'Generate Quiz', icon: 'ri-lightbulb-line', href: '/student/quiz' },
    { id: 'history', label: 'Quiz History', icon: 'ri-history-line', href: '/student/history' },
    { id: 'favorites', label: 'Favorite Quizzes', icon: 'ri-heart-line', href: '/student/favorites' },
    { id: 'notifications', label: 'Notifications', icon: 'ri-notification-3-line', href: '/student/notifications' },
    { id: 'profile', label: 'Profile', icon: 'ri-user-line', href: '/student/profile' },
  ];

  const menuItems =
    userRole === 'Admin'
      ? adminMenuItems
      : userRole === 'Teacher'
      ? teacherMenuItems
      : studentMenuItems;

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <div className={`fixed top-0 left-0 bg-[#002147] border-r border-gray-200 h-screen transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} z-10`}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-white">Test Generator</h1>
                <p className="text-xs text-gray-300">{userRole} Panel</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-blue-900 cursor-pointer"
          >
            <i className={`ri-menu-${isCollapsed ? 'unfold' : 'fold'}-line text-gray-300`}></i>
          </button>
        </div>
      </div>

      <nav className="px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors cursor-pointer ${
                  currentPage === item.id
                    ? 'bg-blue-800 text-white border-r-2 border-white'
                    : 'text-gray-300 hover:bg-blue-900'
                }`}
              >
                <i className={`${item.icon} w-5 h-5 flex items-center justify-center`}></i>
                {!isCollapsed && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-6 left-0 right-0 px-4">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-300 hover:bg-blue-900 transition-colors cursor-pointer"
        >
          <i className="ri-logout-box-line w-5 h-5 flex items-center justify-center"></i>
          {!isCollapsed && <span className="text-sm font-medium whitespace-nowrap">Logout</span>}
        </button>
      </div>
    </div>
  );
}