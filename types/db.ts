/**
 * Supabase Database Types
 * Auto-generated or hand-crafted TypeScript interfaces for type-safe queries
 */

export type Database = {
  public: {
    Tables: {
      prompt_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          icon?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          icon?: string | null;
          created_at?: string;
        };
      };
      prompts: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          content: string;
          category_id: string | null;
          is_featured: boolean;
          created_at: string;
          user_id: string;
          image_url: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          content: string;
          category_id?: string | null;
          is_featured?: boolean;
          created_at?: string;
          user_id: string;
          image_url?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          content?: string;
          category_id?: string | null;
          is_featured?: boolean;
          created_at?: string;
          user_id?: string;
          image_url?: string | null;
        };
      };
      videos: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          youtube_url: string;
          thumbnail_url: string | null;
          created_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          youtube_url: string;
          thumbnail_url?: string | null;
          created_at?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          youtube_url?: string;
          thumbnail_url?: string | null;
          created_at?: string;
          user_id?: string;
        };
      };
      services: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number | null;
          created_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price?: number | null;
          created_at?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number | null;
          created_at?: string;
          user_id?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          email: string;
          name: string;
          message: string;
          created_at: string;
          user_id: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          message: string;
          created_at?: string;
          user_id?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          message?: string;
          created_at?: string;
          user_id?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

// Convenience types for commonly used tables
export type PromptCategory = Database['public']['Tables']['prompt_categories']['Row'];
export type PromptCategoryInsert = Database['public']['Tables']['prompt_categories']['Insert'];
export type PromptCategoryUpdate = Database['public']['Tables']['prompt_categories']['Update'];

export type Prompt = Database['public']['Tables']['prompts']['Row'];
export type PromptInsert = Database['public']['Tables']['prompts']['Insert'];
export type PromptUpdate = Database['public']['Tables']['prompts']['Update'];

export type Video = Database['public']['Tables']['videos']['Row'];
export type VideoInsert = Database['public']['Tables']['videos']['Insert'];
export type VideoUpdate = Database['public']['Tables']['videos']['Update'];

export type Service = Database['public']['Tables']['services']['Row'];
export type ServiceInsert = Database['public']['Tables']['services']['Insert'];
export type ServiceUpdate = Database['public']['Tables']['services']['Update'];

export type Message = Database['public']['Tables']['messages']['Row'];
export type MessageInsert = Database['public']['Tables']['messages']['Insert'];
export type MessageUpdate = Database['public']['Tables']['messages']['Update'];
