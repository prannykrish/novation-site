// src/lib/database.ts
import { supabase } from './supabase';
import { Product, Category, Message, DatabaseUser, Folder, Asset } from '@/types/database';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

// Initialize the Supabase client for client components
const getSupabase = (): SupabaseClient<Database> => {
  // Use the singleton supabase instance from the supabase.ts file
  if (!supabase) {
    throw new Error('Failed to initialize Supabase client');
  }
  return supabase;
};

// Product operations
export const productService = {
  // Get all products (with optional filtering)
  async getProducts(filters: {
    keyword?: string;
    category?: string;
    tags?: string[];
    startDate?: string;
    endDate?: string;
    isPublicOnly?: boolean;
    folderId?: string;
  } = {}) {
    try {
      const supabase = getSupabase();
      
      let query = supabase
        .from('products')
        .select(`
          id, 
          name, 
          category, 
          tags, 
          is_public, 
          usage_start_date, 
          usage_end_date, 
          created_at, 
          user_id,
          folder_id, 
          users (name, email)
        `);
      
      if (filters.keyword) {
        query = query.or(`name.ilike.%${filters.keyword}%,tags.cs.{${filters.keyword}}`);
      }
      
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      
      if (filters.tags && filters.tags.length > 0) {
        // Handle tags searching in array
        query = query.contains('tags', filters.tags);
      }
      
      if (filters.startDate) {
        query = query.gte('usage_start_date', filters.startDate);
      }
      
      if (filters.endDate) {
        query = query.lte('usage_end_date', filters.endDate);
      }
      
      if (filters.isPublicOnly) {
        query = query.eq('is_public', true);
      }
      
      if (filters.folderId) {
        query = query.eq('folder_id', filters.folderId);
      }
      
      const { data, error } = await query;
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }

      // Ensure 'data' is typed correctly and handle 'users' safely
      return (data as any[]).map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        tags: item.tags,
        isPublic: item.is_public,
        usageStartDate: item.usage_start_date,
        usageEndDate: item.usage_end_date,
        createdAt: item.created_at,
        userId: item.user_id,
        folderId: item.folder_id,
        users: Array.isArray(item.users) ? item.users : [] // Ensure 'users' is an array
      }));
    } catch (error) {
      console.error('Error in getProducts:', error);
      return [];
    }
  },
  
  // Get a product by ID
  async getProductById(id: string) {
    try {
      const supabase = getSupabase();
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          id, 
          name, 
          category, 
          tags, 
          is_public, 
          usage_start_date, 
          usage_end_date, 
          created_at, 
          user_id, 
          folder_id,
          users (name, email)
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching product:', error);
        return null;
      }
      
      const safeGetUserProperty = (userData: any, prop: string): string | undefined => {
        if (!userData) return undefined;
        
        if (typeof userData === 'object' && !Array.isArray(userData)) {
          return userData[prop] || undefined;
        }
        
        if (Array.isArray(userData) && userData.length > 0) {
          return userData[0][prop] || undefined;
        }
        
        return undefined;
      };
      
      // Transform the data to match our Product type
      return {
        id: data.id,
        name: data.name,
        category: data.category,
        tags: data.tags,
        isPublic: data.is_public,
        usageStartDate: data.usage_start_date ?? undefined,
        usageEndDate: data.usage_end_date ?? undefined,
        createdAt: data.created_at,
        userId: data.user_id,
        folderId: data.folder_id ?? undefined,
        // Use the helper function for safe property access
        userName: safeGetUserProperty(data.users, 'name'),
        userEmail: safeGetUserProperty(data.users, 'email'),
        users: data.users
      } as Product;
    } catch (error) {
      console.error('Error in getProductById:', error);
      return null;
    }
  },
  
  // Create a new product
  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'userId' | 'userEmail' | 'userName'>) {
    try {
      const supabase = getSupabase();
      
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: product.name,
          category: product.category,
          tags: product.tags || [],
          is_public: product.isPublic,
          usage_start_date: product.usageStartDate || null,
          usage_end_date: product.usageEndDate || null,
          folder_id: product.folderId || null,
          user_id: user.id
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating product:', error);
        throw error;
      }
      
      // Transform the data to match our Product type
      return {
        id: data.id,
        name: data.name,
        category: data.category,
        tags: data.tags,
        isPublic: data.is_public,
        usageStartDate: data.usage_start_date,
        usageEndDate: data.usage_end_date,
        folderId: data.folder_id,
        createdAt: data.created_at,
        userId: data.user_id
      } as Product;
    } catch (error) {
      console.error('Error in createProduct:', error);
      throw error;
    }
  },
  
  // Check if a product with the same name exists
  async checkProductExists(name: string) {
    try {
      const supabase = getSupabase();
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          id, 
          name, 
          user_id, 
          users (email, name)
        `)
        .eq('name', name);
      
      if (error) {
        console.error('Error checking product:', error);
        throw error;
      }
      
      if (data.length === 0) {
        return null;
      }
      
      // Transform the data to match our Product type
      return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        userId: item.user_id,
        users: item.users
      })) as Array<{ id: string; name: string; userId: string; users: any }>;
    } catch (error) {
      console.error('Error in checkProductExists:', error);
      return null;
    }
  },
  
  // Update a product
  async updateProduct(id: string, updates: Partial<Product>) {
    try {
      const supabase = getSupabase();
      
      // Transform updates to match Supabase column names
      const supabaseUpdates: any = {};
      if (updates.name) supabaseUpdates.name = updates.name;
      if (updates.category) supabaseUpdates.category = updates.category;
      if (updates.tags) supabaseUpdates.tags = updates.tags;
      if (updates.isPublic !== undefined) supabaseUpdates.is_public = updates.isPublic;
      if (updates.usageStartDate !== undefined) supabaseUpdates.usage_start_date = updates.usageStartDate;
      if (updates.usageEndDate !== undefined) supabaseUpdates.usage_end_date = updates.usageEndDate;
      if (updates.folderId !== undefined) supabaseUpdates.folder_id = updates.folderId;
      
      const { data, error } = await supabase
        .from('products')
        .update(supabaseUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating product:', error);
        throw error;
      }
      
      // Transform the data to match our Product type
      return {
        id: data.id,
        name: data.name,
        category: data.category,
        tags: data.tags,
        isPublic: data.is_public,
        usageStartDate: data.usage_start_date,
        usageEndDate: data.usage_end_date,
        folderId: data.folder_id,
        createdAt: data.created_at,
        userId: data.user_id
      } as Product;
    } catch (error) {
      console.error('Error in updateProduct:', error);
      throw error;
    }
  },
  
  // Delete a product
  async deleteProduct(id: string) {
    try {
      const supabase = getSupabase();
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting product:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error in deleteProduct:', error);
      throw error;
    }
  },
  
  // Move product to a folder
  async moveProductToFolder(productId: string, folderId: string | null) {
    try {
      const supabase = getSupabase();
      
      const { error } = await supabase
        .from('products')
        .update({ folder_id: folderId })
        .eq('id', productId);
      
      if (error) {
        console.error('Error moving product to folder:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error in moveProductToFolder:', error);
      throw error;
    }
  }
};

// Asset operations
export const assetService = {
  // Get all assets (with optional filtering)
  async getAssets(filters: {
    keyword?: string;
    category?: string;
    tags?: string[];
    startDate?: string;
    endDate?: string;
    isPublicOnly?: boolean;
    folderId?: string;
    type?: string;
  } = {}) {
    try {
      const supabase = getSupabase();
      
      let query = supabase
        .from('assets')
        .select(`
          id, 
          name, 
          type,
          description,
          category, 
          tags, 
          is_public, 
          usage_start_date, 
          usage_end_date,
          file_url, 
          created_at, 
          user_id,
          folder_id, 
          users (name, email)
        `);
      
      if (filters.keyword) {
        query = query.or(`name.ilike.%${filters.keyword}%,description.ilike.%${filters.keyword}%,tags.cs.{${filters.keyword}}`);
      }
      
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      
      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      
      if (filters.tags && filters.tags.length > 0) {
        // Handle tags searching in array
        query = query.contains('tags', filters.tags);
      }
      
      if (filters.startDate) {
        query = query.gte('usage_start_date', filters.startDate);
      }
      
      if (filters.endDate) {
        query = query.lte('usage_end_date', filters.endDate);
      }
      
      if (filters.isPublicOnly) {
        query = query.eq('is_public', true);
      }
      
      if (filters.folderId) {
        query = query.eq('folder_id', filters.folderId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching assets:', error.message, error.details, error.hint);
        throw error;
      }
      
      // Transform the data to match our Asset type
      return data.map((item: any) => {
        // Get user details safely with proper type handling
        const userData = item.users || {};
        // Check if userData is an object and properly access properties
        const userName = userData && typeof userData === 'object' ? userData.name : undefined;
        const userEmail = userData && typeof userData === 'object' ? userData.email : undefined;
        
        return {
          id: item.id,
          name: item.name,
          type: item.type,
          description: item.description,
          category: item.category,
          tags: item.tags,
          isPublic: item.is_public,
          usageStartDate: item.usage_start_date,
          usageEndDate: item.usage_end_date,
          fileUrl: item.file_url,
          createdAt: item.created_at,
          userId: item.user_id,
          folderId: item.folder_id,
          userName: userName,
          userEmail: userEmail,
          users: userData
        };
      }) as Asset[];
    } catch (error) {
      console.error('Error in getAssets:', error instanceof Error ? error.message : String(error));
      return [];
    }
  },
  
  // Get an asset by ID
  async getAssetById(id: string) {
    try {
      const supabase = getSupabase();
      
      const { data, error } = await supabase
        .from('assets')
        .select(`
          id, 
          name,
          type,
          description, 
          category, 
          tags, 
          is_public, 
          usage_start_date, 
          usage_end_date,
          file_url, 
          created_at, 
          user_id, 
          folder_id,
          users (name, email)
        `)
        .eq('id', id)
        .single();
      
        if (error) {
          console.error('Error fetching asset:', error);
          return null;
        }
        
        // Create a helper function to safely access users properties
        const safeGetUserProperty = (userData: any, prop: string): string | undefined => {
          if (!userData) return undefined;
          
          if (typeof userData === 'object' && !Array.isArray(userData)) {
            return userData[prop] || undefined;
          }
          
          if (Array.isArray(userData) && userData.length > 0) {
            return userData[0][prop] || undefined;
          }
          
          return undefined;
        };
        
        // Transform the data to match our Asset type
        return {
          id: data.id,
          name: data.name,
          type: data.type,
          description: data.description ?? undefined,
          category: data.category ?? undefined,
          tags: data.tags,
          isPublic: data.is_public,
          usageStartDate: data.usage_start_date ?? undefined,
          usageEndDate: data.usage_end_date ?? undefined,
          fileUrl: data.file_url ?? undefined,
          createdAt: data.created_at,
          userId: data.user_id,
          folderId: data.folder_id ?? undefined,
          // Use the helper function
          userName: safeGetUserProperty(data.users, 'name'),
          userEmail: safeGetUserProperty(data.users, 'email'),
          users: data.users
        } as Asset;
      } catch (error) {
        console.error('Error in getAssetById:', error);
        return null;
      }
    },
  
  // Create a new asset
  async createAsset(asset: Omit<Asset, 'id' | 'createdAt' | 'userId' | 'userEmail' | 'userName'>) {
    try {
      const supabase = getSupabase();
      
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('assets')
        .insert({
          name: asset.name,
          type: asset.type,
          description: asset.description || null,
          category: asset.category || null,
          tags: asset.tags || [],
          is_public: asset.isPublic,
          usage_start_date: asset.usageStartDate || null,
          usage_end_date: asset.usageEndDate || null,
          file_url: asset.fileUrl || null,
          folder_id: asset.folderId || null,
          user_id: user.id
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating asset:', error);
        throw error;
      }
      
      // Transform the data to match our Asset type
      return {
        id: data.id,
        name: data.name,
        type: data.type,
        description: data.description,
        category: data.category,
        tags: data.tags,
        isPublic: data.is_public,
        usageStartDate: data.usage_start_date,
        usageEndDate: data.usage_end_date,
        fileUrl: data.file_url,
        createdAt: data.created_at,
        userId: data.user_id,
        folderId: data.folder_id
      } as Asset;
    } catch (error) {
      console.error('Error in createAsset:', error);
      throw error;
    }
  },
  
  // Check if an asset with the same name exists
  async checkAssetExists(name: string): Promise<{ 
    id: string; 
    name: string; 
    type: string; 
    isPublic: boolean; 
    createdAt: string; 
    userId: string; 
    users: { name?: string; email?: string } | undefined;
  }[] | undefined> {
    try {
      const supabase = getSupabase();
      
      const { data, error } = await supabase
        .from('assets')
        .select(`
          id, 
          name,
          type,
          is_public,
          created_at,
          user_id, 
          users (email, name)
        `)
        .eq('name', name);
      
      if (error) {
        console.error('Error checking asset:', error);
        throw error;
      }
      
      if (data.length === 0) {
        return undefined;
      }
      
      // Process data with proper type handling
      return data.map((item: any) => {
        // Handle users data safely
        const userData = item.users || undefined;
        
        return {
          id: item.id,
          name: item.name,
          type: item.type || 'unknown',
          isPublic: item.is_public ?? true,
          createdAt: item.created_at || new Date().toISOString(),
          userId: item.user_id,
          users: userData
        };
      });
    } catch (error) {
      console.error('Error in checkAssetExists:', error);
      return undefined;
    }
  },
  
  // Update an asset
  async updateAsset(id: string, updates: Partial<Asset>) {
    try {
      const supabase = getSupabase();
      
      // Transform updates to match Supabase column names
      const supabaseUpdates: any = {};
      if (updates.name !== undefined) supabaseUpdates.name = updates.name;
      if (updates.type !== undefined) supabaseUpdates.type = updates.type;
      // Use null for database storage when undefined is passed
      if (updates.description !== undefined) supabaseUpdates.description = updates.description || null;
      if (updates.category !== undefined) supabaseUpdates.category = updates.category || null;
      if (updates.tags !== undefined) supabaseUpdates.tags = updates.tags;
      if (updates.isPublic !== undefined) supabaseUpdates.is_public = updates.isPublic;
      if (updates.usageStartDate !== undefined) supabaseUpdates.usage_start_date = updates.usageStartDate || null;
      if (updates.usageEndDate !== undefined) supabaseUpdates.usage_end_date = updates.usageEndDate || null;
      if (updates.fileUrl !== undefined) supabaseUpdates.file_url = updates.fileUrl || null;
      if (updates.folderId !== undefined) supabaseUpdates.folder_id = updates.folderId || null;
      
      const { data, error } = await supabase
        .from('assets')
        .update(supabaseUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating asset:', error);
        throw error;
      }
      
      // Transform the data to match our Asset type
      return {
        id: data.id,
        name: data.name,
        type: data.type,
        description: data.description,
        category: data.category,
        tags: data.tags,
        isPublic: data.is_public,
        usageStartDate: data.usage_start_date,
        usageEndDate: data.usage_end_date,
        fileUrl: data.file_url,
        createdAt: data.created_at,
        userId: data.user_id,
        folderId: data.folder_id
      } as Asset;
    } catch (error) {
      console.error('Error in updateAsset:', error);
      throw error;
    }
  },
  
  // Delete an asset
  async deleteAsset(id: string) {
    try {
      const supabase = getSupabase();
      
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting asset:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error in deleteAsset:', error);
      throw error;
    }
  },
  
  // Move asset to a folder
  async moveAssetToFolder(assetId: string, folderId: string | null) {
    try {
      const supabase = getSupabase();
      
      const { error } = await supabase
        .from('assets')
        .update({ folder_id: folderId })
        .eq('id', assetId);
      
      if (error) {
        console.error('Error moving asset to folder:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error in moveAssetToFolder:', error);
      throw error;
    }
  }
};

// Folder operations
export const folderService = {
  // Get all folders
  async getFolders(parentId: string | null = null) {
    try {
      const supabase = getSupabase();
      
      let query = supabase
        .from('folders')
        .select('*');
      
      // Get folders at the specified level
      if (parentId === null) {
        query = query.is('parent_id', null);
      } else {
        query = query.eq('parent_id', parentId);
      }
      
      // Only get current user's folders
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      query = query.eq('user_id', user.id);
      
      const { data, error } = await query.order('name');
      
      if (error) {
        console.error('Error fetching folders:', error);
        throw error;
      }
      
      return data.map((folder: any) => ({
        id: folder.id,
        name: folder.name,
        description: folder.description,
        parentId: folder.parent_id,
        userId: folder.user_id,
        createdAt: folder.created_at
      })) as Folder[];
    } catch (error) {
      console.error('Error in getFolders:', error);
      return [];
    }
  },
  
  // Get folder by ID
  async getFolderById(id: string) {
    try {
      const supabase = getSupabase();
      
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching folder:', error);
        return null;
      }
      
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        parentId: data.parent_id,
        userId: data.user_id,
        createdAt: data.created_at
      } as Folder;
    } catch (error) {
      console.error('Error in getFolderById:', error);
      return null;
    }
  },
  
  // Create a new folder
  async createFolder(folder: Omit<Folder, 'id' | 'createdAt' | 'userId'>) {
    try {
      const supabase = getSupabase();
      
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('folders')
        .insert({
          name: folder.name,
          description: folder.description || null,
          parent_id: folder.parentId || null,
          user_id: user.id
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating folder:', error);
        throw error;
      }
      
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        parentId: data.parent_id,
        userId: data.user_id,
        createdAt: data.created_at
      } as Folder;
    } catch (error) {
      console.error('Error in createFolder:', error);
      throw error;
    }
  },
  
  // Update a folder
  async updateFolder(id: string, updates: Partial<Folder>) {
    try {
      const supabase = getSupabase();

      const supabaseUpdates: any = {};
      if (updates.name) supabaseUpdates.name = updates.name;
      if (updates.description !== undefined) supabaseUpdates.description = updates.description;
      if (updates.parentId !== undefined) supabaseUpdates.parent_id = updates.parentId;

      const { data, error } = await supabase
        .from('folders')
        .update(supabaseUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating folder:', error);
        throw error;
      }

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        parentId: data.parent_id,
        userId: data.user_id,
        createdAt: data.created_at,
      } as Folder;
    } catch (error) {
      console.error('Error in updateFolder:', error);
      throw error;
    }
  },
  
  // Delete a folder
  async deleteFolder(id: string, deleteChildren: boolean = false) {
    try {
      const supabase = getSupabase();
      
      if (deleteChildren) {
        // Get all assets in this folder
        const { data: assetsInFolder, error: assetQueryError } = await supabase
          .from('assets')
          .select('id')
          .eq('folder_id', id);
        
        if (assetQueryError) {
          console.error('Error querying assets in folder:', assetQueryError);
          throw assetQueryError;
        }
        
        // Delete all assets in this folder
        if (assetsInFolder && assetsInFolder.length > 0) {
          const assetIds = assetsInFolder.map(asset => asset.id);
          const { error: assetDeleteError } = await supabase
            .from('assets')
            .delete()
            .in('id', assetIds);
          
          if (assetDeleteError) {
            console.error('Error deleting assets in folder:', assetDeleteError);
            throw assetDeleteError;
          }
        }
        
        // Get all subfolders
        const { data: subfolders, error: subfolderQueryError } = await supabase
          .from('folders')
          .select('id')
          .eq('parent_id', id);
        
        if (subfolderQueryError) {
          console.error('Error querying subfolders:', subfolderQueryError);
          throw subfolderQueryError;
        }
        
        // Recursively delete subfolders
        if (subfolders && subfolders.length > 0) {
          for (const subfolder of subfolders) {
            await this.deleteFolder(subfolder.id, true);
          }
        }
      } else {
        // Move all assets in this folder to root
        const { error: updateAssetsError } = await supabase
          .from('assets')
          .update({ folder_id: null })
          .eq('folder_id', id);
        
        if (updateAssetsError) {
          console.error('Error updating assets in folder:', updateAssetsError);
          throw updateAssetsError;
        }
        
        // Move all products in this folder to root
        const { error: updateProductsError } = await supabase
          .from('products')
          .update({ folder_id: null })
          .eq('folder_id', id);
        
        if (updateProductsError) {
          console.error('Error updating products in folder:', updateProductsError);
          throw updateProductsError;
        }
        
        // Move all subfolders to root
        const { error: updateSubfoldersError } = await supabase
          .from('folders')
          .update({ parent_id: null })
          .eq('parent_id', id);
        
        if (updateSubfoldersError) {
          console.error('Error updating subfolders:', updateSubfoldersError);
          throw updateSubfoldersError;
        }
      }
      
      // Then delete the folder
      const { error } = await supabase
        .from('folders')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting folder:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error in deleteFolder:', error);
      throw error;
    }
  }
};

// Category operations
export const categoryService = {
  // Get all categories
  async getCategories() {
    try {
      const supabase = getSupabase();
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
      
      return data as Category[];
    } catch (error) {
      console.error('Error in getCategories:', error);
      return [];
    }
  },
  
  // Create a new category
  async createCategory(name: string) {
    try {
      const supabase = getSupabase();
      
      // Generate an ID from the name (slug)
      const id = name.toLowerCase().replace(/\s+/g, '-');
      
      const { data, error } = await supabase
        .from('categories')
        .insert({ id, name })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating category:', error);
        throw error;
      }
      
      return data as Category;
    } catch (error) {
      console.error('Error in createCategory:', error);
      throw error;
    }
  }
};

// Message operations
export const messageService = {
  // Get messages for current user
  async getUserMessages() {
    try {
      const supabase = getSupabase();
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          subject,
          content,
          sender_id,
          recipient_id,
          related_product_id,
          created_at,
          is_read,
          sender:sender_id(name, email)
        `)
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }
      
      // Transform data to match our Message type
      return data.map((item: any) => ({
        id: item.id,
        subject: item.subject,
        content: item.content,
        senderId: item.sender_id,
        recipientId: item.recipient_id,
        relatedProductId: item.related_product_id,
        createdAt: item.created_at,
        isRead: item.is_read,
        senderName: item.sender?.name,
        senderEmail: item.sender?.email,
        sender: item.sender
      })) as Message[];
    } catch (error) {
      console.error('Error in getUserMessages:', error);
      return [];
    }
  },
  
  // Send a message
  async sendMessage(message: Omit<Message, 'id' | 'createdAt' | 'senderId' | 'senderName' | 'senderEmail' | 'isRead'>) {
    try {
      const supabase = getSupabase();
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('messages')
        .insert({
          subject: message.subject,
          content: message.content,
          sender_id: user.id,
          recipient_id: message.recipientId,
          related_product_id: message.relatedProductId || null,
          is_read: false
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error sending message:', error);
        throw error;
      }
      
      // Transform data to match our Message type
      return {
        id: data.id,
        subject: data.subject,
        content: data.content,
        senderId: data.sender_id,
        recipientId: data.recipient_id,
        relatedProductId: data.related_product_id,
        createdAt: data.created_at,
        isRead: data.is_read
      } as Message;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      throw error;
    }
  },
  
  // Mark message as read
  async markAsRead(id: string) {
    try {
      const supabase = getSupabase();
      
      const { data, error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error marking message as read:', error);
        throw error;
      }
      
      // Transform data to match our Message type
      return {
        id: data.id,
        subject: data.subject,
        content: data.content,
        senderId: data.sender_id,
        recipientId: data.recipient_id,
        relatedProductId: data.related_product_id,
        createdAt: data.created_at,
        isRead: data.is_read
      } as Message;
    } catch (error) {
      console.error('Error in markAsRead:', error);
      throw error;
    }
  }
};

