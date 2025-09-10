import { useState, useEffect } from "react";
import { DragDropQuestion } from "@/types/types";
type DragItem = {
  id: string;
  label: string;
};

type DropZone = {
  id: string;
  label: string;
  correctItemId?: string;
};

type Question = {
  prompt: string;
  dragItems: DragItem[];
  dropZones: DropZone[];
};

type Props = {
  question: DragDropQuestion;
  onUpdate: (updated: DragDropQuestion) => void;
};


export default function DragDropBuilder({ question, onUpdate }: Props) {
  const [dragItems, setDragItems] = useState<DragItem[]>(question.dragItems || []);
  const [dropZones, setDropZones] = useState<DropZone[]>(question.dropZones || []);
  const [questions, setQuestions] = useState<QuestionMap[QuizType][]>([]);


 useEffect(() => {
  if (dragItems.length && dropZones.length) {
    onUpdate({ ...question, dragItems, dropZones });
  }
}, [dragItems, dropZones]);


  const addDragItem = () => {
    const newItem: DragItem = {
      id: Date.now().toString(),
      label: "",
    };
    setDragItems([...dragItems, newItem]);
  };

  const addDropZone = () => {
    const newZone: DropZone = {
      id: Date.now().toString(),
      label: "",
      correctItemId: "",
    };
    setDropZones([...dropZones, newZone]);
  };

  const updateDragLabel = (index: number, value: string) => {
    const updated = [...dragItems];
    updated[index].label = value;
    setDragItems(updated);
  };

  const updateDropZoneLabel = (index: number, value: string) => {
    const updated = [...dropZones];
    updated[index].label = value;
    setDropZones(updated);
  };

  const updateDropZoneAnswer = (index: number, itemId: string) => {
    const updated = [...dropZones];
    updated[index].correctItemId = itemId;
    setDropZones(updated);
  };

  return (
    <div className="space-y-6">
      <p className="font-semibold text-gray-700">🧲 Drag & Drop Builder</p>

      {/* Drag Items */}
      <div>
        <p className="text-sm font-medium text-gray-600 mb-2">Draggable Items</p>
        {dragItems.map((item, idx) => (
          <input
            key={item.id}
            type="text"
            placeholder={`Item ${idx + 1}`}
            value={item.label}
            onChange={(e) => updateDragLabel(idx, e.target.value)}
            className="border px-3 py-2 rounded w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        ))}
        <button
          onClick={addDragItem}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          + Add Item
        </button>
      </div>

      {/* Drop Zones */}
      <div>
        <p className="text-sm font-medium text-gray-600 mb-2">Drop Zones</p>
        {dropZones.map((zone, idx) => (
          <div key={zone.id} className="space-y-2 mb-4">
            <input
              type="text"
              placeholder={`Drop Zone ${idx + 1}`}
              value={zone.label}
              onChange={(e) => updateDropZoneLabel(idx, e.target.value)}
              className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <select
              value={zone.correctItemId || ""}
              onChange={(e) => updateDropZoneAnswer(idx, e.target.value)}
              className="border px-3 py-2 rounded w-full bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">Select correct item</option>
              {dragItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label || "(empty)"}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button
          onClick={addDropZone}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
        >
          + Add Drop Zone
        </button>
      </div>
    </div>
  );
}
