'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { FiHome, FiPlus, FiBook, FiEdit, FiCheckSquare, FiLogOut, FiUsers, FiAward, FiBell, FiBookmark, FiClock, FiFileText } from 'react-icons/fi';
import { FaBook, FaPencilAlt, FaClipboardList, FaTasks } from 'react-icons/fa';

const StatCard = ({ title, value, icon, color, progress }: { title: string, value: string, icon: React.ReactNode, color: string, progress?: number }) => (
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
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              r="28"
              cx="32"
              cy="32"
              strokeDasharray={2 * Math.PI * 28}
              strokeDashoffset={2 * Math.PI * 28 * (1 - progress / 100)}
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

const AssignedBookItem = ({ title, subject, chapters, questions, status }: { title: string, subject: string, chapters: number, questions: number, status: string }) => (
  <div className="bg-white p-4 rounded-2xl border border-gray-200 flex items-center justify-between">
    <div>
      <h4 className="font-bold text-gray-800">{title}</h4>
      <p className="text-sm text-gray-500">{subject}</p>
      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
        <span className="flex items-center"><FaBook className="mr-2" />{chapters} Chapters</span>
        <span className="flex items-center"><FaPencilAlt className="mr-2" />{questions} Questions</span>
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <button className={`px-4 py-2 rounded-full text-sm font-semibold ${status === 'Active' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
        {status}
      </button>
      <button className="text-gray-400 hover:text-gray-600"><FiEdit size={20} /></button>
    </div>
  </div>
);

const TodoItem = ({ task, date, color }: { task: string, date: string, color: string }) => (
    <div className="bg-white p-4 rounded-2xl border-l-4" style={{ borderColor: color }}>
        <div className="flex items-center justify-between">
            <div>
                <p className="font-semibold text-gray-800">{task}</p>
                <p className="text-sm text-gray-500 mt-1">{date}</p>
            </div>
            <button className="text-blue-600 bg-blue-100 rounded-full p-2">
                <FiCheckSquare size={20} />
            </button>
        </div>
    </div>
);


export default function TeacherDashboard() {
  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Sidebar userRole="Teacher" currentPage="dashboard" />
      
      <main className="flex-1 p-8 ml-[256px]">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Teacher Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-semibold text-gray-800">Afra</p>
              <p className="text-sm text-gray-500">Science Teacher</p>
            </div>
            <div className="w-12 h-12 bg-pink-100 rounded-full"></div>
          </div>
        </header>

        <section className="bg-[#FFDBBB] p-6 rounded-2xl mb-8">
          <h2 className="text-2xl font-bold text-orange-900">Welcome back, Afra!</h2>
          <p className="text-gray-600">Here is an overview of your quiz activities.</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Assigned Books" value="3" icon={<FaBook />} color="bg-[#FF7A50]" />
            <StatCard title="Total Questions" value="151" icon={<FaPencilAlt />} color="bg-[#FF7A50]" />
            <StatCard title="Quizzes Created" value="28" icon={<FaClipboardList />} color="bg-[#FF7A50]" />
            <StatCard title="Chapters Completed" value="22" icon={<FaTasks />} color="bg-[#FF7A50]" progress={73} />
        </section>


        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Assigned Books</h3>
              <button className="text-blue-600 bg-blue-100 rounded-full p-2"><FiPlus size={20} /></button>
            </div>
            <div className="space-y-4">
                <AssignedBookItem title="Science Explorer" subject="Science" chapters={3} questions={63} status="Active" />
                <AssignedBookItem title="Math Understood" subject="Mathematics" chapters={5} questions={67} status="Active" />
                <AssignedBookItem title="Spirit School" subject="English" chapters={2} questions={21} status="Completed" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">To-Do List</h3>
              <button className="text-orange-600 bg-orange-100 rounded-full p-2"><FiPlus size={20} /></button>
            </div>
            <div className="space-y-4">
                <TodoItem task="Add Questions for Science Explorer Chapter 2" date="January 5, 2025" color="#FF7A50" />
                <TodoItem task="Review Math Essential Chapter 1 Content" date="January 10, 2025" color="#FFC107" />
                <TodoItem task="Create Quiz for English Skills Builder" date="January 12, 2025" color="#4CAF50" />
                <TodoItem task="Check Student List for Social Sciences" date="January 12, 2025" color="#2196F3" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

