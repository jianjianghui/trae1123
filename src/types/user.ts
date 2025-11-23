export interface User {
  id: string;
  email?: string;
  name?: string;
  mbtiType?: string;
  personalityTraits?: string[];
  preferences?: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: boolean;
  workHours: {
    start: string;
    end: string;
  };
  breakDuration: number;
  preferredTimeManagementMethod: string;
}