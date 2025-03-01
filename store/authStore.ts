import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: any | null;
  isLoading: boolean;
  error: string | null;
  
  // Auth actions
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  
  // Session management
  loadSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  error: null,
  
  signUp: async (email, password, name) => {
    try {
      set({ isLoading: true, error: null });
      
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      
      if (error) throw error;
      
      // If sign up successful, create a user profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: data.user.id,
            name,
            email,
            is_premium: false,
            learning_level: 'beginner',
            joined_at: new Date().toISOString(),
          });
        
        if (profileError) throw profileError;
      }
      
      set({ 
        user: data.user,
        session: data.session,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'An error occurred during sign up',
        isLoading: false 
      });
    }
  },

  signIn: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      set({ 
        user: data.user,
        session: data.session,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'An error occurred during sign in',
        isLoading: false 
      });
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      set({ 
        user: null,
        session: null,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'An error occurred during sign out',
        isLoading: false 
      });
    }
  },

  resetPassword: async (email) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://yourdomain.com/reset-password',
      });
      
      if (error) throw error;
      
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'An error occurred during password reset',
        isLoading: false 
      });
    }
  },
  
  updatePassword: async (password) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) throw error;
      
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'An error occurred updating password',
        isLoading: false 
      });
    }
  },

  loadSession: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      set({ 
        user: data.session?.user || null,
        session: data.session,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'An error occurred loading session',
        isLoading: false,
        user: null,
        session: null
      });
    }
  },
}));