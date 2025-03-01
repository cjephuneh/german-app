import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Conversation, Message } from '@/types';
import { useAuthStore } from './authStore';

interface ConversationState {
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  error: string | null;
  fetchConversations: () => Promise<void>;
  createConversation: (title: string) => Promise<string>;
  deleteConversation: (id: string) => Promise<void>;
  setCurrentConversation: (id: string | null) => void;
  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => Promise<void>;
  getConversation: (id: string) => Conversation | undefined;
  fetchMessages: (conversationId: string) => Promise<void>;
}

export const useConversationStore = create<ConversationState>((set, get) => ({
  conversations: [],
  currentConversationId: null,
  isLoading: false,
  error: null,
  
  fetchConversations: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const authUser = useAuthStore.getState().user;
      
      if (!authUser) {
        set({ conversations: [], isLoading: false });
        return;
      }
      
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', authUser.id)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      
      const conversations: Conversation[] = data.map(item => ({
        id: item.id,
        title: item.title,
        messages: [],
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
      
      set({ conversations, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'An error occurred fetching conversations',
        isLoading: false 
      });
    }
  },

  createConversation: async (title) => {
    try {
      set({ isLoading: true, error: null });
      
      const authUser = useAuthStore.getState().user;
      
      if (!authUser) {
        throw new Error('User not authenticated');
      }
      
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          title,
          user_id: authUser.id,
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const newConversation: Conversation = {
        id: data.id,
        title: data.title,
        messages: [],
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
      
      set(state => ({
        conversations: [newConversation, ...state.conversations],
        currentConversationId: newConversation.id,
        isLoading: false,
      }));
      
      return newConversation.id;
    } catch (error: any) {
      set({ 
        error: error.message || 'An error occurred creating conversation',
        isLoading: false 
      });
      return '';
    }
  },

  deleteConversation: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set(state => ({
        conversations: state.conversations.filter(conv => conv.id !== id),
        currentConversationId: state.currentConversationId === id ? null : state.currentConversationId,
        isLoading: false,
      }));
    } catch (error: any) {
      set({ 
        error: error.message || 'An error occurred deleting conversation',
        isLoading: false 
      });
    }
  },
  
  setCurrentConversation: (id) => {
    set({ currentConversationId: id });
  },
  
  addMessage: async (conversationId, message) => {
    try {
      set({ isLoading: true, error: null });
      
      const timestamp = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('messages')
        .insert({
          content: message.content,
          sender: message.sender,
          timestamp,
          audio_url: message.audioUrl,
          conversation_id: conversationId,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Update conversation's updated_at timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: timestamp })
        .eq('id', conversationId);
      
      const newMessage: Message = {
        id: data.id,
        content: data.content,
        sender: data.sender,
        timestamp: data.timestamp,
        audioUrl: data.audio_url,
      };

      set(state => {
        const conversations = [...state.conversations];
        const conversationIndex = conversations.findIndex(c => c.id === conversationId);
        
        if (conversationIndex === -1) return state;
        
        const conversation = { ...conversations[conversationIndex] };
        conversation.messages = [...conversation.messages, newMessage];
        conversation.updatedAt = timestamp;
        conversations[conversationIndex] = conversation;
        
        return { conversations, isLoading: false };
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'An error occurred adding message',
        isLoading: false 
      });
    }
  },

  getConversation: (id) => {
    return get().conversations.find(c => c.id === id);
  },
  
  fetchMessages: async (conversationId) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('timestamp', { ascending: true });
      
      if (error) throw error;
      
      const messages: Message[] = data.map(item => ({
        id: item.id,
        content: item.content,
        sender: item.sender,
        timestamp: item.timestamp,
        audioUrl: item.audio_url,
      }));
      
      set(state => {
        const conversations = [...state.conversations];
        const conversationIndex = conversations.findIndex(c => c.id === conversationId);
        
        if (conversationIndex === -1) return state;
        
        const conversation = { ...conversations[conversationIndex] };
        conversation.messages = messages;
        conversations[conversationIndex] = conversation;
        
        return { conversations, isLoading: false };
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'An error occurred fetching messages',
        isLoading: false 
      });
    }
  },
}));