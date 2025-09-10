import { useState } from "react";

type MatchPair = {
  leftId: string;
  leftLabel: string;
  rightId: string;
  rightLabel: string;
};

type Question = {
  prompt: string;
  pairs: MatchPair[];
};

type Props = {
  question: Question;
};

export default function MatchingPreview({ question }: Props) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});

  const handleLeftClick = (leftId: string) => {
    setSelectedLeft(leftId);
  };

  const handleRightClick = (rightId: string) => {
    if (selectedLeft) {
      setMatches({ ...matches, [selectedLeft]: rightId });
      setSelectedLeft(null);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">🔗 {question.prompt}</h3>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Left Items</h4>
          {question.pairs.map((pair) => (
            <button
              key={pair.leftId}
              onClick={() => handleLeftClick(pair.leftId)}
              className={`w-full px-3 py-2 rounded border ${
                selectedLeft === pair.leftId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {pair.leftLabel}
            </button>
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Right Items</h4>
          {question.pairs.map((pair) => (
            <button
              key={pair.rightId}
              onClick={() => handleRightClick(pair.rightId)}
              className="w-full px-3 py-2 rounded border bg-gray-100 hover:bg-gray-200"
            >
              {pair.rightLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Matched Pairs */}
      <div className="mt-6">
        <h4 className="font-medium text-gray-700">Your Matches</h4>
        <ul className="list-disc pl-6">
          {Object.entries(matches).map(([leftId, rightId]) => {
            const left = question.pairs.find((p) => p.leftId === leftId)?.leftLabel;
            const right = question.pairs.find((p) => p.rightId === rightId)?.rightLabel;
            return (
              <li key={leftId}>
                {left} ➝ {right}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
