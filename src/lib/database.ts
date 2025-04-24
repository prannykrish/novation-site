// src/lib/database.ts
import { supabase } from './supabase';
import { Product, Category, Message, DatabaseUser, Folder, Asset, MessageAttachment, BlockedUser } from '@/types/database';
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
  // Get all assets with pagination
  async getAssetsWithPagination(filters: {
    keyword?: string;
    category?: string;
    tags?: string[];
    startDate?: string;
    endDate?: string;
    isPublicOnly?: boolean;
    folderId?: string;
    type?: string;
    page?: number;
    pageSize?: number;
    currentUserOnly?: boolean; // Filter to only show assets from the current user
  } = {}) {
    try {
      const supabase = getSupabase();
      
      // Default pagination values
      const page = filters.page || 1;
      const pageSize = filters.pageSize || 12;
      const startIndex = (page - 1) * pageSize;
      
      // Build query for filtered assets
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
          files,
          created_at, 
          user_id,
          folder_id, 
          users (name, email)
        `, { count: 'exact' });  // Add count to get total number of matching records
      
      // If currentUserOnly is true, only show the current user's assets
      if (filters.currentUserOnly) {
        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          console.error('Auth error:', authError);
          throw new Error('User not authenticated');
        }
        
        // Add filter for current user
        query = query.eq('user_id', user.id);
      }
      
      // Apply filters
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
      
      // Apply pagination
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(startIndex, startIndex + pageSize - 1);
      
      if (error) {
        console.error('Error fetching paginated assets:', error.message, error.details, error.hint);
        throw error;
      }
      
      // Transform the data to match our Asset type
      const items = data.map((item: any) => {
        // Get user details safely with proper type handling
        const userData = item.users || {};
        // Check if userData is an object and properly access properties
        const userName = userData && typeof userData === 'object' ? userData.name : undefined;
        const userEmail = userData && typeof userData === 'object' ? userData.email : undefined;
        
        // Process files array if available
        let files = undefined;
        if (item.files) {
          try {
            // If files is a string (JSON), parse it
            if (typeof item.files === 'string') {
              files = JSON.parse(item.files);
            } else if (Array.isArray(item.files)) {
              files = item.files;
            }
          } catch (e) {
            console.error('Error parsing files JSON:', e);
          }
        }
        
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
          fileUrl: item.file_url, // Legacy file URL
          files: files, // New multiple files
          createdAt: item.created_at,
          userId: item.user_id,
          folderId: item.folder_id,
          userName: userName,
          userEmail: userEmail,
          users: userData
        };
      }) as Asset[];
      
      return {
        items,
        total: count || 0,
        page,
        pageSize,
        pageCount: Math.ceil((count || 0) / pageSize)
      };
    } catch (error) {
      console.error('Error in getAssetsWithPagination:', error instanceof Error ? error.message : String(error));
      return { items: [], total: 0, page: 1, pageSize: 12, pageCount: 0 };
    }
  },
  
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
    page?: number;
    pageSize?: number;
    currentUserOnly?: boolean; // Filter to only show assets from the current user
  } = {}) {
    // For backwards compatibility, use the pagination method and return just the items
    const result = await this.getAssetsWithPagination(filters);
    return result.items;
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
          files,
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
        
        // Process files array if available
        let files = undefined;
        if (data.files) {
          try {
            // If files is a string (JSON), parse it
            if (typeof data.files === 'string') {
              files = JSON.parse(data.files);
            } else if (Array.isArray(data.files)) {
              files = data.files;
            }
          } catch (e) {
            console.error('Error parsing files JSON:', e);
          }
        }
        
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
          files: files,
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

      // Process files data - ensure it's stored as a proper JSON string if provided
      let filesData = null;
      if (asset.files && Array.isArray(asset.files) && asset.files.length > 0) {
        filesData = asset.files;
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
          files: filesData,
          folder_id: asset.folderId || null,
          user_id: user.id
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating asset:', error);
        throw error;
      }
      
      // Process files array if available in the response
      let files = undefined;
      if (data.files) {
        try {
          // If files is a string (JSON), parse it
          if (typeof data.files === 'string') {
            files = JSON.parse(data.files);
          } else if (Array.isArray(data.files)) {
            files = data.files;
          }
        } catch (e) {
          console.error('Error parsing files JSON:', e);
        }
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
        files: files,
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
      if (updates.files !== undefined) supabaseUpdates.files = updates.files;
      
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
      
      // Process files array if available
      let files = undefined;
      if (data.files) {
        try {
          // If files is a string (JSON), parse it
          if (typeof data.files === 'string') {
            files = JSON.parse(data.files);
          } else if (Array.isArray(data.files)) {
            files = data.files;
          }
        } catch (e) {
          console.error('Error parsing files JSON:', e);
        }
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
        files: files,
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
  },

  // Upload a file for an asset
  async uploadFile(file: File): Promise<{ url: string; name: string; type: string; size: number }> {
    try {
      const supabase = getSupabase();
      
      // Check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error('Auth error in uploadFile:', authError);
        throw new Error(`Authentication error: ${authError.message}`);
      }
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Create a sanitized filename with timestamp
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `assets/${timestamp}-${sanitizedName}`;
      
      console.log(`Attempting to upload file to path: ${filePath}`);
      
      const { data, error } = await supabase
        .storage
        .from('files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });
      
      if (error) {
        console.error('Error uploading file:', JSON.stringify(error));
        throw new Error(`Upload failed: ${error.message}`);
      }
      
      if (!data || !data.path) {
        console.error('Upload returned no data or path');
        throw new Error('Upload returned invalid data');
      }
      
      // Get the public URL
      const { data: urlData } = supabase.storage.from('files').getPublicUrl(data.path);
      
      if (!urlData || !urlData.publicUrl) {
        console.error('Failed to get public URL for file');
        throw new Error('Could not generate public URL for file');
      }
      
      return {
        url: urlData.publicUrl,
        name: file.name,
        type: file.type,
        size: file.size
      };
    } catch (error) {
      console.error('Error in uploadFile:', error instanceof Error ? error.message : JSON.stringify(error));
      throw error;
    }
  },

  // Delete a file
  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      const supabase = getSupabase();
      
      // Extract the path from the URL
      const urlObj = new URL(fileUrl);
      const pathSegments = urlObj.pathname.split('/');
      // The last two segments should be 'files' and the actual file path
      const filePath = pathSegments.slice(-1)[0];
      
      const { error } = await supabase
        .storage
        .from('files')
        .remove([`assets/${filePath}`]);
      
      if (error) {
        console.error('Error deleting file:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error in deleteFile:', error);
      return false;
    }
  }
};

// Message operations
export const messageService = {
  // Get all messages for current user (sent and received)
  async getUserMessages(): Promise<Message[]> {
    try {
      const supabase = getSupabase();
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error('Auth error:', authError.message || JSON.stringify(authError));
        throw new Error(`Authentication error: ${authError.message || 'Unknown auth error'}`);
      }
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // First, get all messages for the current user
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });
        
      if (messagesError) {
        console.error('Error fetching messages:', messagesError.message || JSON.stringify(messagesError));
        throw new Error(`Failed to fetch messages: ${messagesError.message || 'Unknown database error'}`);
      }
      
      if (!messagesData) return [];
      
      // Get list of unique user IDs from the messages
      const userIds = new Set<string>();
      messagesData.forEach((msg: any) => {
        if (msg.sender_id !== user.id) userIds.add(msg.sender_id);
        if (msg.recipient_id !== user.id) userIds.add(msg.recipient_id);
      });
      
      // Fetch user data for all users involved in conversations
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, name, email')
        .in('id', Array.from(userIds));
        
      if (usersError) {
        console.error('Error fetching users:', usersError);
        // Continue with message data even if user data fails
      }
      
      // Create a map of user data
      const userMap = new Map<string, any>();
      if (usersData) {
        usersData.forEach(userData => {
          userMap.set(userData.id, userData);
        });
      }
      
      // Format and return messages with user data attached
      return messagesData.map((msg: any) => ({
        id: msg.id,
        subject: msg.subject || '',
        content: msg.content,
        senderId: msg.sender_id,
        recipientId: msg.recipient_id,
        relatedProductId: msg.related_product_id,
        relatedAssetId: msg.related_asset_id,
        createdAt: msg.created_at,
        isRead: msg.is_read,
        senderName: msg.sender_id !== user.id && userMap.get(msg.sender_id) ? userMap.get(msg.sender_id).name : null,
        senderEmail: msg.sender_id !== user.id && userMap.get(msg.sender_id) ? userMap.get(msg.sender_id).email : null,
        recipientName: msg.recipient_id !== user.id && userMap.get(msg.recipient_id) ? userMap.get(msg.recipient_id).name : null,
        recipientEmail: msg.recipient_id !== user.id && userMap.get(msg.recipient_id) ? userMap.get(msg.recipient_id).email : null
      }));
    } catch (error) {
      console.error('Error in getUserMessages:', error instanceof Error ? error.message : JSON.stringify(error));
      return [];
    }
  },
  
  // Get unread messages count for current user
  async getUnreadMessagesCount(): Promise<number> {
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
      
      // Efficiently count unread messages without fetching entire message content
      const { count, error } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('recipient_id', user.id)
        .eq('is_read', false);
      
      if (error) {
        console.error('Error counting unread messages:', error);
        throw error;
      }
      
      return count || 0;
    } catch (error) {
      console.error('Error in getUnreadMessagesCount:', error);
      return 0;
    }
  },
  
  // Mark a message as read
  async markAsRead(messageId: string): Promise<boolean> {
    try {
      const supabase = getSupabase();
      
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId);
      
      if (error) {
        console.error('Error marking message as read:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error in markAsRead:', error);
      throw error;
    }
  },
  
  // Send a new message
  async sendMessage(messageData: {
    recipientId: string; 
    subject?: string; 
    content: string;
    attachments?: MessageAttachment[];
    relatedProductId?: string;
    relatedAssetId?: string;
  }): Promise<Message | null> {
    try {
      const supabase = getSupabase();
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error('Auth error:', authError);
        return null;
      }
      
      // Check if the receiver has blocked the sender
      const { count: blockedCount, error: blockedError } = await supabase
        .from('blocked_users')
        .select('*', { count: 'exact', head: true })
        .eq('blocker_id', messageData.recipientId)
        .eq('blocked_id', user.id);
        
      if (blockedError) {
        console.error('Error checking if blocked:', blockedError);
        return null;
      }
      
      if (blockedCount && blockedCount > 0) {
        console.error('Cannot send message: you are blocked by this user');
        throw new Error('Cannot send message: you are blocked by this user');
      }
      
      // Create the message
      const dbMessageData = {
        sender_id: user.id,
        recipient_id: messageData.recipientId,
        subject: messageData.subject || '',
        content: messageData.content,
        related_product_id: messageData.relatedProductId || null,
        related_asset_id: messageData.relatedAssetId || null,
        created_at: new Date().toISOString(),
        is_read: false
      };
      
      const { data: messageResult, error: messageError } = await supabase
        .from('messages')
        .insert(dbMessageData)
        .select()
        .single();
      
      if (messageError || !messageResult) {
        console.error('Error sending message:', messageError);
        return null;
      }
      
      // Process attachments if any
      if (messageData.attachments && messageData.attachments.length > 0) {
        for (const attachment of messageData.attachments) {
          // Save each attachment association
          const attachmentData = {
            message_id: messageResult.id,
            url: attachment.url,
            name: attachment.name,
            type: attachment.type,
            size: attachment.size
          };
          
          const { error: attachmentError } = await supabase
            .from('message_attachments')
            .insert(attachmentData);
            
          if (attachmentError) {
            console.error('Error saving attachment data:', attachmentError);
            // Continue with other attachments
          }
        }
      }
      
      // Return the new message with proper format
      return this.formatMessage(messageResult);
    } catch (error) {
      console.error('Error in sendMessage:', error);
      return null;
    }
  },
  
  // Legacy method for backward compatibility 
  async sendMessageLegacy(receiverId: string, content: string, attachments?: File[]): Promise<Message | null> {
    return this.sendMessage({
      recipientId: receiverId,
      content: content,
      attachments: []
    });
  },
  
  async getAttachments(messageId: string): Promise<MessageAttachment[]> {
    try {
      const supabase = getSupabase();
      
      const { data, error } = await supabase
        .from('message_attachments')
        .select('*')
        .eq('message_id', messageId);
        
      if (error || !data) {
        console.error('Error getting attachments:', error);
        return [];
      }
      
      return data;
    } catch (error) {
      console.error('Error in getAttachments:', error);
      return [];
    }
  },
  
  async deleteAttachment(attachmentId: string): Promise<boolean> {
    try {
      const supabase = getSupabase();
      
      // Get the attachment to delete the file
      const { data: attachment, error: fetchError } = await supabase
        .from('message_attachments')
        .select('file_path')
        .eq('id', attachmentId)
        .single();
        
      if (fetchError || !attachment) {
        console.error('Error fetching attachment:', fetchError);
        return false;
      }
      
      // Delete the file from storage
      const { error: storageError } = await supabase
        .storage
        .from('attachments')
        .remove([attachment.file_path]);
        
      if (storageError) {
        console.error('Error deleting attachment file:', storageError);
        // Continue to delete the database record even if file removal failed
      }
      
      // Delete the record from the database
      const { error: deleteError } = await supabase
        .from('message_attachments')
        .delete()
        .eq('id', attachmentId);
        
      if (deleteError) {
        console.error('Error deleting attachment record:', deleteError);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in deleteAttachment:', error);
      return false;
    }
  },

  // Helper function to format a message
  formatMessage(messageData: any): Message {
    return {
      id: messageData.id,
      subject: messageData.subject || '',
      content: messageData.content,
      senderId: messageData.sender_id,
      recipientId: messageData.recipient_id,
      relatedProductId: messageData.related_product_id,
      relatedAssetId: messageData.related_asset_id,
      createdAt: messageData.created_at,
      isRead: messageData.is_read,
      // These fields might not be available from database directly
      senderEmail: undefined,
      senderName: undefined,
      recipientEmail: undefined,
      recipientName: undefined
    };
  },
  
  // Get messages with attachments
  async getMessagesWithAttachments(): Promise<Message[]> {
    try {
      const supabase = getSupabase();
      
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error('Auth error in getMessagesWithAttachments:', authError);
        return [];
      }
      
      if (!user) {
        return [];
      }
      
      // Get messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select(`
          *,
          message_attachments(*)
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });
      
      if (messagesError) {
        console.error('Error fetching messages with attachments:', messagesError);
        return [];
      }
      
      // Format messages with attachments
      return messagesData.map((msg: any) => ({
        id: msg.id,
        subject: msg.subject,
        content: msg.content,
        senderId: msg.sender_id,
        recipientId: msg.recipient_id,
        relatedProductId: msg.related_product_id,
        relatedAssetId: msg.related_asset_id,
        createdAt: msg.created_at,
        isRead: msg.is_read,
        attachments: msg.message_attachments.map((att: any) => ({
          id: att.id,
          url: att.url,
          name: att.name,
          type: att.type,
          size: att.size,
          messageId: att.message_id
        }))
      }));
    } catch (error) {
      console.error('Error in getMessagesWithAttachments:', error);
      return [];
    }
  },

  // Upload a file attachment for messages
  async uploadAttachment(file: File): Promise<MessageAttachment> {
    try {
      const supabase = getSupabase();
      
      // Upload the file to storage
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `message_attachments/${timestamp}_${sanitizedName}`;
      
      const { error: uploadError, data } = await supabase
        .storage
        .from('attachments')
        .upload(filePath, file);
        
      if (uploadError || !data) {
        console.error('Error uploading attachment:', uploadError);
        throw new Error('Failed to upload attachment');
      }
      
      // Get the file URL
      const { data: urlData } = supabase
        .storage
        .from('attachments')
        .getPublicUrl(filePath);
        
      if (!urlData || !urlData.publicUrl) {
        console.error('Error getting attachment URL');
        throw new Error('Failed to get attachment URL');
      }
      
      // Return attachment data
      return {
        url: urlData.publicUrl,
        name: file.name,
        type: file.type,
        size: file.size
      };
    } catch (error) {
      console.error('Error in uploadAttachment:', error);
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
  
  // Add getAllUsers as an alias of getUsers to fix the error
  async getAllUsers() {
    return this.getUsers();
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
  },
  
  // Block a user
  async blockUser(userIdToBlock: string): Promise<boolean> {
    try {
      const supabase = getSupabase();
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error('Auth error:', authError);
        return false;
      }
      
      // Check if already blocked
      const { count, error: checkError } = await supabase
        .from('blocked_users')
        .select('*', { count: 'exact', head: true })
        .eq('blocker_id', user.id)
        .eq('blocked_id', userIdToBlock);
        
      if (checkError) {
        console.error('Error checking if user is already blocked:', checkError);
        return false;
      }
      
      if (count && count > 0) {
        // User is already blocked
        return true;
      }
      
      // Block the user
      const blockData = {
        blocker_id: user.id,
        blocked_id: userIdToBlock,
        blocked_at: new Date().toISOString()
      };
      
      const { error: blockError } = await supabase
        .from('blocked_users')
        .insert(blockData);
        
      if (blockError) {
        console.error('Error blocking user:', blockError);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in blockUser:', error);
      return false;
    }
  },
  
  // Unblock a user
  async unblockUser(userIdToUnblock: string): Promise<boolean> {
    try {
      const supabase = getSupabase();
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error('Auth error:', authError);
        return false;
      }
      
      const { error: unblockError } = await supabase
        .from('blocked_users')
        .delete()
        .eq('blocker_id', user.id)
        .eq('blocked_id', userIdToUnblock);
        
      if (unblockError) {
        console.error('Error unblocking user:', unblockError);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in unblockUser:', error);
      return false;
    }
  },
  
  // Check if a user is blocked by the current user
  async isUserBlocked(userId: string): Promise<boolean> {
    try {
      const supabase = getSupabase();
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error('Auth error:', authError);
        return false;
      }
      
      // Check if the other user has blocked me
      const { count, error: blockedError } = await supabase
        .from('blocked_users')
        .select('*', { count: 'exact', head: true })
        .eq('blocker_id', userId)
        .eq('blocked_id', user.id);
        
      if (blockedError) {
        console.error('Error checking if user is blocked:', blockedError);
        return false;
      }
      
      return count ? count > 0 : false;
    } catch (error) {
      console.error('Error in isUserBlocked:', error);
      return false;
    }
  },
  
  // Get all blocked users for the current user
  async getBlockedUsers(): Promise<{ id: string, username: string }[]> {
    try {
      const supabase = getSupabase();
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error('Auth error:', authError);
        return [];
      }
      
      // Get users I have blocked
      const { data: blockedUsers, error: blockedError } = await supabase
        .from('blocked_users')
        .select('blocked_id')
        .eq('blocker_id', user.id);
        
      if (blockedError || !blockedUsers) {
        console.error('Error getting blocked users:', blockedError);
        return [];
      }
      
      if (blockedUsers.length === 0) {
        return [];
      }
      
      // Get the user details for blocked users
      const blockedIds = blockedUsers.map(bu => bu.blocked_id);
      const { data: userDetails, error: userError } = await supabase
        .from('users')
        .select('id, username')
        .in('id', blockedIds);
        
      if (userError || !userDetails) {
        console.error('Error getting user details for blocked users:', userError);
        return [];
      }
      
      return userDetails;
    } catch (error) {
      console.error('Error in getBlockedUsers:', error);
      return [];
    }
  }
};