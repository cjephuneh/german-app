export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      conversations: {
        Row: {
          id: string
          title: string
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          title: string
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          created_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      documents: {
        Row: {
          id: string
          title: string
          type: string
          uploaded_at: string
          file_url: string
          thumbnail: string | null
          user_id: string
        }
        Insert: {
          id?: string
          title: string
          type: string
          uploaded_at?: string
          file_url: string
          thumbnail?: string | null
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          type?: string
          uploaded_at?: string
          file_url?: string
          thumbnail?: string | null
          user_id?: string
        }
        Relationships: [
            {
              foreignKeyName: "documents_user_id_fkey"
              columns: ["user_id"]
              referencedRelation: "users"
              referencedColumns: ["id"]
            }
          ]
        }
        messages: {
          Row: {
            id: string
            content: string
            sender: string
            timestamp: string
            audio_url: string | null
            conversation_id: string
          }
          Insert: {
            id?: string
            content: string
            sender: string
            timestamp?: string
            audio_url?: string | null
            conversation_id: string
          }
          Update: {
            id?: string
            content?: string
            sender?: string
            timestamp?: string
            audio_url?: string | null
            conversation_id?: string
          }
          Relationships: [
            {
              foreignKeyName: "messages_conversation_id_fkey"
              columns: ["conversation_id"]
              referencedRelation: "conversations"
              referencedColumns: ["id"]
            }
        ]
    }
    practice_sessions: {
      Row: {
        id: string
        title: string
        score: number | null
        completed: boolean
        started_at: string
        completed_at: string | null
        user_id: string
      }
      Insert: {
        id?: string
        title: string
        score?: number | null
        completed: boolean
        started_at?: string
        completed_at?: string | null
        user_id: string
      }
      Update: {
        id?: string
        title?: string
        score?: number | null
        completed?: boolean
        started_at?: string
        completed_at?: string | null
        user_id?: string
      }
      Relationships: [
        {
          foreignKeyName: "practice_sessions_user_id_fkey"
          columns: ["user_id"]
          referencedRelation: "users"
          referencedColumns: ["id"]
        }
      ]
    }
    questions: {
      Row: {
        id: string
        text: string
        options: string[] | null
        correct_answer: string | null
        document_id: string | null
        created_at: string
        practice_session_id: string | null
      }
      Insert: {
        id?: string
        text: string
        options?: string[] | null
        correct_answer?: string | null
        document_id?: string | null
        created_at?: string
        practice_session_id?: string | null
      }
      Update: {
        id?: string
        text?: string
        options?: string[] | null
        correct_answer?: string | null
        document_id?: string | null
        created_at?: string
        practice_session_id?: string | null
      }
      Relationships: [
        {
          foreignKeyName: "questions_document_id_fkey"
          columns: ["document_id"]
          referencedRelation: "documents"
          referencedColumns: ["id"]
        },
        {
          foreignKeyName: "questions_practice_session_id_fkey"
          columns: ["practice_session_id"]
          referencedRelation: "practice_sessions"
          referencedColumns: ["id"]
        }
      ]
    }
    user_profiles: {
      Row: {
        id: string
        user_id: string
        name: string
        email: string
        profile_picture: string | null
        is_premium: boolean
        learning_level: string
        joined_at: string
      }
      Insert: {
        id?: string
        user_id: string
        name: string
        email: string
        profile_picture?: string | null
        is_premium?: boolean
        learning_level?: string
        joined_at?: string
      }
      Update: {
        id?: string
        user_id?: string
        name?: string
        email?: string
        profile_picture?: string | null
        is_premium?: boolean
        learning_level?: string
        joined_at?: string
      }
      Relationships: [
        {
          foreignKeyName: "user_profiles_user_id_fkey"
          columns: ["user_id"]
          referencedRelation: "users"
          referencedColumns: ["id"]
        }
      ]
    }
  }
  Views: {
    [_ in never]: never
  }
  Functions: {
    [_ in never]: never
  }
  Enums: {
    [_ in never]: never
  }
  CompositeTypes: {
    [_ in never]: never
  }
}
}