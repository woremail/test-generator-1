import DragDropPreview from "@/components/DragDropBuilder";
import MatchingPreview from "@/components/MatchingBuilder";
import RankingPreview from "@/components/RankingBuilder";
import OrderingPreview from "@/components/OrderingBuilder";

const previewComponents = {
  "drag-drop": DragDropPreview,
  "matching": MatchingPreview,
  "ranking": RankingPreview,
  "ordering": OrderingPreview,
};

type Props = {
  question: Question;
  type: keyof typeof previewComponents;
};

export default function PreviewWrapper({ question, type }: Props) {
  const PreviewComponent = previewComponents[type];
  return PreviewComponent ? <PreviewComponent question={question} /> : null;
}
