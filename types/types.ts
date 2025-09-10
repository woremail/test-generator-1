export type BaseQuestion = {
  prompt: string;
};

export type DragDropQuestion = BaseQuestion & {
  dragItems: string[];
  dropZones: string[];
};

export type MatchingQuestion = BaseQuestion & {
  pairs: { left: string; right: string }[];
};

export type RankingQuestion = BaseQuestion & {
  items: string[];
};

export type OrderingQuestion = BaseQuestion & {
  steps: string[];
};

export type QuizType = "" | "drag-drop" | "matching" | "ranking" | "ordering";

export type QuestionMap = {
  "drag-drop": DragDropQuestion;
  matching: MatchingQuestion;
  ranking: RankingQuestion;
  ordering: OrderingQuestion;
};

export type QuizMeta = {
  grade: string;
  subject: string;
  chapter: string;
  topic: string;
  type: QuizType;
};
