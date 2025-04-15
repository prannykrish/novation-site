-- Schema for Supabase database
-- Run this SQL in your Supabase SQL Editor

-- Create users table to extend the auth.users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create folders table for organizing products
CREATE TABLE IF NOT EXISTS public.folders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.folders(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT TRUE,
  usage_start_date DATE,
  usage_end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES public.folders(id) ON DELETE SET NULL
);

-- Create assets table
CREATE TABLE IF NOT EXISTS public.assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT TRUE,
  usage_start_date DATE,
  usage_end_date DATE,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES public.folders(id) ON DELETE SET NULL
);

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  related_product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  related_asset_id UUID REFERENCES public.assets(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_read BOOLEAN DEFAULT FALSE
);

-- Insert default categories
INSERT INTO public.categories (id, name)
VALUES 
  ('body-care', 'Body Care'),
  ('mens-grooming', 'Men''s Grooming')
ON CONFLICT (id) DO NOTHING;

-- RLS Policies
-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can read all users"
  ON public.users
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own data"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Products table policies
CREATE POLICY "Users can read public products"
  ON public.products
  FOR SELECT
  USING (is_public OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own products"
  ON public.products
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products"
  ON public.products
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products"
  ON public.products
  FOR DELETE
  USING (auth.uid() = user_id);

-- Categories table policies
CREATE POLICY "Everyone can read categories"
  ON public.categories
  FOR SELECT
  USING (true);

-- Only allow admins to modify categories [you'll need to add admin logic]
-- For now, let's allow insertion/update for all authenticated users
CREATE POLICY "Authenticated users can insert categories"
  ON public.categories
  FOR INSERT
  WITH CHECK (auth.role() IS NOT NULL);

-- Folders table policies
CREATE POLICY "Users can read their own folders"
  ON public.folders
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own folders"
  ON public.folders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own folders"
  ON public.folders
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own folders"
  ON public.folders
  FOR DELETE
  USING (auth.uid() = user_id);

-- Messages table policies
CREATE POLICY "Users can read messages addressed to them"
  ON public.messages
  FOR SELECT
  USING (auth.uid() = recipient_id OR auth.uid() = sender_id);

CREATE POLICY "Users can insert messages they send"
  ON public.messages
  FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Recipients can update messages (mark as read)"
  ON public.messages
  FOR UPDATE
  USING (auth.uid() = recipient_id);

-- Trigger to automatically add user to users table after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create database views for easier querying
CREATE OR REPLACE VIEW public.product_view AS
SELECT 
  p.id,
  p.name,
  p.category,
  p.tags,
  p.is_public as "isPublic",
  p.usage_start_date as "usageStartDate",
  p.usage_end_date as "usageEndDate",
  p.created_at as "createdAt",
  p.user_id as "userId",
  p.folder_id as "folderId",
  u.email as "userEmail", 
  u.name as "userName"
FROM 
  public.products p
JOIN 
  public.users u ON p.user_id = u.id;

ALTER TABLE public.assets
ADD CONSTRAINT fk_assets_user
FOREIGN KEY (user_id)
REFERENCES public.users (id);  