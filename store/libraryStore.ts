import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Document, Question } from '@/types';
import { useAuthStore } from './authStore';

interface LibraryState {
  documents: Document[];
  isLoading: boolean;
  error: string | null;
  fetchDocuments: () => Promise<void>;
  addDocument: (document: Omit<Document, 'id' | 'uploadedAt' | 'questions'>) => Promise<string>;
  removeDocument: (id: string) => Promise<void>;
  addQuestionsToDocument: (documentId: string, questions: Omit<Question, 'id' | 'documentId' | 'createdAt'>[]) => Promise<void>;
  getDocument: (id: string) => Document | undefined;
  fetchQuestions: (documentId: string) => Promise<void>;
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  documents: [],
  isLoading: false,
  error: null,
  
  fetchDocuments: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const authUser = useAuthStore.getState().user;
      
      if (!authUser) {
        set({ documents: [], isLoading: false });
        return;
      }
      
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', authUser.id)
        .order('uploaded_at', { ascending: false });
      
      if (error) throw error;
      
      const documents: Document[] = data.map(item => ({
        id: item.id,
        title: item.title,
        type: item.type as 'syllabus' | 'book' | 'notes' | 'other',
        uploadedAt: item.uploaded_at,
        fileUrl: item.file_url,
        thumbnail: item.thumbnail || undefined,
        questions: [],
      }));
      
      set({ documents, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'An error occurred fetching documents',
        isLoading: false 
      });
    }
  },

  addDocument: async (document) => {
    try {
      set({ isLoading: true, error: null });
      
      const authUser = useAuthStore.getState().user;
      
      if (!authUser) {
        throw new Error('User not authenticated');
      }
      
      const uploadedAt = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('documents')
        .insert({
          title: document.title,
          type: document.type,
          uploaded_at: uploadedAt,
          file_url: document.fileUrl,
          thumbnail: document.thumbnail || null,
          user_id: authUser.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const newDocument: Document = {
        id: data.id,
        title: data.title,
        type: data.type as 'syllabus' | 'book' | 'notes' | 'other',
        uploadedAt: data.uploaded_at,
        fileUrl: data.file_url,
        thumbnail: data.thumbnail || undefined,
        questions: [],
      };
  
      set(state => ({
        documents: [newDocument, ...state.documents],
        isLoading: false,
      }));
      
      return newDocument.id;
    } catch (error: any) {
      set({ 
        error: error.message || 'An error occurred adding document',
        isLoading: false 
      });
      return '';
    }
  },
  
  removeDocument: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set(state => ({
        documents: state.documents.filter(doc => doc.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ 
        error: error.message || 'An error occurred removing document',
        isLoading: false 
      });
    }
  },
  
  addQuestionsToDocument: async (documentId, questions) => {
    try {
      set({ isLoading: true, error: null });
      
      const createdAt = new Date().toISOString();
      
      const questionsToInsert = questions.map(q => ({
        text: q.text,
        options: q.options || null,
        correct_answer: q.correctAnswer || null,
        document_id: documentId,
        created_at: createdAt,
      }));
      
      const { data, error } = await supabase
        .from('questions')
        .insert(questionsToInsert)
        .select();
      
      if (error) throw error;
      
      const newQuestions: Question[] = data.map(item => ({
        id: item.id,
        text: item.text,
        options: item.options || undefined,
        correctAnswer: item.correct_answer || undefined,
        documentId: item.document_id,
        createdAt: item.created_at,
      }));
      
      set(state => {
        const documents = [...state.documents];
        const documentIndex = documents.findIndex(d => d.id === documentId);
        
        if (documentIndex === -1) return state;
        
        const document = { ...documents[documentIndex] };
        document.questions = [...(document.questions || []), ...newQuestions];
        documents[documentIndex] = document;
        
        return { documents, isLoading: false };
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'An error occurred adding questions',
        isLoading: false 
      });
    }
  },

  getDocument: (id) => {
    return get().documents.find(d => d.id === id);
  },
  
  fetchQuestions: async (documentId) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('document_id', documentId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      const questions: Question[] = data.map(item => ({
        id: item.id,
        text: item.text,
        options: item.options || undefined,
        correctAnswer: item.correct_answer || undefined,
        documentId: item.document_id,
        createdAt: item.created_at,
      }));
      
      set(state => {
        const documents = [...state.documents];
        const documentIndex = documents.findIndex(d => d.id === documentId);
        
        if (documentIndex === -1) return state;
        
        const document = { ...documents[documentIndex] };
        document.questions = questions;
        documents[documentIndex] = document;
        
        return { documents, isLoading: false };
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'An error occurred fetching questions',
        isLoading: false 
      });
    }
  },
}));