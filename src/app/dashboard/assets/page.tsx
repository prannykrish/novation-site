"use client"

import { useState, useEffect, useRef } from "react"
import { Folder as FolderIcon, Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { assetService, folderService } from "@/lib/database"
import { Asset, Folder } from "@/types/database"
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import React from "react"

const DEFAULT_ASSET_TYPES = [
  { id: "document", name: "Document" },
  { id: "image", name: "Image" },
  { id: "presentation", name: "Presentation" },
  { id: "spreadsheet", name: "Spreadsheet" },
  { id: "other", name: "Other" }
]

const DEFAULT_CATEGORIES = [
  { id: "body-care", name: "Body Care" },
  { id: "mens-grooming", name: "Men's Grooming" }
]

// Drag item types
const ItemTypes = {
  ASSET: 'asset',
  FOLDER: 'folder'
}

// Draggable asset component
function DraggableAsset({ asset, onEdit, onDelete }: { 
  asset: Asset, 
  onEdit: (asset: Asset) => void,
  onDelete: (assetId: string) => void 
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.ASSET,
    item: { id: asset.id, type: ItemTypes.ASSET },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  drag(ref);
  
  return (
    <div 
      ref={ref} 
      className={`rounded-lg border bg-card p-4 shadow-sm hover:shadow-md transition-all ${
        isDragging ? 'opacity-50 ring-2 ring-primary ring-offset-2' : ''
      }`}
      style={{ touchAction: 'none' }}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="max-w-[80%]">
          <h3 className="font-medium text-lg line-clamp-1">{asset.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-1">{asset.type}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
              <span className="sr-only">Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(asset)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(asset.id)} 
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {asset.description && (
        <p className="text-sm text-muted-foreground mt-1 mb-2 line-clamp-2">{asset.description}</p>
      )}
      
      <div className="space-y-2">
        {asset.category && (
          <div className="text-xs overflow-hidden">
            <span className="text-muted-foreground">Category: </span>
            <span className="inline-block line-clamp-1">{asset.category}</span>
          </div>
        )}
        
        {asset.tags && asset.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1 max-h-[40px] overflow-hidden">
            {asset.tags.map((tag, i) => (
              <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded truncate max-w-[100px]">{tag}</span>
            ))}
          </div>
        )}
        
        <div className="text-xs flex justify-between mt-2">
          <span className={asset.isPublic ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}>
            {asset.isPublic ? "Public" : "Private"}
          </span>
          <span className="text-muted-foreground">
            {new Date(asset.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}

// Draggable and droppable folder component
function DraggableFolderCard({ 
  folder, 
  onNavigate,
  onEdit,
  onDelete,
  onDrop
}: { 
  folder: Folder, 
  onNavigate: (folderId: string) => void,
  onEdit: (folder: Folder) => void,
  onDelete: (folderId: string) => void,
  onDrop: (itemId: string, itemType: string, targetFolderId: string) => void
}) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Make the folder draggable
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.FOLDER,
    item: { id: folder.id, type: ItemTypes.FOLDER },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  // Make the folder a drop target for both assets and other folders
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: [ItemTypes.ASSET, ItemTypes.FOLDER],
    drop: (item: { id: string, type: string }) => {
      if (item.id !== folder.id) { // Prevent dropping folder onto itself
        onDrop(item.id, item.type, folder.id);
      }
    },
    canDrop: (item) => item.id !== folder.id, // Prevent dropping folder onto itself
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  
  // Combine drag and drop refs
  drag(drop(ref));
  
  return (
    <div 
      ref={ref} 
      className={`rounded-lg border bg-card p-4 shadow-sm transition-all cursor-pointer
        ${isDragging ? 'opacity-50 ring-2 ring-primary ring-offset-2' : ''}
        ${isOver && canDrop ? 'ring-2 ring-primary ring-offset-2 bg-primary/5' : ''}
        hover:shadow-md hover:bg-muted/30`}
      onClick={() => onNavigate(folder.id)}
      style={{ touchAction: 'none' }}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <FolderIcon className="h-8 w-8 text-primary mr-2" />
          <div>
            <h3 className="font-medium text-lg line-clamp-1">{folder.name}</h3>
            {folder.description && (
              <p className="text-xs text-muted-foreground line-clamp-1">{folder.description}</p>
            )}
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
              <span className="sr-only">Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onEdit(folder);
            }}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(folder.id);
              }}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {isOver && canDrop && (
        <div className="absolute inset-0 bg-primary/10 rounded-lg border-2 border-primary border-dashed pointer-events-none" />
      )}
    </div>
  );
}

