"use client";
import { useState } from "react";
import DragDropBuilder from "@/components/DragDropBuilder";
import MatchingBuilder from "@/components/MatchingBuilder";
import RankingBuilder from "@/components/RankingBuilder";
import OrderingBuilder from "@/components/OrderingBuilder";
import PreviewWrapper from "../interactiveQuiz/previews/PreviewWrapper";
import Sidebar from "@/components/Sidebar";

import {
  QuizType,
  QuestionMap,
  QuizMeta,
} from "@/types/types";

const builderComponents: {
  [K in Exclude<QuizType, "">]: React.FC<{
    question: QuestionMap[K];
    onUpdate: (updated: QuestionMap[K]) => void;
  }>;
} = {
  "drag-drop": DragDropBuilder,
  matching: MatchingBuilder,
  ranking: RankingBuilder,
  ordering: OrderingBuilder,
};
type QuizItem = {
  id: string;
  label: string;
  match: string;
};

type Question = {
  prompt: string;
  items: QuizItem[];
};

export default function CreateInteractiveQuiz() {
  const [quizMeta, setQuizMeta] = useState<QuizMeta>({
    grade: "",
    subject: "",
    chapter: "",
    topic: "",
    type: "",
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [previewMode, setPreviewMode] = useState(false);

  const handleAddQuestion = () => {
    setQuestions([...questions, { prompt: "", items: [] }]);
  };

  const handleUpdateQuestion = (index: number, updatedQuestion: Question) => {
    const updated = [...questions];
    updated[index] = updatedQuestion;
    setQuestions(updated);
  };

  const handleSaveQuiz = () => {
    console.log("Quiz Metadata:", quizMeta);
    console.log("Questions:", questions);
    alert("Quiz saved locally! (Firebase not yet connected)");
  };

  return (
  <div className="flex h-screen bg-gray-50">
      <Sidebar userRole="Teacher" currentPage="interactiveQuiz" />

      <div className="p-6 w-full md:w-3/4 mx-auto  p-8 ml-[256px]">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">🧠 Create Interactive Quiz</h1>

        {/* Quiz Metadata */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">📋 Quiz Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setQuizMeta({ ...quizMeta, grade: e.target.value })}
            >
              <option value="">Select Grade</option>
              <option value="3">Grade 3</option>
              <option value="4">Grade 4</option>
              <option value="5">Grade 5</option>
            </select>

            <select
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setQuizMeta({ ...quizMeta, subject: e.target.value })}
            >
              <option value="">Select Subject</option>
              <option value="English">English</option>
              <option value="Urdu">Urdu</option>
              <option value="Math">Math</option>
              <option value="Science">Science</option>
              <option value="Computer">Computer</option>
            </select>

            <input
              type="text"
              placeholder="Chapter"
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setQuizMeta({ ...quizMeta, chapter: e.target.value })}
            />
            <input
              type="text"
              placeholder="Topic"
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setQuizMeta({ ...quizMeta, topic: e.target.value })}
            />

            <select
              onChange={(e) =>
                setQuizMeta({ ...quizMeta, type: e.target.value as QuizMeta["type"] })
              }
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Quiz Type</option>
              <option value="drag-drop">Drag & Drop</option>
              <option value="matching">Matching</option>
              <option value="ranking">Ranking</option>
              <option value="ordering">Ordering</option>
            </select>
          </div>
        </div>

        {/* Question Builder */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">🧩 Questions</h2>
            <button
              onClick={handleAddQuestion}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
            >
              + Add Question
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {questions.map((q, idx) => {
              const BuilderComponent =
                quizMeta.type !== "" ? builderComponents[quizMeta.type] : null;

              return (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 mb-2">
                    {/* Placeholder for icon based on quiz type */}
                    <div className="w-full h-full bg-gray-200 rounded-full"></div>
                  </div>
                  <input
                    type="text"
                    placeholder="Question Prompt"
                    className="w-full mb-2 border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
                    value={q.prompt}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[idx].prompt = e.target.value;
                      setQuestions(updated);
                    }}
                  />
                  <div className="flex space-x-2">
                    <button className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-sm">
                      Tutorial
                    </button>
                    <button className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-sm">
                      Demo
                    </button>
                  </div>
                  {!previewMode && BuilderComponent && (
                    <BuilderComponent
                      question={q}
                      onUpdate={(updatedQuestion: Question) =>
                        handleUpdateQuestion(idx, updatedQuestion)
                      }
                    />
                  )}
                  {previewMode && (
                    <PreviewWrapper question={q} type={quizMeta.type as QuizType} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Preview Toggle */}
        <div className="mb-6">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="text-blue-600 hover:underline"
          >
            {previewMode ? "🔽 Hide Preview" : "🔼 Show Preview"}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-4 flex justify-end gap-4">
          <button
            onClick={handleSaveQuiz}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
          >
            💾 Save Quiz
          </button>
        </div>
      </div>
    </div>
  );
}