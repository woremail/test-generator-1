'use client';

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import StatCard from '@/components/StatCard';

export default function TeacherDashboard() {
  const [showQuizPreview, setShowQuizPreview] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);

  const assignedBooks = [
    { id: 1, title: 'Science Explorer', subject: 'Science', chapters: 3, questions: 63, status: 'Active' },
    { id: 2, title: 'Math', subject: 'Mathematics', chapters: 3, questions: 67, status: 'Active' },
    { id: 3, title: 'English', subject: 'English', chapters: 3, questions: 50, status: 'Active' },
    { id: 4, title: 'Science Discoveries', subject: 'Science', chapters: 3, questions: 72, status: 'Active' },
    { id: 5, title: 'Math Essentials', subject: 'Mathematics', chapters: 3, questions: 74, status: 'Active' },
    { id: 6, title: 'English Skills Builder', subject: 'English', chapters: 3, questions: 60, status: 'Active' },
  ];

  const [recentQuizzes, setRecentQuizzes] = useState([
    { id: 1, title: 'Science Explorer Chapter 1 Quiz', date: '2024-01-15', questions: 20, type: 'Chapter', status: 'Active' },
    { id: 2, title: 'Math Basics Mixed Quiz', date: '2024-01-14', questions: 15, type: 'Multiple Chapters', status: 'Active' },
    { id: 3, title: 'Full English Foundations Assessment', date: '2024-01-13', questions: 50, type: 'Full Book', status: 'Draft' },
    { id: 4, title: 'Science Discoveries Chapter 2 Quiz', date: '2024-01-12', questions: 18, type: 'Chapter', status: 'Active' },
  ]);

  const todoItems = [
    { id: 1, task: 'Add questions for Science Explorer Chapter 2', priority: 'High', dueDate: '2024-01-20' },
    { id: 2, task: 'Review Math Essentials Chapter 1 content', priority: 'Medium', dueDate: '2024-01-22' },
    { id: 3, task: 'Create quiz for English Skills Builder', priority: 'Low', dueDate: '2024-01-25' },
  ];

  const viewQuiz = (quiz: any) => {
    setSelectedQuiz({
      ...quiz,
      sampleQuestions: [
        { id: 1, question: 'What is the main function of mitochondria?', type: 'Multiple Choice' },
        { id: 2, question: 'DNA replication occurs in the nucleus.', type: 'True/False' },
        { id: 3, question: 'Explain the process of photosynthesis.', type: 'Short Answer' }
      ]
    });
    setShowQuizPreview(true);
  };

  const editQuiz = (quiz: any) => {
    alert(`Editing quiz: ${quiz.title}`);
    // Here you would typically navigate to edit page or open edit modal
  };

  const deleteQuiz = (quizId: number) => {
    if (confirm('Are you sure you want to delete this quiz?')) {
      setRecentQuizzes(prev => prev.filter(q => q.id !== quizId));
      alert('Quiz deleted successfully!');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole="Teacher" currentPage="dashboard" />
      
      <div className="flex-1 overflow-y-auto p-8 ml-[256px]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Teacher Dashboard</h1>
          <p className="text-gray-600">Good morning! Ready to create some engaging quizzes today?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Assigned Books"
            value="3"
            icon="ri-book-line"
            color="blue"
          />
          <StatCard
            title="Total Questions"
            value="310"
            icon="ri-question-answer-line"
            color="green"
            trend={{ value: "+15", isPositive: true }}
          />
          <StatCard
            title="Quizzes Created"
            value="28"
            icon="ri-file-list-3-line"
            color="purple"
            trend={{ value: "+4", isPositive: true }}
          />
          <StatCard
            title="Chapters Completed"
            value="22"
            icon="ri-bookmark-line"
            color="orange"
            trend={{ value: "73%", isPositive: true }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Assigned Books</h3>
              <Link href="/teacher/books" className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer whitespace-nowrap">
                Manage Books
              </Link>
            </div>
            <div className="space-y-4">
              {assignedBooks.map((book) => (
                <div key={book.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-200 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{book.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      book.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {book.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{book.subject}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <i className="ri-book-open-line mr-1"></i>
                      {book.chapters} chapters
                    </span>
                    <span className="flex items-center">
                      <i className="ri-question-line mr-1"></i>
                      {book.questions} questions
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">To-Do List</h3>
              <button className="text-blue-600 hover:text-blue-700 cursor-pointer">
                <i className="ri-add-line text-lg"></i>
              </button>
            </div>
            <div className="space-y-3">
              {todoItems.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">{item.task}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      item.priority === 'High' 
                        ? 'bg-red-100 text-red-800'
                        : item.priority === 'Medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {item.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Due: {item.dueDate}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Quizzes</h3>
            <Link href="/teacher/quiz" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg cursor-pointer whitespace-nowrap">
              <i className="ri-add-line mr-2"></i>
              Generate Quiz
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Quiz Title</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Questions</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentQuizzes.map((quiz) => (
                  <tr key={quiz.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">{quiz.title}</span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{quiz.date}</td>
                    <td className="py-4 px-4 text-gray-600">{quiz.questions}</td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {quiz.type}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => viewQuiz(quiz)}
                          className="text-blue-600 hover:text-blue-700 cursor-pointer"
                          title="View Quiz"
                        >
                          <i className="ri-eye-line"></i>
                        </button>
                        <button 
                          onClick={() => editQuiz(quiz)}
                          className="text-gray-600 hover:text-gray-700 cursor-pointer"
                          title="Edit Quiz"
                        >
                          <i className="ri-edit-line"></i>
                        </button>
                        <button 
                          onClick={() => deleteQuiz(quiz.id)}
                          className="text-red-600 hover:text-red-700 cursor-pointer"
                          title="Delete Quiz"
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

        {/* Quiz Одна Preview Modal */}
        {showQuizPreview && selectedQuiz && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Quiz Details</h3>
                  <button
                    onClick={() => setShowQuizPreview(false)}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <i className="ri-close-line text-2xl"></i>
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Quiz Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-600">Title:</span> {selectedQuiz.title}</p>
                      <p><span className="text-gray-600">Date Created:</span> {selectedQuiz.date}</p>
                      <p><span className="text-gray-600">Total Questions:</span> {selectedQuiz.questions}</p>
                      <p><span className="text-gray-600">Type:</span> {selectedQuiz.type}</p>
                      <p><span className="text-gray-600">Status:</span> 
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          selectedQuiz.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedQuiz.status}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Sample Questions</h4>
                    <div className="space-y-2">
                      {selectedQuiz.sampleQuestions.map((q: any) => (
                        <div key={q.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-500">{q.type}</span>
                          </div>
                          <p className="text-sm text-gray-900">{q.question}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => editQuiz(selectedQuiz)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-edit-line mr-2"></i>
                    Edit Quiz
                  </button>
                  <button
                    onClick={() => {
                      alert(`Quiz "${selectedQuiz.title}" downloaded!`);
                      setShowQuizPreview(false);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-download-line mr-2"></i>
                    Download
                  </button>
                  <button
                    onClick={() => setShowQuizPreview(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer whitespace-nowrap"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}