export interface User {
    id: string;
    name: string;
    email: string;
    profilePicture?: string;
    isPremium: boolean;
    learningLevel: 'beginner' | 'intermediate' | 'advanced';
    joinedAt: string;
  }
  
  export interface Conversation {
    id: string;
    title: string;
    messages: Message[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Message {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: string;
    audioUrl?: string;
  }
  
  export interface Document {
    id: string;
    title: string;
    type: 'syllabus' | 'book' | 'notes' | 'other';
    uploadedAt: string;
    fileUrl: string;
    thumbnail?: string;
    questions?: Question[];
  }
  
  export interface Question {
    id: string;
    text: string;
    options?: string[];
    correctAnswer?: string;
    documentId: string;
    createdAt: string;
  }
  
  export interface PracticeSession {
    id: string;
    title: string;
    questions: Question[];
    score?: number;
    completed: boolean;
    startedAt: string;
    completedAt?: string;
  }
  
  export interface PaymentPlan {
    id: string;
    name: string;
    price: number;
    currency: string;
    features: string[];
    duration: number; // in months
  }