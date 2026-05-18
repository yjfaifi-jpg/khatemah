/**
 * lib/types.ts
 * ────────────
 * أنواع TypeScript المشتركة في المشروع.
 */

export interface Profile {
  id: string;
  name: string;
  role: string;
  school: string | null;
  city: string | null;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  teacher_id: string;
  name: string;
  grade: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AIToolHistory {
  id: string;
  teacher_id: string;
  tool_name: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  created_at: string;
}

// ── أنواع نماذج الأدوات ───────────────────────────────────────────

export interface LessonPlanInput {
  subject: string;
  grade: string;
  objective: string;
  sessions: number;
}

export interface QuestionsInput {
  subject: string;
  grade: string;
  topic: string;
  questionType: "multiple_choice" | "true_false" | "essay";
  count: number;
}

export interface WorksheetInput {
  subject: string;
  grade: string;
  topic: string;
  activitiesCount: number;
}
