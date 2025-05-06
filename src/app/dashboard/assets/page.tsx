"use client"

import React, { useState, useEffect, useRef } from "react"
import { Folder as FolderIcon, Plus, Edit, Trash2, Maximize2, FileImage, FileText, PresentationIcon, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { assetService, folderService } from "@/lib/database"
import { Asset, Folder, AssetFile } from "@/types/database"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { FilePreview } from "@/components/file-preview"
import { ScrollArea } from "@/components/ui/scroll-area"

/* ----------------------------------------------------------------
  Types
-----------------------------------------------------------------*/
interface AssetWithMeta extends Asset {
  /** local flag that opens the expand dialog instead of edit */
  _expandView?: boolean
}

interface DragItem {
  id: string
  kind: typeof ItemTypes.ASSET | typeof ItemTypes.FOLDER
}

/* ----------------------------------------------------------------
  Constants & helpers
-----------------------------------------------------------------*/
const ItemTypes = { ASSET: "asset", FOLDER: "folder" } as const

const DEFAULT_ASSET_TYPES = [
  { id: "document", name: "Document" },
  { id: "image", name: "Image" },
  { id: "presentation", name: "Presentation" },
  { id: "spreadsheet", name: "Spreadsheet" },
  { id: "other", name: "Other" },
]

const DEFAULT_CATEGORIES = [
  { id: "body-care", name: "Body Care" },
  { id: "mens-grooming", name: "Men's Grooming" },
]

const getAssetIcon = (type?: string) => {
  switch (type?.toLowerCase()) {
    case "image":
      return <FileImage className="h-4 w-4" />
    case "presentation":
      return <PresentationIcon className="h-4 w-4" />
    case "document":
    default:
      return <FileText className="h-4 w-4" />
  }
}

const truncateText = (txt?: string, len = 40) => (txt && txt.length > len ? `${txt.slice(0, len - 1)}…` : txt || "")

/* ----------------------------------------------------------------
  Draggable Asset Card
-----------------------------------------------------------------*/
function DraggableAsset({
  asset,
  onEdit,
  onDelete,
  onPreviewFile,
  onExpand,
}: {
  asset: AssetWithMeta
  onEdit: (a: AssetWithMeta) => void
  onDelete: (id: string) => void
  onPreviewFile: (file: AssetFile) => void
  onExpand: (a: AssetWithMeta) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.ASSET,
    item: { id: asset.id, kind: ItemTypes.ASSET } satisfies DragItem,
    collect: (m) => ({ isDragging: m.isDragging() }),
  }))
  drag(ref)

  return (
    <div
      ref={ref}
      className={`rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md ${isDragging ? "opacity-50 ring-2 ring-primary" : ""}`}
      style={{ touchAction: "none" }}
    >
      {/* Header Section - Type Icon, Title, and Menu */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-2 max-w-[85%]">
          <span className="h-6 w-6 rounded bg-muted flex items-center justify-center shrink-0">{getAssetIcon(asset.type)}</span>
          <div className="min-w-0">
            <h3 className="font-medium text-base line-clamp-1" title={asset.name}>
              {asset.name}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-1 capitalize" title={asset.type}>
              {asset.type}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(asset)}>
              <Edit className="mr-2 h-4 w-4" />Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(asset.id)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Description Section */}
      {asset.description && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2" title={asset.description}>
          {asset.description}
        </p>
      )}
      
      {/* Metadata Section */}
      <div className="space-y-2">
        {/* Category */}
        {asset.category && (
          <div className="text-xs flex items-center">
            <span className="text-muted-foreground min-w-[70px]">Category:</span>
            <span className="truncate font-medium" title={asset.category}>
              {asset.category.replace(/-/g, ' ')}
            </span>
          </div>
        )}
        
        {/* Tags */}
        {!!asset.tags?.length && (
          <div className="mt-2">
            <div className="text-xs text-muted-foreground mb-1">Tags:</div>
            <div className="flex flex-wrap gap-1 max-h-[40px] overflow-hidden">
              {asset.tags.slice(0, 3).map((t, i) => (
                <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded truncate max-w-[100px]" title={t}>
                  {t}
                </span>
              ))}
              {asset.tags.length > 3 && <span className="text-xs bg-muted px-2 py-0.5 rounded">+{asset.tags.length - 3}</span>}
            </div>
          </div>
        )}
        
        {/* Files section */}
        {((asset.files && asset.files.length > 0) || asset.fileUrl) && (
          <div className="mt-2 pt-2 border-t border-border">
            <div className="text-xs text-muted-foreground mb-1">Files:</div>
            <div className="space-y-1">
              {/* Show legacy fileUrl if present */}
              {asset.fileUrl && (
                <div className="text-xs flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1">
                    <FileText className="h-3 w-3 text-muted-foreground" />
                    <a 
                      href={asset.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="truncate text-primary hover:underline"
                      title="View file"
                    >
                      Attached file
                    </a>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 rounded-full hover:bg-muted" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onPreviewFile({url: asset.fileUrl!, name: "Attached file", type: "", size: 0});
                    }}
                  >
                    <Eye className="h-3 w-3" />
                    <span className="sr-only">Preview</span>
                  </Button>
                </div>
              )}
              
              {/* Show multi-file attachments */}
              {asset.files?.map((file, index) => (
                <div key={index} className="text-xs flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1 min-w-0">
                    <FileText className="h-3 w-3 shrink-0 text-muted-foreground" />
                    <a 
                      href={file.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="truncate text-primary hover:underline"
                      title={file.name || "View file"}
                    >
                      {truncateText(file.name || `File ${index + 1}`, 25)}
                    </a>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 rounded-full hover:bg-muted" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onPreviewFile(file);
                    }}
                  >
                    <Eye className="h-3 w-3" />
                    <span className="sr-only">Preview</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Footer with visibility badge and expand button */}
        <div className="flex justify-between items-center text-xs pt-2 mt-2 border-t border-border">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            asset.isPublic 
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
              : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
          }`}>
            {asset.isPublic ? "Public" : "Private"}
          </span>
          
          <Button variant="ghost" size="sm" className="h-7 p-0 px-2" onClick={() => onExpand(asset)}>
            <Maximize2 className="h-3.5 w-3.5 mr-1" />
            <span>Expand</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------
  Draggable Folder Card
-----------------------------------------------------------------*/
function DraggableFolderCard({
  folder,
  onNavigate,
  onEdit,
  onDelete,
  onDrop,
  onExpand,
}: {
  folder: Folder
  onNavigate: (id: string) => void
  onEdit: (f: Folder) => void
  onDelete: (id: string) => void
  onDrop: (itemId: string, itemType: string, targetId: string) => void
  onExpand: (f: Folder) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.FOLDER,
    item: { id: folder.id, kind: ItemTypes.FOLDER } satisfies DragItem,
    collect: (m) => ({ isDragging: m.isDragging() }),
  }))

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: [ItemTypes.ASSET, ItemTypes.FOLDER],
    drop: (item: DragItem) => {
      if (item.id !== folder.id) {
        // Prevent circular references (folder can't be dropped into itself)
        onDrop(item.id, item.kind, folder.id);
        return { droppedInFolder: true };
      }
    },
    canDrop: (item: DragItem) => item.id !== folder.id,
    collect: (m) => ({ isOver: m.isOver(), canDrop: m.canDrop() }),
    hover: (item, monitor) => {
      if (monitor.isOver({ shallow: true })) {
        setIsDragOver(true);
      }
    }
  }))
  
  // Reset drag over state when not hovering
  useEffect(() => {
    if (!isOver) {
      setIsDragOver(false);
    }
  }, [isOver]);

  drag(drop(ref))

  return (
    <div
      ref={ref}
      className={`rounded-lg border bg-card p-4 cursor-pointer transition-all relative
        ${isDragging ? "opacity-50 ring-2 ring-primary" : ""} 
        ${isOver && canDrop ? "ring-2 ring-primary/60 bg-primary/10" : ""} 
        ${hover ? "shadow-md bg-muted/30" : "shadow-sm"}`}
      onClick={() => onNavigate(folder.id)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ touchAction: "none" }}
    >
      {/* Header Section - Folder Icon, Title, and Menu */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <FolderIcon className="h-7 w-7 text-primary shrink-0" />
          <div className="min-w-0">
            <h3 className="font-medium text-base line-clamp-1" title={folder.name}>
              {folder.name}
            </h3>
            {folder.description && (
              <p className="text-xs text-muted-foreground line-clamp-2" title={folder.description}>
                {folder.description}
              </p>
            )}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation(); // Stop event propagation
              onEdit(folder);
            }}>
              <Edit className="mr-2 h-4 w-4" />Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation(); // Stop event propagation
              onDelete(folder.id);
            }} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Status indicator for droppable area */}
      {isOver && canDrop && (
        <div className="mt-2 py-2 px-3 bg-primary/10 text-xs rounded border border-primary/30 text-center">
          Drop here to move item
        </div>
      )}
      
      {/* Footer with expand button */}
      <div className="flex justify-end items-center text-xs pt-2 mt-2 border-t border-border">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 p-0 px-2" 
          onClick={(e) => { 
            e.stopPropagation(); 
            onExpand(folder);
          }}
        >
          <Maximize2 className="h-3.5 w-3.5 mr-1" />
          <span>Expand</span>
        </Button>
      </div>
      
      {/* Visual indicator for dropTarget */}
      {isOver && canDrop && (
        <div className="absolute inset-0 border-2 border-primary border-dashed rounded-lg pointer-events-none" />
      )}
    </div>
  )
}

/* ----------------------------------------------------------------
  Root Drop Area
-----------------------------------------------------------------*/
function RootDropArea({ onDrop, isActive }: { onDrop: (id: string, tp: string) => void; isActive: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: [ItemTypes.ASSET, ItemTypes.FOLDER],
    drop: (item: DragItem) => {
      onDrop(item.id, item.kind);
      return { droppedInRoot: true }; // Return a value to stop propagation
    },
    collect: (m) => ({ 
      isOver: m.isOver(), 
      canDrop: m.canDrop() 
    }),
  }))
  
  if (!isActive) return null
  
  drop(ref)
  
  return (
    <div
      ref={ref}
      className={`mb-6 mt-4 p-6 border-2 border-dashed rounded-lg flex items-center justify-center transition-all
        ${isOver && canDrop 
          ? "border-primary bg-primary/10 shadow-lg" 
          : "border-muted-foreground/20 hover:border-primary/40 hover:bg-muted/10"}`}
      style={{ touchAction: "none" }}
    >
      <p className="text-muted-foreground text-sm flex items-center">
        {isOver && canDrop 
          ? <><FolderIcon className="mr-2 h-4 w-4 text-primary" /> Drop here to move to root folder</>
          : <><FolderIcon className="mr-2 h-4 w-4" /> Drag items here to move to root folder</>}
      </p>
    </div>
  )
}

/* ----------------------------------------------------------------
  Main Component
-----------------------------------------------------------------*/
export default function AssetsPage() {
  // State for folders and assets
  const [loading, setLoading] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [assets, setAssets] = useState<AssetWithMeta[]>([]);
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [folderPath, setFolderPath] = useState<Folder[]>([]);
  
  // Dialog states
  const [showAddAssetDialog, setShowAddAssetDialog] = useState(false);
  const [showAddFolderDialog, setShowAddFolderDialog] = useState(false);
  const [showEditAssetDialog, setShowEditAssetDialog] = useState(false);
  const [showEditFolderDialog, setShowEditFolderDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showExpandDialog, setShowExpandDialog] = useState(false);
  
  // Currently editing items
  const [currentEditingFolder, setCurrentEditingFolder] = useState<Folder | null>(null);
  const [currentEditingAsset, setCurrentEditingAsset] = useState<AssetWithMeta | null>(null);
  const [expandedAsset, setExpandedAsset] = useState<AssetWithMeta | null>(null);
  const [expandedFolder, setExpandedFolder] = useState<Folder | null>(null);
  const [fileUploading, setFileUploading] = useState(false);
  
  // Root drop area state
  const [showRootDrop, setShowRootDrop] = useState(false);

  // File preview state
  const [previewFile, setPreviewFile] = useState<AssetFile | null>(null);
  const [showFilePreview, setShowFilePreview] = useState(false);
  
  // File upload states
  const [uploadedFiles, setUploadedFiles] = useState<AssetFile[]>([]);
  const [editUploadedFiles, setEditUploadedFiles] = useState<AssetFile[]>([]); 
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  
  // Delete dialog state
  const [deleteChildren, setDeleteChildren] = useState(false);
  const [deletingItem, setDeletingItem] = useState<{ id: string; name: string; type: string } | null>(null);
  
  // Form states for new and edited assets/folders
  const [newAsset, setNewAsset] = useState({
    name: "",
    type: "document",
    description: "",
    category: "",
    tags: "",
    isPublic: true,
    usageStartDate: "",
    usageEndDate: "",
    fileUrl: ""
  });
  
  const [newFolder, setNewFolder] = useState({
    name: "",
    description: ""
  });

  const prepareEditFolder = (folder: Folder) => {
    setCurrentEditingFolder(folder);
    setNewFolder({
      name: folder.name,
      description: folder.description || ""
    });
    setShowEditFolderDialog(true);
  };

  // Navigation functions
  const navigateToRoot = () => {
    setCurrentFolder(null);
    setFolderPath([]);
    loadItems(null);
  };

  const navigateToFolder = (folderId: string) => {
    // Get the folder object from our state
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return;
    
    // Set as current folder and load its contents
    setCurrentFolder(folder);
    loadItems(folderId);
    
    // If it's already in our path, we're navigating backwards
    const existingIndex = folderPath.findIndex(f => f.id === folderId);
    if (existingIndex >= 0) {
      setFolderPath(folderPath.slice(0, existingIndex + 1));
    } else {
      // Otherwise add it to our path
      setFolderPath([...folderPath, folder]);
    }
  };

  const navigateUp = () => {
    if (folderPath.length <= 1) {
      navigateToRoot();
    } else {
      const parentFolder = folderPath[folderPath.length - 2];
      navigateToFolder(parentFolder.id);
    }
  };

  // File upload functions
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setFileUploading(true);
    
    try {
      const uploadedFilesArray: AssetFile[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadedFile = await assetService.uploadFile(file);
        uploadedFilesArray.push(uploadedFile);
      }
      
      setUploadedFiles([...uploadedFiles, ...uploadedFilesArray]);
    } catch (error) {
      console.error("Error uploading files:", error);
      // You could add a toast notification here
    } finally {
      setFileUploading(false);
      
      // Reset the input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleEditFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setFileUploading(true);
    
    try {
      const uploadedFilesArray: AssetFile[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadedFile = await assetService.uploadFile(file);
        uploadedFilesArray.push(uploadedFile);
      }
      
      setEditUploadedFiles([...editUploadedFiles, ...uploadedFilesArray]);
    } catch (error) {
      console.error("Error uploading files:", error);
      // You could add a toast notification here
    } finally {
      setFileUploading(false);
      
      // Reset the input so the same file can be selected again if needed
      if (editFileInputRef.current) {
        editFileInputRef.current.value = '';
      }
    }
  };
  
  const handleRemoveFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
  };
  
  const handleRemoveEditFile = (index: number) => {
    const newFiles = [...editUploadedFiles];
    newFiles.splice(index, 1);
    setEditUploadedFiles(newFiles);
  };

  // Load items function
  const loadItems = async (folderId: string | null) => {
    setLoading(true);
    try {
      // Load assets for the current folder - only show the current user's assets
      const assetsData = await assetService.getAssets({ 
        folderId: folderId ?? undefined,
        currentUserOnly: true // Only show assets owned by the current user
      });
      setAssets(assetsData || []);
      
      // Load folders for the current folder
      const foldersData = await folderService.getFolders(folderId);
      setFolders(foldersData || []);
      
      // If we're in a subfolder, load the folder path
      if (folderId) {
        await loadFolderPath(folderId);
      }
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Load folder path (breadcrumb navigation)
  const loadFolderPath = async (folderId: string) => {
    try {
      const path: Folder[] = [];
      let currentId = folderId;
      
      while (currentId) {
        const folder = await folderService.getFolderById(currentId);
        if (!folder) break;
        
        path.unshift(folder);
        if (!folder.parentId) break;
        currentId = folder.parentId;
      }
      
      setFolderPath(path);
      if (path.length > 0) {
        setCurrentFolder(path[path.length - 1]);
      }
    } catch (error) {
      console.error('Error loading folder path:', error);
    }
  };

  // Handle asset/folder operations
  const prepareCreateAsset = () => {
    setNewAsset({
      name: "",
      type: "document",
      description: "",
      category: "",
      tags: "",
      isPublic: true,
      usageStartDate: "",
      usageEndDate: "",
      fileUrl: ""
    });
    setUploadedFiles([]);
    setShowAddAssetDialog(true);
  };
  
  const handleCreateAsset = async () => {
    if (!newAsset.name || !newAsset.type) return;
    
    setLoading(true);
    try {
      // Process tags if provided
      const tags = newAsset.tags ? newAsset.tags.split(',').map(t => t.trim()) : [];
      
      await assetService.createAsset({
        name: newAsset.name,
        type: newAsset.type,
        description: newAsset.description,
        category: newAsset.category,
        tags,
        isPublic: newAsset.isPublic,
        usageStartDate: newAsset.usageStartDate,
        usageEndDate: newAsset.usageEndDate,
        fileUrl: newAsset.fileUrl,
        files: uploadedFiles,
        folderId: currentFolder?.id || undefined
      });
      
      setShowAddAssetDialog(false);
      loadItems(currentFolder?.id || null);
    } catch (error) {
      console.error('Error creating asset:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const prepareCreateFolder = () => {
    setNewFolder({
      name: "",
      description: ""
    });
    setShowAddFolderDialog(true);
  };
  
  const handleCreateFolder = async () => {
    if (!newFolder.name) return;
    
    setLoading(true);
    try {
      await folderService.createFolder({
        name: newFolder.name,
        description: newFolder.description,
        parentId: currentFolder?.id || undefined
      });
      
      setShowAddFolderDialog(false);
      loadItems(currentFolder?.id || null);
    } catch (error) {
      console.error('Error creating folder:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const prepareEditAsset = async (asset: AssetWithMeta) => {
    // If the _expandView flag is set, show the expand dialog instead of edit
    if (asset._expandView) {
      setExpandedAsset(asset);
      setShowExpandDialog(true);
      return;
    }
    
    // Otherwise, show the edit dialog
    setNewAsset({
      name: asset.name,
      type: asset.type,
      description: asset.description || "",
      category: asset.category || "",
      tags: asset.tags ? asset.tags.join(', ') : "",
      isPublic: asset.isPublic,
      usageStartDate: asset.usageStartDate || "",
      usageEndDate: asset.usageEndDate || "",
      fileUrl: asset.fileUrl || ""
    });
    
    // Set the uploaded files for editing
    setEditUploadedFiles(asset.files || []);
    setCurrentEditingAsset(asset);
    setShowEditAssetDialog(true);
  };
  
  const handleEditAsset = async () => {
    if (!newAsset.name || !newAsset.type) return;
    
    setLoading(true);
    try {
      // Process tags if provided
      const tags = newAsset.tags ? newAsset.tags.split(',').map(t => t.trim()) : [];
      
      // Get current asset from expanded view
      const assetId = currentEditingAsset?.id;
      
      if (!assetId) {
        console.error('Cannot update asset: No asset ID found');
        return;
      }
      
      // Update the asset with the new values
      await assetService.updateAsset(assetId, {
        name: newAsset.name,
        type: newAsset.type,
        description: newAsset.description,
        category: newAsset.category,
        tags,
        isPublic: newAsset.isPublic,
        usageStartDate: newAsset.usageStartDate,
        usageEndDate: newAsset.usageEndDate,
        fileUrl: newAsset.fileUrl,
        files: editUploadedFiles
      });
      
      // Update local state to reflect changes
      setAssets(assets.map(asset => 
        asset.id === assetId 
          ? { 
              ...asset, 
              name: newAsset.name,
              type: newAsset.type,
              description: newAsset.description,
              category: newAsset.category,
              tags,
              isPublic: newAsset.isPublic,
              usageStartDate: newAsset.usageStartDate,
              usageEndDate: newAsset.usageEndDate,
              fileUrl: newAsset.fileUrl,
              files: editUploadedFiles
            }
          : asset
      ));
      
      setShowEditAssetDialog(false);
      setCurrentEditingAsset(null);
    } catch (error) {
      console.error('Error updating asset:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditFolder = async () => {
    if (!newFolder.name) return;
    
    setLoading(true);
    try {
      // Implement folder edit logic
      if (currentEditingFolder) {
        await folderService.updateFolder(currentEditingFolder.id, {
          name: newFolder.name,
          description: newFolder.description
        });
        
        // Update local state to reflect changes
        const updatedFolders = folders.map(folder => 
          folder.id === currentEditingFolder.id 
            ? { ...folder, name: newFolder.name, description: newFolder.description }
            : folder
        );
        setFolders(updatedFolders);
        
        // Close dialog and clear form
        setShowEditFolderDialog(false);
        setCurrentEditingFolder(null);
      }
    } catch (error) {
      console.error('Error updating folder:', error);
    } finally {
      setLoading(false);
    }
  };
  
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
      loadItems(currentFolder?.id || null);
    } catch (error) {
      console.error(`Error deleting ${deletingItem.type}:`, error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDrop = async (itemId: string, itemType: string, targetId?: string) => {
    setLoading(true);
    
    try {
      // First perform the backend operation
      if (itemType === ItemTypes.ASSET) {
        await assetService.moveAssetToFolder(itemId, targetId || null);
      } else if (itemType === ItemTypes.FOLDER) {
        await folderService.updateFolder(itemId, { parentId: targetId || undefined });
      }
      
      // After successful backend operation, reload the current folder contents
      // This ensures UI is in sync with the database
      await loadItems(currentFolder?.id || null);
      
    } catch (error) {
      console.error(`Error moving ${itemType}:`, error);
      // Show an error message to the user
      alert(`Failed to move ${itemType}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Add dedicated function for expanding assets
  const handleExpandAsset = async (asset: AssetWithMeta) => {
    try {
      setLoading(true);
      // Clear any expanded folder to avoid mixed content display
      setExpandedFolder(null);
      
      // Fetch the latest data for this asset to ensure we have the most up-to-date information
      const freshAsset = await assetService.getAssetById(asset.id);
      if (freshAsset) {
        setExpandedAsset(freshAsset as AssetWithMeta);
        setShowExpandDialog(true);
      } else {
        // Fallback to the current asset data if fetch fails
        setExpandedAsset(asset);
        setShowExpandDialog(true);
        console.warn('Could not fetch fresh asset data, using existing data');
      }
    } catch (error) {
      console.error('Error fetching asset data for expand view:', error);
      // Still open dialog with existing data as fallback
      setExpandedAsset(asset);
      setShowExpandDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const handleExpandFolder = (folder: Folder) => {
    // Clear any expanded asset to avoid mixed content display
    setExpandedAsset(null);
    setExpandedFolder(folder);
    setShowExpandDialog(true);
  };

  // Handle file preview
  const handlePreviewFile = (file: AssetFile) => {
    setPreviewFile(file);
    setShowFilePreview(true);
  };

  // In expanded asset dialog, add preview capability for files
  const handlePreviewFileFromExpanded = (file: AssetFile) => {
    // Close the expanded view, then show the file preview
    setShowExpandDialog(false);
    // Small timeout to allow the dialog to close smoothly
    setTimeout(() => {
      setPreviewFile(file);
      setShowFilePreview(true);
    }, 100);
  };
  
  // Load items on component mount
  useEffect(() => {
    loadItems(null);
  }, []);

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
            <div className="flex items-center gap-1 text-sm mb-4 flex-wrap">
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
                onExpand={handleExpandFolder}
              />
            ))}
            
            {/* Assets */}
            {!loading && assets.map(asset => (
              <DraggableAsset
                key={asset.id}
                asset={asset}
                onEdit={prepareEditAsset}
                onDelete={(id) => prepareDelete(id, ItemTypes.ASSET, asset.name)}
                onPreviewFile={handlePreviewFile}
                onExpand={handleExpandAsset}
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
              <div className="grid gap-2">
                <Label htmlFor="fileUpload">Upload Files</Label>
                <input
                  id="fileUpload"
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={fileUploading}
                >
                  {fileUploading ? "Uploading..." : "Choose Files"}
                </Button>
                <div className="mt-2 space-y-1">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="text-sm flex items-center justify-between">
                      <span>{file.name}</span>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveFile(index)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
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
          <DialogContent className="sm:max-w-[525px] flex flex-col max-h-[85vh]">
            <DialogHeader>
              <DialogTitle>Edit Asset</DialogTitle>
              <DialogDescription>
                Update the details of your asset.
              </DialogDescription>
            </DialogHeader>
            <div className="flex-grow overflow-y-auto pr-1">
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
                <div className="grid gap-2">
                  <Label htmlFor="edit-fileUpload">Upload Files</Label>
                  <input
                    id="edit-fileUpload"
                    type="file"
                    multiple
                    ref={editFileInputRef}
                    onChange={handleEditFileUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => editFileInputRef.current?.click()}
                    disabled={fileUploading}
                  >
                    {fileUploading ? "Uploading..." : "Choose Files"}
                  </Button>
                  <div className="mt-2 space-y-1">
                    {editUploadedFiles.map((file, index) => (
                      <div key={index} className="text-sm flex items-center justify-between">
                        <span>{file.name}</span>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveEditFile(index)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t mt-4 pt-4 flex justify-end gap-2 sticky bottom-0 bg-background">
              <Button variant="outline" onClick={() => setShowEditAssetDialog(false)}>Cancel</Button>
              <Button 
                onClick={handleEditAsset} 
                disabled={loading || !newAsset.name.trim()} 
                className="bg-primary hover:bg-primary/90"
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
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

        {/* Expand Folder/Asset Dialog */}
        <Dialog open={showExpandDialog} onOpenChange={setShowExpandDialog}>
          <DialogContent className="sm:max-w-[550px] max-h-[80vh] p-0 overflow-hidden">
            <DialogHeader className="px-6 pt-6 pb-2">
              <DialogTitle className="truncate">
                {expandedFolder ? 'Folder: ' : 'Asset: '}
                {truncateText(expandedFolder?.name || expandedAsset?.name, 40)}
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[calc(80vh-8rem)] px-6">
              <div className="py-4 space-y-4">
                {/* Folder details */}
                {expandedFolder && (
                  <>
                    {expandedFolder.description && (
                      <>
                        <h3 className="font-medium">Description</h3>
                        <p className="whitespace-pre-wrap break-words">{expandedFolder.description}</p>
                      </>
                    )}
                  </>
                )}

                {/* Asset details */}
                {expandedAsset && (
                  <>
                    {expandedAsset.description && (
                      <>
                        <h3 className="font-medium">Description</h3>
                        <p className="whitespace-pre-wrap break-words">{expandedAsset.description}</p>
                      </>
                    )}
                    {expandedAsset.category && (
                      <div>
                        <h3 className="font-medium">Category</h3>
                        <p>{expandedAsset.category}</p>
                      </div>
                    )}
                    {expandedAsset.tags && expandedAsset.tags.length > 0 && (
                      <div>
                        <h3 className="font-medium">Tags</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {expandedAsset.tags.map((tag, i) => (
                            <span key={i} className="bg-muted px-2 py-1 text-sm rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium">Type</h3>
                        <p className="text-muted-foreground capitalize">{expandedAsset.type}</p>
                      </div>
                      <div>
                        <h3 className="font-medium">Visibility</h3>
                        <p className={expandedAsset.isPublic ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}>
                          {expandedAsset.isPublic ? "Public" : "Private"}
                        </p>
                      </div>
                    </div>
                    
                    {/* Usage dates section */}
                    {(expandedAsset.usageStartDate || expandedAsset.usageEndDate) && (
                      <div className="grid grid-cols-2 gap-4">
                        {expandedAsset.usageStartDate && (
                          <div>
                            <h3 className="font-medium">Usage Start Date</h3>
                            <p className="text-muted-foreground">
                              {new Date(expandedAsset.usageStartDate).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                        {expandedAsset.usageEndDate && (
                          <div>
                            <h3 className="font-medium">Usage End Date</h3>
                            <p className="text-muted-foreground">
                              {new Date(expandedAsset.usageEndDate).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* File attachments */}
                    {(expandedAsset.fileUrl || (expandedAsset.files && expandedAsset.files.length > 0)) && (
                      <div>
                        <h3 className="font-medium">Files</h3>
                        <div className="space-y-2 mt-2">
                          {/* Legacy file URL */}
                          {expandedAsset.fileUrl && (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <a 
                                  href={expandedAsset.fileUrl} 
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  Attached file
                                </a>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePreviewFileFromExpanded({
                                  url: expandedAsset.fileUrl!, 
                                  name: "Attached file", 
                                  type: "", 
                                  size: 0
                                })}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                              </Button>
                            </div>
                          )}

                          {/* Multiple files */}
                          {expandedAsset.files && expandedAsset.files.length > 0 ? (
                            expandedAsset.files.map((file, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  <a 
                                    href={file.url} 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                  >
                                    {file.name || `File ${index + 1}`}
                                  </a>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handlePreviewFileFromExpanded(file)}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Preview
                                </Button>
                              </div>
                            ))
                          ) : !expandedAsset.fileUrl && (
                            <p className="text-muted-foreground">No files attached</p>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </ScrollArea>
            <DialogFooter className="px-6 py-4 border-t">
              <Button onClick={() => {
                setShowExpandDialog(false);
                setExpandedFolder(null);
                setExpandedAsset(null);
              }}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* File Preview Dialog */}
        <FilePreview
          file={previewFile}
          isOpen={showFilePreview}
          onClose={() => {
            setShowFilePreview(false);
            setPreviewFile(null);
          }}
        />
      </div>
    </DndProvider>
  );
}
