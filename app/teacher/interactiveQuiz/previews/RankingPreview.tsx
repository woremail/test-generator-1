"use client";
import { useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";

type RankingItem = {
  id: string;
  label: string;
};

type Question = {
  prompt: string;
  items: RankingItem[];
};

type Props = {
  question: Question;
};

export default function RankingPreview({ question }: Props) {
  const [items, setItems] = useState<RankingItem[]>(question.items);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);

    const updated = [...items];
    const [moved] = updated.splice(oldIndex, 1);
    updated.splice(newIndex, 0, moved);

    setItems(updated);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">📊 {question.prompt}</h3>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <ul className="space-y-2">
          {items.map((item) => (
            <RankingSlot key={item.id} item={item} />
          ))}
        </ul>
      </DndContext>
    </div>
  );
}

function RankingSlot({ item }: { item: RankingItem }) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: item.id });
  const { setNodeRef: setDropRef } = useDroppable({ id: item.id });

  return (
    <li
      ref={(el) => {
        setNodeRef(el);
        setDropRef(el);
      }}
      {...listeners}
      {...attributes}
      className="bg-gray-100 px-4 py-2 rounded border shadow cursor-move"
    >
      {item.label}
    </li>
  );
}
