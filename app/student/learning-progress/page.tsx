'use client';

import Sidebar from '@/components/Sidebar';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import React from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

export default function LearningProgressPage() {
  const scoreTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July'],
    datasets: [
      { label: 'Biology', data: [80, 82, 85, 83, 88, 90, 92], borderColor: '#22C55E', backgroundColor: '#22C55E' },
      { label: 'Physics', data: [75, 78, 76, 80, 82, 85, 84], borderColor: '#3B82F6', backgroundColor: '#3B82F6' },
      { label: 'Chemistry', data: [70, 72, 74, 73, 75, 78, 77], borderColor: '#F59E0B', backgroundColor: '#F59E0B' },
      { label: 'Maths', data: [85, 88, 90, 92, 94, 95, 96], borderColor: '#F97316', backgroundColor: '#F97316' },
      { label: 'English', data: [78, 80, 82, 81, 83, 84, 86], borderColor: '#8B5CF6', backgroundColor: '#8B5CF6' },
      { label: 'History', data: [65, 68, 70, 69, 72, 74, 75], borderColor: '#EF4444', backgroundColor: '#EF4444' },
    ],
  };

  const dailyStudyTimeData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      { label: 'Study Time (hours)', data: [2, 3, 4, 2.5, 1, 5, 2], backgroundColor: '#10B981' },
    ],
  };

  const StatCard = ({ title, value, icon, color, progress }: { title: string, value: string, icon?: React.ReactNode, color: string, progress?: number }) => (
    <div className={`${color} p-6 rounded-2xl text-white`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-4xl font-bold">{value}</p>
        </div>
        {progress ? (
          <div className="relative">
            <svg className="w-16 h-16">
              <circle className="text-white opacity-20" stroke="currentColor" strokeWidth="4" fill="transparent" r="28" cx="32" cy="32" />
              <circle
                className="text-white"
                stroke="yellow"
                strokeWidth="7"
                fill="transparent"
                r="28"
                cx="32"
                cy="32"
                strokeDasharray={2 * Math.PI * 28}
                strokeDashoffset={2 * Math.PI * 28 * (1 - (progress || 0) / 100)}
                strokeLinecap="round"
                transform="rotate(-90 32 32)"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">{progress}%</span>
          </div>
        ) : (
          <div className="text-4xl opacity-80">{icon}</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole="Student" currentPage="learning-progress" />
      <main className="flex-1 p-6 space-y-6 ml-64">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Learning Progress</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              <div>
                <p className="font-semibold text-gray-800">Zara Shahid</p>
                <p className="text-sm text-gray-500">Student</p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Score Trend</h2>
            <Line data={scoreTrendData} />
          </div>
          <div className="space-y-6">
            <StatCard title="Overall Average" value="85%" color="bg-green-600" progress={85} />
            <StatCard title="Completion Rate" value="96%" color="bg-green-600" progress={96} />
            <StatCard title="Study Time this Month" value="23.5 hours" color="bg-teal-500" icon={<i className="ri-time-line"></i>} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Subject Performance</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <p className="font-semibold">Mathematics</p>
                  <p className="text-sm text-green-500">Average: 91% (+5%)</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '91%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <p className="font-semibold">Physics</p>
                  <p className="text-sm text-green-500">Average: 89% (+3%)</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '89%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <p className="font-semibold">Biology</p>
                  <p className="text-sm text-green-500">Average: 95% (+8%)</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Daily Study Time</h2>
            <Bar data={dailyStudyTimeData} />
          </div>
        </div>
      </main>
    </div>
  );
}
