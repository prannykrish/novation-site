// Database types for strongly-typed interfaces

// Database User
export interface DatabaseUser {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

// Folder interface
export interface Folder {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  userId: string;
  createdAt: string;
}

// Asset interface
export interface Asset {
  id: string;
  name: string;
  type: string;
  description?: string;
  category?: string;
  tags?: string[];
  isPublic: boolean;
  usageStartDate?: string;
  usageEndDate?: string;
  fileUrl?: string;
  createdAt: string;
  userId: string;
  folderId?: string | null;
  userName?: string;
  userEmail?: string;
  // Define users with a more specific type to avoid 'never' type errors
  users?: {
    name?: string;
    email?: string;
  };
}

// Product interface
export interface Product {
  id: string;
  name: string;
  category: string; // Reference to category ID
  tags?: string[];
  isPublic: boolean;
  usageStartDate?: string;
  usageEndDate?: string;
  description?: string;
  folderId?: string | null;
  createdAt: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  users?: {
    name?: string;
    email?: string;
  };
}

// Category interface
export interface Category {
  id: string;
  name: string;
}

// Message interface
export interface Message {
  id: string;
  subject: string;
  content: string;
  senderId: string;
  recipientId: string;
  relatedProductId?: string | null;
  relatedAssetId?: string | null;
  createdAt: string;
  isRead: boolean;
  senderEmail?: string;
  senderName?: string;
  recipientEmail?: string;
  recipientName?: string;
}

// Search filter interface
export interface SearchFilters {
  keyword?: string;
  categories?: string[];
  tags?: string[];
  types?: string[];
  startDate?: string;
  endDate?: string;
  isPublicOnly?: boolean;
}

// Supabase Database definition
// This is necessary for proper type-safety with Supabase client
export type Database = {
  public: {
    Tables: {
      users: {
        Row: DatabaseUser;
        Insert: Omit<DatabaseUser, 'id'>;
        Update: Partial<Omit<DatabaseUser, 'id'>>;
      };
      folders: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          parent_id: string | null;
          user_id: string;
          created_at: string;
        };
        Insert: Omit<{
          id?: string;
          name: string;
          description?: string | null;
          parent_id?: string | null;
          user_id: string;
          created_at?: string;
        }, never>;
        Update: Partial<{
          name?: string;
          description?: string | null;
          parent_id?: string | null;
        }>;
      };
      assets: {
        Row: {
          id: string;
          name: string;
          type: string;
          description: string | null;
          category: string | null;
          tags: string[];
          is_public: boolean;
          usage_start_date: string | null;
          usage_end_date: string | null;
          file_url: string | null;
          created_at: string;
          user_id: string;
          folder_id: string | null;
        };
        Insert: Omit<{
          id?: string;
          name: string;
          type: string;
          description?: string | null;
          category?: string | null;
          tags?: string[];
          is_public: boolean;
          usage_start_date?: string | null;
          usage_end_date?: string | null;
          file_url?: string | null;
          created_at?: string;
          user_id: string;
          folder_id?: string | null;
        }, never>;
        Update: Partial<{
          name?: string;
          type?: string;
          description?: string | null;
          category?: string | null;
          tags?: string[];
          is_public?: boolean;
          usage_start_date?: string | null;
          usage_end_date?: string | null;
          file_url?: string | null;
          folder_id?: string | null;
        }>;
      };
      products: {
        Row: {
          id: string;
          name: string;
          category: string;
          tags: string[];
          is_public: boolean;
          usage_start_date: string | null;
          usage_end_date: string | null;
          description: string | null;
          folder_id: string | null;
          created_at: string;
          user_id: string;
        };
        Insert: Omit<{
          id?: string;
          name: string;
          category: string;
          tags?: string[];
          is_public: boolean;
          usage_start_date?: string | null;
          usage_end_date?: string | null;
          description?: string | null;
          folder_id?: string | null;
          created_at?: string;
          user_id: string;
        }, never>;
        Update: Partial<{
          name?: string;
          category?: string;
          tags?: string[];
          is_public?: boolean;
          usage_start_date?: string | null;
          usage_end_date?: string | null;
          description?: string | null;
          folder_id?: string | null;
        }>;
      };
      categories: {
        Row: Category;
        Insert: Category;
        Update: Partial<Category>;
      };
      messages: {
        Row: {
          id: string;
          subject: string;
          content: string;
          sender_id: string;
          recipient_id: string;
          related_product_id: string | null;
          related_asset_id: string | null;
          created_at: string;
          is_read: boolean;
        };
        Insert: Omit<{
          id?: string;
          subject: string;
          content: string;
          sender_id: string;
          recipient_id: string;
          related_product_id?: string | null;
          related_asset_id?: string | null;
          created_at?: string;
          is_read: boolean;
        }, never>;
        Update: Partial<{
          subject?: string;
          content?: string;
          is_read?: boolean;
        }>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};