// Root drop area component (for dropping into "root" - no folder)
function RootDropArea({ 
  onDrop, 
  isActive 
}: { 
  onDrop: (itemId: string, itemType: string) => void,
  isActive: boolean
}) {
  const ref = useRef<HTMLDivElement>(null);
  
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: [ItemTypes.ASSET, ItemTypes.FOLDER],
    drop: (item: { id: string, type: string }) => {
      onDrop(item.id, item.type);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  
  drop(ref);
  
  if (!isActive) return null;
  
  return (
    <div 
      ref={ref} 
      className={`mt-4 mb-2 rounded-lg border-2 border-dashed p-8 flex justify-center items-center ${
        isOver && canDrop ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'
      }`}
    >
      <p className="text-muted-foreground">
        {isOver && canDrop ? "Drop to move to root" : "Drag items here to move to root"}
      </p>
    </div>
  );
}

export default function AssetsPage() {
  // State for assets and folders
  const [assets, setAssets] = useState<Asset[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [folderPath, setFolderPath] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Dialog states
  const [showAddAssetDialog, setShowAddAssetDialog] = useState(false);
  const [showAddFolderDialog, setShowAddFolderDialog] = useState(false);
  const [showEditAssetDialog, setShowEditAssetDialog] = useState(false);
  const [showEditFolderDialog, setShowEditFolderDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Form states
  const [newAsset, setNewAsset] = useState({
    name: "",
    type: "",
    description: "",
    category: "",
    tags: "",
    isPublic: true,
    usageStartDate: "",
    usageEndDate: "",
  });
  
  const [newFolder, setNewFolder] = useState({
    name: "",
    description: "",
  });
  
  // Edit states
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [deletingItem, setDeletingItem] = useState<{ id: string, type: string, name: string } | null>(null);
  const [deleteChildren, setDeleteChildren] = useState(false);

  // Load initial data and handle navigation
  useEffect(() => {
    loadFolderContent();
  }, [currentFolder]);

  const loadFolderContent = async () => {
    setLoading(true);
    try {
      // Load folders in current location
      const folderData = await folderService.getFolders(currentFolder?.id || null);
      setFolders(folderData);
      
      // Load assets in current location
      const assetData = await assetService.getAssets({ 
        folderId: currentFolder?.id || null
      });
      
      // Filter the assets to ensure only those that belong to the current folder are shown
      // This ensures assets in subfolders don't appear in root and vice versa
      const filteredAssetData = assetData.filter(asset => {
        if (currentFolder) {
          // In a folder: show only assets that belong to this specific folder
          return asset.folderId === currentFolder.id;
        } else {
          // In root: show only assets that don't belong to any folder
          return asset.folderId === null;
        }
      });
      
      setAssets(filteredAssetData);
      
      // Update folder path if needed
      if (currentFolder) {
        if (!folderPath.some(f => f.id === currentFolder.id)) {
          const updatedPath = [...folderPath, currentFolder];
          setFolderPath(updatedPath);
        }
      } else {
        setFolderPath([]);
      }
    } catch (error) {
      console.error("Error loading folder content:", error);
    } finally {
      setLoading(false);
    }
  };

  // Navigation functions
  const navigateToFolder = async (folderId: string) => {
    try {
      const folder = await folderService.getFolderById(folderId);
      if (folder) {
        setCurrentFolder(folder);
        
        // Update path if needed
        if (folderPath.findIndex(f => f.id === folder.id) >= 0) {
          // If going back in the path
          const newPath = folderPath.slice(0, folderPath.findIndex(f => f.id === folder.id) + 1);
          setFolderPath(newPath);
        }
      }
    } catch (error) {
      console.error("Error navigating to folder:", error);
    }
  };

  const navigateUp = () => {
    if (folderPath.length > 1) {
      // Go to parent folder
      const parentFolder = folderPath[folderPath.length - 2];
      setCurrentFolder(parentFolder);
      setFolderPath(folderPath.slice(0, folderPath.length - 1));
    } else {
      // Go to root
      setCurrentFolder(null);
      setFolderPath([]);
    }
  };

  const navigateToRoot = () => {
    setCurrentFolder(null);
    setFolderPath([]);
  };

  // Handle drag and drop
  const handleDrop = async (itemId: string, itemType: string, targetFolderId?: string) => {
    setLoading(true);
    try {
      if (itemType === ItemTypes.ASSET) {
        // Move asset to target folder (or root if targetFolderId is undefined)
        await assetService.moveAssetToFolder(itemId, targetFolderId || null);
      } else if (itemType === ItemTypes.FOLDER) {
        // Move folder to target folder (or root if targetFolderId is undefined)
        await folderService.updateFolder(itemId, {
          parentId: targetFolderId || null
        });
      }
      // Reload current folder content
      await loadFolderContent();
    } catch (error) {
      console.error(`Error moving ${itemType} to folder:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Create folder/asset handlers
  const handleCreateFolder = async () => {
    if (!newFolder.name) return;
    
    setLoading(true);
    try {
      await folderService.createFolder({
        name: newFolder.name,
        description: newFolder.description,
        parentId: currentFolder?.id || undefined,
      });
      
      setNewFolder({ name: "", description: "" });
      setShowAddFolderDialog(false);
      await loadFolderContent();
    } catch (error) {
      console.error("Error creating folder:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAsset = async () => {
    if (!newAsset.name || !newAsset.type) {
      alert("Asset name and type are required");
      return;
    }
    
    setLoading(true);
    try {
      const tagsArray = newAsset.tags
        ? newAsset.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];
        
      await assetService.createAsset({
        name: newAsset.name,
        type: newAsset.type,
        description: newAsset.description || undefined,
        category: newAsset.category || undefined,
        tags: tagsArray,
        isPublic: newAsset.isPublic,
        usageStartDate: newAsset.usageStartDate || undefined,
        usageEndDate: newAsset.usageEndDate || undefined,
        folderId: currentFolder?.id || undefined,
      });
      
      // Reset form and refresh
      setNewAsset({
        name: "",
        type: "",
        description: "",
        category: "",
        tags: "",
        isPublic: true,
        usageStartDate: "",
        usageEndDate: "",
      });
      setShowAddAssetDialog(false);
      await loadFolderContent();
    } catch (error) {
      console.error("Error creating asset:", error);
    } finally {
      setLoading(false);
    }
  };

  // Edit handlers
  const handleEditAsset = async () => {
    if (!editingAsset || !newAsset.name || !newAsset.type) {
      alert("Asset name and type are required");
      return;
    }
    
    setLoading(true);
    try {
      const tagsArray = newAsset.tags
        ? newAsset.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];
        
      await assetService.updateAsset(editingAsset.id, {
        name: newAsset.name,
        type: newAsset.type,
        description: newAsset.description || undefined,
        category: newAsset.category || undefined,
        tags: tagsArray,
        isPublic: newAsset.isPublic,
        usageStartDate: newAsset.usageStartDate || undefined,
        usageEndDate: newAsset.usageEndDate || undefined,
      });
      
      setEditingAsset(null);
      setShowEditAssetDialog(false);
      await loadFolderContent();
    } catch (error) {
      console.error("Error updating asset:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditFolder = async () => {
    if (!editingFolder || !newFolder.name) {
      alert("Folder name is required");
      return;
    }
    
    setLoading(true);
    try {
      await folderService.updateFolder(editingFolder.id, {
        name: newFolder.name,
        description: newFolder.description,
      });
      
      setEditingFolder(null);
      setShowEditFolderDialog(false);
      await loadFolderContent();
      
      // Update folder path if the edited folder is in the path
      if (folderPath.some(f => f.id === editingFolder.id)) {
        const updatedPath = folderPath.map(f => 
          f.id === editingFolder.id ? {...f, name: newFolder.name, description: newFolder.description} : f
        );
        setFolderPath(updatedPath);
      }
      
      // Update current folder if it's the one being edited
      if (currentFolder && currentFolder.id === editingFolder.id) {
        setCurrentFolder({
          ...currentFolder,
          name: newFolder.name,
          description: newFolder.description,
        });
      }
    } catch (error) {
      console.error("Error updating folder:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete handlers
  const prepareDelete = (id: string, type: string, name: string) => {
    setDeletingItem({ id, type, name });
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    
    setLoading(true);
    try {
      if (deletingItem.type === ItemTypes.FOLDER) {
        await folderService.deleteFolder(deletingItem.id, deleteChildren);
      } else {
        await assetService.deleteAsset(deletingItem.id);
      }
      
      setShowDeleteDialog(false);
      setDeletingItem(null);
      await loadFolderContent();
    } catch (error) {
      console.error(`Error deleting ${deletingItem.type}:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare edit handlers
  const prepareEditAsset = (asset: Asset) => {
    setEditingAsset(asset);
    setNewAsset({
      name: asset.name,
      type: asset.type,
      description: asset.description || "",
      category: asset.category || "",
      tags: asset.tags ? asset.tags.join(", ") : "",
      isPublic: asset.isPublic,
      usageStartDate: asset.usageStartDate || "",
      usageEndDate: asset.usageEndDate || "",
    });
    setShowEditAssetDialog(true);
  };

  const prepareEditFolder = (folder: Folder) => {
    setEditingFolder(folder);
    setNewFolder({
      name: folder.name,
      description: folder.description || "",
    });
    setShowEditFolderDialog(true);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-full overflow-hidden">
        {/* Fixed header section */}
        <div className="w-full p-6 bg-background flex-shrink-0">
          {/* Header with path and actions */}
          <div className="mb-6">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
              <h1 className="text-2xl font-bold">Assets</h1>
              <div className="flex gap-2">
                <Button onClick={() => setShowAddAssetDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Asset
                </Button>
                <Button variant="outline" onClick={() => setShowAddFolderDialog(true)}>
                  <FolderIcon className="mr-2 h-4 w-4" />
                  New Folder
                </Button>
              </div>
            </div>
            
            {/* Folder breadcrumb navigation */}
            <div className="flex items-center gap-1 text-sm mb-4">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 ${!currentFolder ? 'font-medium' : ''}`}
                onClick={navigateToRoot}
              >
                Root
              </Button>
              
              {folderPath.map((folder, index) => (
                <React.Fragment key={folder.id}>
                  <span className="text-muted-foreground">/</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 ${index === folderPath.length - 1 ? 'font-medium' : ''}`}
                    onClick={() => navigateToFolder(folder.id)}
                  >
                    {folder.name}
                  </Button>
                </React.Fragment>
              ))}
            </div>
            
            {/* Back button when in a folder */}
            {currentFolder && (
              <Button variant="outline" size="sm" onClick={navigateUp} className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                Back to {folderPath.length > 1 ? folderPath[folderPath.length - 2].name : "Root"}
              </Button>
            )}
          </div>
        </div>
        
        {/* Scrollable content section */}
        <div className="flex-grow overflow-y-auto p-6 pt-0">
          {/* Root drop area (only show when in a subfolder) */}
          <RootDropArea 
            onDrop={(itemId, itemType) => handleDrop(itemId, itemType)}
            isActive={!!currentFolder}
          />
          
          {/* Content grid with folders and assets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Loading indicators */}
            {loading && Array(3).fill(0).map((_, i) => (
              <div key={`skeleton-${i}`} className="rounded-lg border p-4 animate-pulse">
                <div className="h-7 w-1/2 bg-muted rounded mb-2"></div>
                <div className="h-4 w-3/4 bg-muted rounded mb-3"></div>
                <div className="h-4 w-1/3 bg-muted rounded"></div>
              </div>
            ))}
            
            {/* Empty state */}
            {!loading && folders.length === 0 && assets.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <FolderIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-1">No items here</h3>
                <p className="text-muted-foreground mb-4">
                  {currentFolder 
                    ? `This folder is empty. Add assets or folders to get started.`
                    : `You don't have any assets or folders yet. Create some to get started.`
                  }
                </p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" onClick={() => setShowAddAssetDialog(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    New Asset
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowAddFolderDialog(true)}>
                    <FolderIcon className="h-4 w-4 mr-1" />
                    New Folder
                  </Button>
                </div>
              </div>
            )}
            
            {/* Folders */}
            {!loading && folders.map(folder => (
              <DraggableFolderCard
                key={folder.id}
                folder={folder}
                onNavigate={navigateToFolder}
                onEdit={prepareEditFolder}
                onDelete={(id) => prepareDelete(id, ItemTypes.FOLDER, folder.name)}
                onDrop={(itemId, itemType, targetId) => handleDrop(itemId, itemType, targetId)}
              />
            ))}
            
            {/* Assets */}
            {!loading && assets.map(asset => (
              <DraggableAsset
                key={asset.id}
                asset={asset}
                onEdit={prepareEditAsset}
                onDelete={(id) => prepareDelete(id, ItemTypes.ASSET, asset.name)}
              />
            ))}
          </div>
        </div>
        
        {/* Create Asset Dialog */}
        <Dialog open={showAddAssetDialog} onOpenChange={setShowAddAssetDialog}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create New Asset</DialogTitle>
              <DialogDescription>
                Enter the details of your asset. Name and type are required.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Asset Name*</Label>
                <Input
                  id="name"
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                  placeholder="Enter asset name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Asset Type*</Label>
                <Select
                  value={newAsset.type}
                  onValueChange={(value) => setNewAsset({ ...newAsset, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEFAULT_ASSET_TYPES.map((type) => (
                      <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newAsset.description}
                  onChange={(e) => setNewAsset({ ...newAsset, description: e.target.value })}
                  placeholder="Enter asset description"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newAsset.category}
                  onValueChange={(value) => setNewAsset({ ...newAsset, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEFAULT_CATEGORIES.map((category) => (
                      <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={newAsset.tags}
                  onChange={(e) => setNewAsset({ ...newAsset, tags: e.target.value })}
                  placeholder="design, logo, marketing"
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="isPublic" 
                  checked={newAsset.isPublic}
                  onCheckedChange={(checked) => 
                    setNewAsset({ ...newAsset, isPublic: Boolean(checked) })
                  }
                />
                <Label htmlFor="isPublic">
                  Allow others to use this asset
                </Label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="usageStartDate">Usage Start Date</Label>
                  <Input
                    id="usageStartDate"
                    type="date"
                    value={newAsset.usageStartDate}
                    onChange={(e) => setNewAsset({ ...newAsset, usageStartDate: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="usageEndDate">Usage End Date</Label>
                  <Input
                    id="usageEndDate"
                    type="date"
                    value={newAsset.usageEndDate}
                    onChange={(e) => setNewAsset({ ...newAsset, usageEndDate: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddAssetDialog(false)}>Cancel</Button>
              <Button onClick={handleCreateAsset} disabled={loading}>
                {loading ? "Creating..." : "Create Asset"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Create Folder Dialog */}
        <Dialog open={showAddFolderDialog} onOpenChange={setShowAddFolderDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
              <DialogDescription>Enter a name for your new folder.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="folderName">Folder Name*</Label>
                <Input
                  id="folderName"
                  value={newFolder.name}
                  onChange={(e) => setNewFolder({ ...newFolder, name: e.target.value })}
                  placeholder="Enter folder name"
                  autoFocus
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="folderDescription">Description (optional)</Label>
                <Textarea
                  id="folderDescription"
                  value={newFolder.description}
                  onChange={(e) => setNewFolder({ ...newFolder, description: e.target.value })}
                  placeholder="Enter an optional description"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddFolderDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateFolder} disabled={loading || !newFolder.name.trim()}>
                {loading ? "Creating..." : "Create Folder"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit Asset Dialog */}
        <Dialog open={showEditAssetDialog} onOpenChange={setShowEditAssetDialog}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Edit Asset</DialogTitle>
              <DialogDescription>
                Update the details of your asset.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Same form fields as Create Asset Dialog */}
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Asset Name*</Label>
                <Input
                  id="edit-name"
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                  placeholder="Enter asset name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-type">Asset Type*</Label>
                <Select
                  value={newAsset.type}
                  onValueChange={(value) => setNewAsset({ ...newAsset, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEFAULT_ASSET_TYPES.map((type) => (
                      <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* ... other fields as in create dialog ... */}
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={newAsset.description}
                  onChange={(e) => setNewAsset({ ...newAsset, description: e.target.value })}
                  placeholder="Enter asset description"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={newAsset.category}
                  onValueChange={(value) => setNewAsset({ ...newAsset, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEFAULT_CATEGORIES.map((category) => (
                      <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-tags">Tags (comma separated)</Label>
                <Input
                  id="edit-tags"
                  value={newAsset.tags}
                  onChange={(e) => setNewAsset({ ...newAsset, tags: e.target.value })}
                  placeholder="design, logo, marketing"
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="edit-isPublic" 
                  checked={newAsset.isPublic}
                  onCheckedChange={(checked) => 
                    setNewAsset({ ...newAsset, isPublic: Boolean(checked) })
                  }
                />
                <Label htmlFor="edit-isPublic">
                  Allow others to use this asset
                </Label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-usageStartDate">Usage Start Date</Label>
                  <Input
                    id="edit-usageStartDate"
                    type="date"
                    value={newAsset.usageStartDate}
                    onChange={(e) => setNewAsset({ ...newAsset, usageStartDate: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-usageEndDate">Usage End Date</Label>
                  <Input
                    id="edit-usageEndDate"
                    type="date"
                    value={newAsset.usageEndDate}
                    onChange={(e) => setNewAsset({ ...newAsset, usageEndDate: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditAssetDialog(false)}>Cancel</Button>
              <Button onClick={handleEditAsset} disabled={loading}>
                {loading ? "Updating..." : "Update Asset"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit Folder Dialog */}
        <Dialog open={showEditFolderDialog} onOpenChange={setShowEditFolderDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Folder</DialogTitle>
              <DialogDescription>Update the name or description of this folder.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="editFolderName">Folder Name*</Label>
                <Input
                  id="editFolderName"
                  value={newFolder.name}
                  onChange={(e) => setNewFolder({ ...newFolder, name: e.target.value })}
                  placeholder="Enter folder name"
                  autoFocus
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editFolderDescription">Description (optional)</Label>
                <Textarea
                  id="editFolderDescription"
                  value={newFolder.description}
                  onChange={(e) => setNewFolder({ ...newFolder, description: e.target.value })}
                  placeholder="Enter an optional description"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditFolderDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditFolder} disabled={loading || !newFolder.name.trim()}>
                {loading ? "Updating..." : "Update Folder"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={(open) => {
          setShowDeleteDialog(open);
          if (!open) {
            setDeleteChildren(false); // Reset when dialog closes
          }
        }}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-destructive">
                Delete {deletingItem?.type === ItemTypes.FOLDER ? 'Folder' : 'Asset'}?
              </DialogTitle>
              <DialogDescription>
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p>
                Are you sure you want to delete <strong>{deletingItem?.name}</strong>?
              </p>
              
              {deletingItem?.type === ItemTypes.FOLDER && (
                <div className="mt-4 border rounded-md p-3 bg-muted/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <Checkbox 
                      id="deleteChildren" 
                      checked={deleteChildren}
                      onCheckedChange={(checked) => setDeleteChildren(Boolean(checked))} 
                    />
                    <Label htmlFor="deleteChildren" className="font-medium">Delete all children items</Label>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6">
                    {deleteChildren
                      ? "All assets and subfolders will be permanently deleted."
                      : "Assets and subfolders will be moved to the root folder."}
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                {loading ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DndProvider>
  );
}
