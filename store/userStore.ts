import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { User } from '@/types';
import { useAuthStore } from './authStore';

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  fetchUserProfile: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  setLearningLevel: (level: 'beginner' | 'intermediate' | 'advanced') => Promise<void>;
  setPremiumStatus: (isPremium: boolean) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  
  fetchUserProfile: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const authUser = useAuthStore.getState().user;
      
      if (!authUser) {
        set({ user: null, isLoading: false });
        return;
      }
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', authUser.id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        const userProfile: User = {
          id: data.user_id,
          name: data.name,
          email: data.email,
          profilePicture: data.profile_picture,
          isPremium: data.is_premium,
          learningLevel: data.learning_level as 'beginner' | 'intermediate' | 'advanced',
          joinedAt: data.joined_at,
        };
        
        set({ user: userProfile, isLoading: false });
      } else {
        set({ user: null, isLoading: false });
      }
    } catch (error: any) {
      set({ 
        error: error.message || 'An error occurred fetching user profile',
        isLoading: false 
      });
    }
  },
  
  updateUserProfile: async (updates) => {
    try {
      set({ isLoading: true, error: null });
      
      const authUser = useAuthStore.getState().user;
      const currentUser = get().user;
      
      if (!authUser || !currentUser) {
        set({ isLoading: false });
        return;
      }
      
      const { error } = await supabase
        .from('user_profiles')
        .update({
          name: updates.name || currentUser.name,
          profile_picture: updates.profilePicture || currentUser.profilePicture,
          learning_level: updates.learningLevel || currentUser.learningLevel,
          is_premium: updates.isPremium !== undefined ? updates.isPremium : currentUser.isPremium,
        })
        .eq('user_id', authUser.id);
      
      if (error) throw error;
      
      set({ 
        user: { ...currentUser, ...updates },
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'An error occurred updating user profile',
        isLoading: false 
      });
    }
  },
  
  setLearningLevel: async (level) => {
    try {
      const currentUser = get().user;
      
      if (!currentUser) return;
      
      await get().updateUserProfile({ learningLevel: level });
    } catch (error: any) {
      set({ 
        error: error.message || 'An error occurred updating learning level',
        isLoading: false 
      });
    }
  },
  
  setPremiumStatus: async (isPremium) => {
    try {
      const currentUser = get().user;
      
      if (!currentUser) return;
      
      await get().updateUserProfile({ isPremium });
    } catch (error: any) {
      set({ 
        error: error.message || 'An error occurred updating premium status',
        isLoading: false 
      });
    }
  },
}));