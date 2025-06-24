// src/types/content.ts

export type ContentType = 'question' | 'verse';

export interface WeeklyContent {
  id: string;
  type: ContentType;
  title: string;
  content: string; // The question text or the verse itself
  options?: string[]; // For multiple-choice questions
  correctAnswer?: string; // For questions with a specific answer
  points: number;
  createdBy: string; // servantId
  createdAt: string; // ISO date string
  isActive: boolean; // To control visibility for children
}
