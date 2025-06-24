
'use client';
import type { ServantTask, CompletedServantTask } from '@/types/servant-panel';

const VISITATION_TASKS_KEY = 'visitationTasks_v1';
const generateId = () => `task_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;

// A function to get all tasks from localStorage
export function getVisitationTasks(): ServantTask[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(VISITATION_TASKS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to retrieve visitation tasks:", error);
    return [];
  }
}

// A function to save all tasks to localStorage
function saveVisitationTasks(tasks: ServantTask[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(VISITATION_TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Failed to save visitation tasks:", error);
  }
}

// Assigns a new task and adds it to the list
export function assignVisitationTask(taskData: Omit<ServantTask, 'id' | 'status' | 'assignedAt'>): ServantTask {
  const allTasks = getVisitationTasks();
  const newTask: ServantTask = {
    ...taskData,
    id: generateId(),
    status: 'pending',
    assignedAt: new Date(),
    latitude: taskData.latitude,
    longitude: taskData.longitude,
  };
  const updatedTasks = [...allTasks, newTask];
  saveVisitationTasks(updatedTasks);
  return newTask;
}

// Gets all pending tasks for a specific servant
export function getTasksForServant(servantId: string): ServantTask[] {
  const allTasks = getVisitationTasks();
  return allTasks.filter(task => task.servantId === servantId && task.status === 'pending')
                 .sort((a, b) => new Date(a.assignedAt).getTime() - new Date(b.assignedAt).getTime());
}

// Gets all completed tasks for a specific servant
export function getCompletedTasksForServant(servantId: string): CompletedServantTask[] {
    const allTasks = getVisitationTasks();
    return allTasks
      .filter((task): task is CompletedServantTask => 
          task.servantId === servantId && task.status === 'completed'
      )
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());
}

// Marks a task as completed and adds servant notes
export function completeVisitationTask(taskId: string, servantNotes?: string): ServantTask | null {
  const allTasks = getVisitationTasks();
  const taskIndex = allTasks.findIndex(task => task.id === taskId);

  if (taskIndex > -1) {
    const task = allTasks[taskIndex];
    const completedTask: CompletedServantTask = {
      ...task,
      status: 'completed',
      completedAt: new Date(),
      servantNotes: servantNotes || task.servantNotes,
    };
    allTasks[taskIndex] = completedTask;
    saveVisitationTasks(allTasks);
    return completedTask;
  }
  return null;
}
