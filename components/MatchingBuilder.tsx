import { useState, useEffect } from "react";
import { MatchingQuestion } from "@/types/types";

type QuizItem = {
  id: string;
  label: string;
  match: string;
};

type Props = {
  question: MatchingQuestion;
  onUpdate: (updated: MatchingQuestion) => void;
};

export default function MatchingBuilder({ question, onUpdate }: Props) {
  const [items, setItems] = useState<QuizItem[]>(question.items || []);

  useEffect(() => {
    if (typeof onUpdate === "function") {
      onUpdate({ ...question, items });
    } else {
      console.warn("onUpdate is not a function:", onUpdate);
    }
  }, [items, question, onUpdate]);

  const handleAddPair = () => {
    const newItem: QuizItem = {
      id: Date.now().toString(),
      label: "",
      match: "",
    };
    setItems([...items, newItem]);
  };

  const handleChange = (index: number, field: keyof QuizItem, value: string) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  console.log("MatchingBuilder props:", { question, onUpdate });

  return (
    <div className="space-y-4">
      <p className="font-semibold text-gray-700">🔗 Matching Pairs</p>
      {items.map((item, idx) => (
        <div key={item.id} className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Left Item"
            value={item.label}
            onChange={(e) => handleChange(idx, "label", e.target.value)}
            className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Right Item"
            value={item.match}
            onChange={(e) => handleChange(idx, "match", e.target.value)}
            className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
      ))}
      <button
        onClick={handleAddPair}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
      >
        + Add Pair
      </button>
    </div>
  );
}