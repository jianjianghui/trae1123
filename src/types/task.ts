export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  estimatedDuration?: number; // 分钟
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  mbtiOptimization?: MBTITaskOptimization;
}

export interface MBTITaskOptimization {
  recommendedTimeSlots: TimeSlot[];
  energyLevel: EnergyLevel;
  socialInteraction: SocialInteractionType;
  focusStrategy: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  reason: string;
}

export enum TaskCategory {
  WORK = 'work',
  PERSONAL = 'personal',
  HEALTH = 'health',
  LEARNING = 'learning',
  SOCIAL = 'social',
  CREATIVE = 'creative'
}

export enum TaskPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export enum EnergyLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export enum SocialInteractionType {
  SOLO = 'solo',
  ONE_ON_ONE = 'one_on_one',
  GROUP = 'group',
  OPTIONAL = 'optional'
}

export interface ParsedTask {
  title: string;
  subtasks: string[];
  estimatedDuration: number;
  priority: TaskPriority;
  category: TaskCategory;
  mbtiSuggestions: string[];
}

export interface TaskInput {
  description: string;
  userMBTI: string;
}