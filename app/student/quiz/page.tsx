'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  subject: string;
  grade: string;
  type: string;
}

export default function QuizGeneratorPage() {
  const [subject, setSubject] = useState('');
  const [sloOption, setSloOption] = useState('all');
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [grade, setGrade] = useState('4'); // Hardcoded to Grade 4
  const [questionType, setQuestionType] = useState('');
  const [quizHistory, setQuizHistory] = useState<
    { id: number; subject: string; grade: string; score: number; date: string }[]
  >([]);

  const sampleQuestions: Question[] = []; // This is a large array, keeping it empty for brevity

  const handleGenerateQuiz = () => {
    if (!subject || !questionType) {
      alert('Please select both subject and question type.');
      return;
    }
    const filteredQuestions = sampleQuestions.filter(
      (q) =>
        q.subject === subject &&
        q.grade === grade &&
        q.type === questionType
    );
    if (filteredQuestions.length === 0) {
      alert(`No questions available for ${subject} in Grade ${grade} (${questionType}).`);
      return;
    }
    setQuestions(filteredQuestions);
    setQuizStarted(true);
    setShowResults(false);
    setAnswers({});
  };

  const handleAnswerChange = (questionId: number, selected: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selected }));
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
    const score = calculateScore();
    const newRecord = {
      id: Date.now(),
      subject,
      grade,
      score,
      date: new Date().toLocaleDateString(),
    };
    const existingHistory = JSON.parse(localStorage.getItem('quizHistory') || '[]');
    localStorage.setItem('quizHistory', JSON.stringify([...existingHistory, newRecord]));
    setQuizHistory([...existingHistory, newRecord]);
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) score++;
    });
    return score;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userRole="Student" currentPage="generate" />

      <main className="flex-1 p-6 space-y-6 ml-64">
        <h1 className="text-2xl font-bold text-gray-900">Generate Quiz</h1>

        {!quizStarted && (
          <div className="space-y-4 max-w-xl">
            <p className="text-sm text-gray-700"><strong>Grade:</strong> Grade 4</p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              >
                <option value="">-- Choose Subject --</option>
                <option value="Math">Math</option>
                <option value="Science">Science</option>
                <option value="Urdu">Urdu</option>
                <option value="Computer">Computer</option>
                <option value="English">English</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Question Type</label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              >
                <option value="">-- Choose Type --</option>
                <option value="mcqs">MCQs</option>
                <option value="fill">Fill in the Blanks</option>
                <option value="truefalse">True/False</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Choose SLO Option</label>
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="all"
                    checked={sloOption === 'all'}
                    onChange={() => setSloOption('all')}
                  />
                  <span>All SLOs</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="single"
                    checked={sloOption === 'single'}
                    onChange={() => setSloOption('single')}
                  />
                  <span>Single SLO</span>
                </label>
              </div>
            </div>

            <button
              onClick={handleGenerateQuiz}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Generate Quiz
            </button>
          </div>
        )}

        {quizStarted && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Attempt Quiz</h2>
            {questions.map((q) => (
              <div key={q.id} className="bg-white p-4 rounded-lg border space-y-2">
                <p className="font-medium">{q.question}</p>
                <div className="space-y-1">
                  {q.options.map((opt) => (
                    <label key={opt} className="block">
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={() => handleAnswerChange(q.id, opt)}
                        className="mr-2"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
                {showResults && (
                  <p className={`text-sm mt-2 ${answers[q.id] === q.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
                    {answers[q.id] === q.correctAnswer
                      ? 'Correct!'
                      : `Incorrect. Correct answer: ${q.correctAnswer}`}
                  </p>
                )}
              </div>
            ))}

            {!showResults ? (
              <button
                onClick={handleSubmitQuiz}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Submit Quiz
              </button>
            ) : (
              <div className="mt-4 space-y-6">
                <div className="text-lg font-semibold text-gray-800">
                  Your Score: {calculateScore()} / {questions.length}
                </div>
                <div className="text-center">
                  <button
                    onClick={() => {
                      setQuizStarted(false);
                      setShowResults(false);
                      setAnswers({});
                      setSubject('');
                      setQuestionType('');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    Create Another Quiz
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {quizStarted && (
        <aside className="w-80 bg-white border-l border-gray-200 p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">Quiz Summary</h2>
          <div className="text-sm text-gray-700 space-y-2">
            <p><strong>Grade:</strong> {grade}</p>
            <p><strong>Subject:</strong> {subject}</p>
            <p><strong>SLO Option:</strong> {sloOption === 'all' ? 'All SLOs' : 'Single SLO'}</p>
            <p><strong>Questions Requested:</strong> {questions.length}</p>
            <p><strong>Questions Available:</strong> {questions.length}</p>
          </div>
        </aside>
      )}
    </div>
  );
}