// User operations
export const userService = {
  // Get all users
  async getUsers() {
    try {
      const supabase = getSupabase();
      
      const { data, error } = await supabase
        .from('users')
        .select('id, email, name, avatar_url');
      
      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
      // Transform data to match our DatabaseUser type
      return data.map((item: any) => ({
        id: item.id,
        email: item.email,
        name: item.name,
        avatar_url: item.avatar_url
      })) as DatabaseUser[];
    } catch (error) {
      console.error('Error in getUsers:', error);
      return [];
    }
  },
  
  // Get user by ID
  async getUserById(id: string) {
    try {
      const supabase = getSupabase();
      
      const { data, error } = await supabase
        .from('users')
        .select('id, email, name, avatar_url')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching user:', error);
        return null;
      }
      
      return data as DatabaseUser;
    } catch (error) {
      console.error('Error in getUserById:', error);
      return null;
    }
  },
  
  // Get current user
  async getCurrentUser() {
    try {
      const supabase = getSupabase();
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error('Auth error in getCurrentUser:', authError.message);
        return null;
      }
      
      if (!user) {
        console.log('No authenticated user found');
        return null;
      }
      
      // First check if the user exists in our users table
      const { data, error } = await supabase
        .from('users')
        .select('id, email, name, avatar_url')
        .eq('id', user.id)
        .single();
      
      if (error || !data) {
        console.error('Error fetching current user:', error);
        
        // If user doesn't exist in our table, try to create it
        try {
          const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert({
              id: user.id,
              email: user.email || '',
              name: user.user_metadata?.name || null,
              avatar_url: user.user_metadata?.avatar_url || null
            })
            .select()
            .single();
          
          if (insertError) {
            console.error('Error creating user in users table:', insertError);
            return {
              id: user.id,
              email: user.email || '',
              name: user.user_metadata?.name,
              avatar_url: user.user_metadata?.avatar_url
            };
          }
          
          return newUser as DatabaseUser;
        } catch (insertErr) {
          console.error('Error in user creation fallback:', insertErr);
          return {
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name,
            avatar_url: user.user_metadata?.avatar_url
          };
        }
      }
      
      return data as DatabaseUser;
    } catch (error) {
      console.error('Error in getCurrentUser:', error instanceof Error ? error.message : String(error));
      return null;
    }
  }
};