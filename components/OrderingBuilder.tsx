import { useState, useEffect } from "react";

type QuizItem = {
  id: string;
  label: string;
};

type Question = {
  prompt: string;
  items: QuizItem[];
};

type Props = {
  question: Question;
  onUpdate: (updated: Question) => void;
};

export default function OrderingBuilder({ question, onUpdate }: Props) {
  const [items, setItems] = useState<QuizItem[]>(question.items || []);

  useEffect(() => {
    onUpdate({ ...question, items });
  }, [items]);

  const handleAddStep = () => {
    const newItem: QuizItem = {
      id: Date.now().toString(),
      label: "",
    };
    setItems([...items, newItem]);
  };

  const handleChange = (index: number, value: string) => {
    const updated = [...items];
    updated[index].label = value;
    setItems(updated);
  };

  return (
    <div className="space-y-4">
      <p className="font-semibold text-gray-700">🔢 Ordering Steps</p>
      {items.map((item, idx) => (
        <div key={item.id} className="flex items-center gap-2">
          <span className="text-gray-500 font-medium">{idx + 1}.</span>
          <input
            type="text"
            placeholder={`Step ${idx + 1}`}
            value={item.label}
            onChange={(e) => handleChange(idx, e.target.value)}
            className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
      ))}
      <button
        onClick={handleAddStep}
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow"
      >
        + Add Step
      </button>
    </div>
  );
}
