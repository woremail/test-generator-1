'use client';

import Sidebar from '@/components/Sidebar';
import Link from 'next/link';

const CircularProgress = ({ percentage }: { percentage: number }) => {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-20 h-20">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-gray-200"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        <circle
          className="text-yellow-400"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="50" className="text-xl font-bold text-white" textAnchor="middle" alignmentBaseline="middle">{percentage}%</text>
      </svg>
    </div>
  );
};

export default function StudentDashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar userRole="Student" currentPage="dashboard" />

      <main className="flex-1 p-8 ml-64">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
          <div className="flex items-center space-x-4">
            <i className="ri-notification-3-line text-2xl text-gray-500"></i>
            <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div>
                    <p className="font-semibold text-gray-800">Zara Shahid</p>
                    <p className="text-sm text-gray-500">Student</p>
                </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-teal-50 p-6 rounded-lg flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Welcome back, Zara!</h2>
                    <p className="text-gray-600">Ready to challenge yourself with a new quiz today?</p>
                </div>
                <img src="/school_logo.png" alt="School Logo" className="w-16 h-16"/>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="bg-[#3F9266] text-white p-6 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-4xl font-bold">15</p>
                    <p>Quizzes Attempted</p>
                  </div>
                  <i className="ri-file-text-line text-4xl"></i>
              </div>
              <div className="bg-[#3F9266] text-white p-6 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-4xl font-bold">5</p>
                    <p>Pending Quizzes</p>
                  </div>
                  <i className="ri-file-list-3-line text-4xl"></i>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
             <div className="bg-[#3F9266] text-white p-6 rounded-lg">
                <p className="text-lg">Average Score</p>
                <div className="flex items-center justify-between">
                    <p className="text-4xl font-bold">85%</p>
                    <CircularProgress percentage={85}/>
                </div>
            </div>
            <div className="bg-[#3F9266] text-white p-6 rounded-lg">
                <p className="text-lg">Last Quiz Score</p>
                <div className="flex items-center justify-between">
                    <p className="text-4xl font-bold">90%</p>
                    <CircularProgress percentage={90}/>
                </div>
            </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Pending Quizzes</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border-l-4 border-red-500">
                  <div>
                    <p className="font-bold text-gray-800">Science Quiz</p>
                    <p className="text-sm text-gray-500">Science</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                      <span><i className="ri-time-line"></i> 30 Minutes</span>
                      <span><i className="ri-question-line"></i> 10 Questions</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">September 12, 2:00 PM - 2:30 PM</p>
                    <p className="text-xs text-gray-400">(Today)</p>
                    <Link href="#" className="bg-gray-800 text-white px-4 py-2 rounded-lg mt-2 inline-block">View</Link>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border-l-4 border-yellow-500">
                  <div>
                    <p className="font-bold text-gray-800">Physics Midterm Exam</p>
                    <p className="text-sm text-gray-500">Physics</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                      <span><i className="ri-time-line"></i> 90 Minutes</span>
                      <span><i className="ri-question-line"></i> 40 Questions</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">September 13, 2:00 PM - 3:30 PM</p>
                    <p className="text-xs text-gray-400">(Tomorrow)</p>
                    <Link href="#" className="bg-gray-800 text-white px-4 py-2 rounded-lg mt-2 inline-block">View</Link>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border-l-4 border-yellow-500">
                  <div>
                    <p className="font-bold text-gray-800">English Grammar Test</p>
                    <p className="text-sm text-gray-500">English</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                      <span><i className="ri-time-line"></i> 60 Minutes</span>
                      <span><i className="ri-question-line"></i> 20 Questions</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">September 15, 12:00 PM - 1:00 PM</p>
                    <p className="text-xs text-gray-400">(3 days to go)</p>
                    <Link href="#" className="bg-gray-800 text-white px-4 py-2 rounded-lg mt-2 inline-block">View</Link>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font- bold text-gray-800 mb-4">Recent Scores</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <div>
                            <p className="font-bold text-gray-800">Chemistry Basics Quiz</p>
                            <p className="text-sm text-gray-500">2 days ago</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-green-700 text-lg">A</p>
                            <p className="text-sm text-green-700">90%</p>
                        </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                        <div>
                            <p className="font-bold text-gray-800">History Knowledge Test</p>
                            <p className="text-sm text-gray-500">5 days ago</p>
                        </div>
                        <div   className="text-right">
                            <p className="font-bold text-yellow-700 text-lg">B</p>
                            <p className="text-sm text-yellow-700">78%</p>
                        </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <div>
                            <p className="font-bold text-gray-800">Biology Chapter 4</p>
                            <p className="text-sm text-gray-500">1 week ago</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-green-700 text-lg">A+</p>
                            <p className="text-sm text-green-700">95%</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Latest Achievements</h3>
                <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-3 bg-yellow-50 rounded-lg">
                        <i className="ri-award-line text-3xl text-yellow-500"></i>
                        <div>
                            <p className="font-bold text-gray-800">You are a Quiz Master</p>
                            <p className="text-sm text-gray-500">Completed 10 quizzes in a row!</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 p-3 bg-yellow-50 rounded-lg">
                        <i className="ri-star-line text-3xl text-yellow-500"></i>
                        <div>
                            <p className="font-bold text-gray-800">You got a Perfect Score</p>
                            <p className="text-sm text-gray-500">Achieved 100% on a quiz!</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
