'use client';
import type { WeeklyContent } from '@/types/content';

const CONTENT_KEY = 'weeklyContent_v1';
const generateId = () => `content_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;

const createDefaultContent = (): WeeklyContent[] => {
    return [
        {
            id: generateId(),
            type: 'verse',
            title: 'آية الأسبوع للحفظ',
            content: '"أَسْتَطِيعُ كُلَّ شَيْءٍ فِي الْمَسِيحِ الَّذِي يُقَوِّينِي." (فيلبي 4: 13)',
            points: 15,
            createdBy: 'servant1_ss_mock_id',
            createdAt: new Date().toISOString(),
            isActive: true,
        },
        {
            id: generateId(),
            type: 'question',
            title: 'سؤال الأسبوع',
            content: 'من هو النبي الذي ابتلعه الحوت؟',
            options: ['موسى', 'يونان', 'إيليا', 'إشعياء'],
            correctAnswer: 'يونان',
            points: 10,
            createdBy: 'servant2_ss_mock_id',
            createdAt: new Date().toISOString(),
            isActive: true,
        }
    ];
};

export function getContent(): WeeklyContent[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CONTENT_KEY);
    if (stored) {
      return JSON.parse(stored).sort((a: WeeklyContent, b: WeeklyContent) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    const defaultContent = createDefaultContent();
    saveContent(defaultContent);
    return defaultContent;
  } catch (error) {
    console.error("Error reading content from localStorage", error);
    return [];
  }
}

export function saveContent(contentItems: WeeklyContent[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CONTENT_KEY, JSON.stringify(contentItems));
  } catch (error) {
    console.error("Error writing content to localStorage", error);
  }
}

export function addContent(contentData: Omit<WeeklyContent, 'id' | 'createdAt'>): WeeklyContent {
  const contentItems = getContent();
  const newContentItem: WeeklyContent = { 
      ...contentData, 
      id: generateId(),
      createdAt: new Date().toISOString(),
  };
  const updatedContent = [...contentItems, newContentItem];
  saveContent(updatedContent);
  return newContentItem;
}

export function updateContent(updatedItem: WeeklyContent): void {
    const contentItems = getContent();
    const index = contentItems.findIndex(item => item.id === updatedItem.id);
    if (index > -1) {
        contentItems[index] = updatedItem;
        saveContent(contentItems);
    }
}


export function deleteContent(contentId: string): void {
  let contentItems = getContent();
  contentItems = contentItems.filter(item => item.id !== contentId);
  saveContent(contentItems);
}
