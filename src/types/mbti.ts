export enum MBTIType {
  INTJ = 'INTJ',
  INTP = 'INTP',
  ENTJ = 'ENTJ',
  ENTP = 'ENTP',
  INFJ = 'INFJ',
  INFP = 'INFP',
  ENFJ = 'ENFJ',
  ENFP = 'ENFP',
  ISTJ = 'ISTJ',
  ISFJ = 'ISFJ',
  ESTJ = 'ESTJ',
  ESFJ = 'ESFJ',
  ISTP = 'ISTP',
  ISFP = 'ISFP',
  ESTP = 'ESTP',
  ESFP = 'ESFP'
}

export interface MBTIResult {
  type: MBTIType;
  scores: {
    E: number;
    I: number;
    S: number;
    N: number;
    T: number;
    F: number;
    J: number;
    P: number;
  };
  confidence: number;
  description: string;
  traits: string[];
}

export interface MBTIQuestion {
  id: number;
  dimension: 'E-I' | 'S-N' | 'T-F' | 'J-P';
  question: string;
  options: {
    text: string;
    value: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
    weight: number;
  }[];
}

export interface MBTIAnalysis {
  type: MBTIType;
  title: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  career_suggestions: string[];
  time_management_tips: string[];
}