import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { PracticeSession, Question } from '@/types';
import { useAuthStore } from './authStore';

interface PracticeState {
  sessions: PracticeSession[];
  currentSessionId: string | null;
  isLoading: boolean;
  error: string | null;
  fetchSessions: () => Promise<void>;
  createSession: (title: string, questions: Question[]) => Promise<string>;
  deleteSession: (id: string) => Promise<void>;
  setCurrentSession: (id: string | null) => void;
  completeSession: (id: string, score: number) => Promise<void>;
  getSession: (id: string) => PracticeSession | undefined;
}

export const usePracticeStore = create<PracticeState>((set, get) => ({
  sessions: [],
  currentSessionId: null,
  isLoading: false,
  error: null,
  
  fetchSessions: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const authUser = useAuthStore.getState().user;
      
      if (!authUser) {
        set({ sessions: [], isLoading: false });
        return;
      }
      
      // Fetch practice sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('practice_sessions')
        .select('*')
        .eq('user_id', authUser.id)
        .order('started_at', { ascending: false });
      
      if (sessionsError) throw sessionsError;
      
      // Create sessions array without questions
      const sessions: PracticeSession[] = sessionsData.map(item => ({
        id: item.id,
        title: item.title,
        questions: [],
        score: item.score || undefined,
        completed: item.completed,
        startedAt: item.started_at,
        completedAt: item.completed_at || undefined,
      }));
      
      // Fetch questions for each session
      for (const session of sessions) {
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('*')
          .eq('practice_session_id', session.id)
          .order('created_at', { ascending: true });
        
        if (questionsError) throw questionsError;
        
        session.questions = questionsData.map(item => ({
          id: item.id,
          text: item.text,
          options: item.options || undefined,
          correctAnswer: item.correct_answer || undefined,
          documentId: item.document_id || '',
          createdAt: item.created_at,
        }));
      }

      set({ sessions, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'An error occurred fetching practice sessions',
        isLoading: false 
      });
    }
  },
  
  createSession: async (title, questions) => {
    try {
      set({ isLoading: true, error: null });
      
      const authUser = useAuthStore.getState().user;
      
      if (!authUser) {
        throw new Error('User not authenticated');
      }
      
      const startedAt = new Date().toISOString();
      
      // Create practice session
      const { data: sessionData, error: sessionError } = await supabase
        .from('practice_sessions')
        .insert({
          title,
          completed: false,
          started_at: startedAt,
          user_id: authUser.id,
        })
        .select()
        .single();
      
      if (sessionError) throw sessionError;
      
      // Add questions to the session
      const questionsToInsert = questions.map(q => ({
        text: q.text,
        options: q.options || null,
        correct_answer: q.correctAnswer || null,
        document_id: q.documentId || null,
        created_at: new Date().toISOString(),
        practice_session_id: sessionData.id,
      }));
      
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .insert(questionsToInsert)
        .select();
      
      if (questionsError) throw questionsError;

      const newQuestions: Question[] = questionsData.map(item => ({
        id: item.id,
        text: item.text,
        options: item.options || undefined,
        correctAnswer: item.correct_answer || undefined,
        documentId: item.document_id || '',
        createdAt: item.created_at,
      }));
      
      const newSession: PracticeSession = {
        id: sessionData.id,
        title: sessionData.title,
        questions: newQuestions,
        completed: sessionData.completed,
        startedAt: sessionData.started_at,
        completedAt: sessionData.completed_at || undefined,
      };
      
      set(state => ({
        sessions: [newSession, ...state.sessions],
        currentSessionId: newSession.id,
        isLoading: false,
      }));
      
      return newSession.id;
    } catch (error: any) {
      set({ 
        error: error.message || 'An error occurred creating practice session',
        isLoading: false 
      });
      return '';
    }
  },
  
  deleteSession: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('practice_sessions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set(state => ({
        sessions: state.sessions.filter(session => session.id !== id),
        currentSessionId: state.currentSessionId === id ? null : state.currentSessionId,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ 
        error: error.message || 'An error occurred deleting practice session',
        isLoading: false 
      });
    }
  },
  
  setCurrentSession: (id) => {
    set({ currentSessionId: id });
  },
  
  completeSession: async (id, score) => {
    try {
      set({ isLoading: true, error: null });
      
      const completedAt = new Date().toISOString();
      
      const { error } = await supabase
        .from('practice_sessions')
        .update({
          completed: true,
          score,
          completed_at: completedAt,
        })
        .eq('id', id);
      
      if (error) throw error;
      
      set(state => {
        const sessions = [...state.sessions];
        const sessionIndex = sessions.findIndex(s => s.id === id);
        
        if (sessionIndex === -1) return state;
        
        const session = { ...sessions[sessionIndex] };
        session.completed = true;
        session.score = score;
        session.completedAt = completedAt;
        sessions[sessionIndex] = session;
        
        return { sessions, isLoading: false };
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'An error occurred completing practice session',
        isLoading: false 
      });
    }
  },
  
  getSession: (id) => {
    return get().sessions.find(s => s.id === id);
  },
}));
