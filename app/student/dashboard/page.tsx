'use client';

import Sidebar from '@/components/Sidebar';
import StatCard from '@/components/StatCard';
import Link from 'next/link';

export default function StudentDashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar userRole="Student" currentPage="dashboard" />

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6 ml-64">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-sm text-gray-600">Good morning! Ready to challenge yourself with a new quiz today?</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Quizzes Attempted"
            value={15}
            icon="ri-file-list-3-line"
            color="blue"
            trend={{ value: '+2 this week', isPositive: true }}
          />
          <StatCard
            title="Average Score"
            value="82%"
            icon="ri-bar-chart-line"
            color="green"
            trend={{ value: '+5%', isPositive: true }}
          />
          <StatCard
            title="Favorite Quizzes"
            value={5}
            icon="ri-heart-line"
            color="purple"
          />
          <StatCard
            title="Last Quiz Performance"
            value="90%"
            icon="ri-check-line"
            color="orange"
            trend={{ value: 'Excellent', isPositive: true }}
          />
        </div>

        {/* Navigation Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Link href="/student/quizgenerator" className="bg-blue-600 text-white px-4 py-3 rounded-lg text-center hover:bg-blue-700 transition">
            Go to Quiz Generator
          </Link>
          <Link href="/student/quizhistory" className="bg-green-600 text-white px-4 py-3 rounded-lg text-center hover:bg-green-700 transition">
            View Quiz History
          </Link>
          <Link href="/student/notifications" className="bg-purple-600 text-white px-4 py-3 rounded-lg text-center hover:bg-purple-700 transition">
            Check Notifications
          </Link>
        </div>
      </main>
    </div>
  );
}
