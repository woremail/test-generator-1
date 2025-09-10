'use client';

import Sidebar from '@/components/Sidebar';
import { useState } from 'react';

interface FavoriteQuiz {
  id: number;
  title: string;
  subject: string;
  grade: string;
  dateSaved: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteQuiz[]>([
    {
      id: 1,
      title: 'Algebra Basics',
      subject: 'Math',
      grade: '7',
      dateSaved: '2025-08-05',
    },
    {
      id: 2,
      title: 'Human Body Systems',
      subject: 'Science',
      grade: '7',
      dateSaved: '2025-08-03',
    },
  ]);

  const handleStartQuiz = (id: number) => {
    alert(`Starting favorite quiz ID: ${id}`);
    // Add navigation or logic to start quiz
  };

  const handleRemoveFavorite = (id: number) => {
    setFavorites((prev) => prev.filter((quiz) => quiz.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar userRole="Student" currentPage="favorites" />

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Favorite Quizzes</h1>
        <p className="text-sm text-gray-600">Access and manage your saved quizzes.</p>

        <div className="grid gap-4">
          {favorites.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{quiz.title}</h2>
                <p className="text-sm text-gray-500">
                  {quiz.subject} | Grade {quiz.grade} | Saved on {quiz.dateSaved}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleStartQuiz(quiz.id)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Start Quiz
                </button>
                <button
                  onClick={() => handleRemoveFavorite(quiz.id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          {favorites.length === 0 && (
            <p className="text-gray-500 text-sm">You haven’t saved any quizzes yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}
