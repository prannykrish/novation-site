"use client";

import * as React from "react";
import { Folder, FolderOpen, Plus, MoreVertical, Edit, Trash2, ChevronRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// Import react-dnd for drag-and-drop functionality
import { useDrag, useDrop } from "react-dnd";

//import { folderService } from "@/lib/database";
import { Folder as FolderType } from "@/types/database";

const ItemType = {
  FOLDER: "folder",
  ASSET: "asset",
};

interface FolderManagerProps {
  onSelectFolder: (folderId: string | null) => void;
  selectedFolderId: string | null;
  onDropAsset?: (asset: unknown) => void;
}

// Format the description text for better readability
const formatDescription = (description: string | null | undefined): string => {
  if (!description) return "No description provided";
  
  // Preserve paragraph breaks
  return description.trim();
};

export default function Page() {
  return <div>WIP</div>;
}


// export function FolderManager({ onSelectFolder, selectedFolderId, onDropAsset }: FolderManagerProps) {
//   const [currentFolderId, setCurrentFolderId] = React.useState<string | null>(selectedFolderId);
//   const [folderPath, setFolderPath] = React.useState<FolderType[]>([]);
//   const [loading, setLoading] = React.useState(false);
//   const [folders, setFolders] = React.useState<FolderType[]>([]);
//   const [assets, setAssets] = React.useState<any[]>([]); // Assuming assets are fetched and stored here
//   const [activeFolder, setActiveFolder] = React.useState<FolderType | null>(null);
//   const [showFolderDetailsDialog, setShowFolderDetailsDialog] = React.useState(false);
//   const [isDragOperation, setIsDragOperation] = React.useState(false);

//   React.useEffect(() => {
//     if (currentFolderId !== selectedFolderId) {
//       setCurrentFolderId(selectedFolderId);
//     }
//   }, [selectedFolderId]);

//   const [showAddFolderDialog, setShowAddFolderDialog] = React.useState(false);
//   const [showEditFolderDialog, setShowEditFolderDialog] = React.useState(false);
//   const [showDeleteFolderDialog, setShowDeleteFolderDialog] = React.useState(false);
//   const [activeFolderId, setActiveFolderId] = React.useState<string | null>(null);

//   const [folderForm, setFolderForm] = React.useState({
//     name: "",
//     description: "",
//   });

//   React.useEffect(() => {
//     loadFolders();
//   }, [currentFolderId]);

//   const loadFolders = async (skipPathUpdate = false) => {
//     setLoading(true);
//     try {
//       const folderData = await folderService.getFolders(currentFolderId);
//       setFolders(folderData);

//       // Only update folder path when explicitly navigating, not during drag operations
//       if (currentFolderId && !skipPathUpdate && !isDragOperation && !folderPath.some(f => f.id === currentFolderId)) {
//         const currentFolder = await folderService.getFolderById(currentFolderId);
//         if (currentFolder) {
//           setFolderPath((prev) => [...prev, currentFolder]);
//         }
//       }
//     } catch (error) {
//       console.error("Error loading folders:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const navigateToFolder = (folder: FolderType) => {
//     setCurrentFolderId(folder.id);
//     onSelectFolder(folder.id);
//   };

//   const showFolderDetails = async (folder: FolderType) => {
//     try {
//       // Fetch the latest folder data to ensure we have the most recent information
//       const folderDetails = await folderService.getFolderById(folder.id);
//       if (folderDetails) {
//         setActiveFolder(folderDetails);
//         setShowFolderDetailsDialog(true);
//       }
//     } catch (error) {
//       console.error("Error fetching folder details:", error);
//     }
//   };

//   const navigateToRoot = () => {
//     setCurrentFolderId(null);
//     setFolderPath([]);
//     onSelectFolder(null);
//   };

//   const navigateToPathFolder = (index: number) => {
//     if (index < 0) {
//       navigateToRoot();
//       return;
//     }

//     const folder = folderPath[index];
//     setCurrentFolderId(folder.id);
//     setFolderPath(folderPath.slice(0, index + 1));
//     onSelectFolder(folder.id);
//   };

//   const handleCreateFolder = async () => {
//     if (!folderForm.name) {
//       alert("Folder name is required");
//       return;
//     }

//     setLoading(true);
//     try {
//       const newFolder = await folderService.createFolder({
//         name: folderForm.name,
//         description: folderForm.description,
//         parentId: currentFolderId || undefined,
//       });

//       setFolderForm({ name: "", description: "" });
//       setShowAddFolderDialog(false);
//       await loadFolders();
//     } catch (error) {
//       console.error("Error creating folder:", error);
//       alert("Failed to create folder. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const prepareEditFolder = (folder: FolderType) => {
//     setActiveFolderId(folder.id);
//     setFolderForm({
//       name: folder.name,
//       description: folder.description || "",
//     });
//     setShowEditFolderDialog(true);
//   };

//   const handleEditFolder = async () => {
//     if (!activeFolderId || !folderForm.name) {
//       return;
//     }

//     setLoading(true);
//     try {
//       await folderService.updateFolder(activeFolderId, {
//         name: folderForm.name,
//         description: folderForm.description,
//       });

//       setFolderForm({ name: "", description: "" });
//       setShowEditFolderDialog(false);
//       setActiveFolderId(null);
//       await loadFolders();
//     } catch (error) {
//       console.error("Error updating folder:", error);
//       alert("Failed to update folder. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const prepareDeleteFolder = (folder: FolderType) => {
//     setActiveFolderId(folder.id);
//     setShowDeleteFolderDialog(true);
//   };

//   const handleDeleteFolder = async () => {
//     if (!activeFolderId) {
//       return;
//     }

//     setLoading(true);
//     try {
//       await folderService.deleteFolder(activeFolderId);

//       setShowDeleteFolderDialog(false);
//       setActiveFolderId(null);
//       await loadFolders();
//     } catch (error) {
//       console.error("Error deleting folder:", error);
//       alert("Failed to delete folder. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const DraggableFolder = ({ folder, onDrop }: { folder: FolderType; onDrop: (draggedFolderId: string, targetFolderId: string) => void }) => {
//     const ref = React.useRef<HTMLDivElement>(null);
//     const [{ isDragging }, drag] = useDrag({
//       type: ItemType.FOLDER,
//       item: { id: folder.id },
//       collect: (monitor) => ({ isDragging: monitor.isDragging() }),
//     });

//     const [{ isOver, canDrop }, drop] = useDrop({
//       accept: [ItemType.FOLDER, ItemType.ASSET],
//       drop: (item: { id: string, type?: string }) => {
//         // Prevent dropping a folder into itself
//         if (item.id !== folder.id) {
//           onDrop(item.id, folder.id);
//           return { droppedInFolder: true };
//         }
//       },
//       canDrop: (item) => item.id !== folder.id, // Prevent circular references
//       collect: (monitor) => ({
//         isOver: monitor.isOver(),
//         canDrop: monitor.canDrop(),
//       }),
//     });

//     drag(drop(ref));
//     return (
//       <div 
//         ref={ref} 
//         className={`flex items-center relative ${
//           isDragging ? "opacity-50" : ""
//         } ${
//           isOver && canDrop ? "bg-primary/10 ring-1 ring-primary" : ""
//         }`}>
//         <Button
//           variant="ghost"
//           className={`justify-start h-auto p-2 flex-1 ${
//             selectedFolderId === folder.id ? "bg-accent" : ""
//           }`}
//           onClick={() => {
//             navigateToFolder(folder);
//           }}
//         >
//           <Folder className="h-4 w-4 mr-2" />
//           <span className="truncate">{folder.name}</span>
//         </Button>
        
//         <Button
//           variant="ghost"
//           size="sm"
//           className="h-8 w-8 p-0 opacity-70 hover:opacity-100"
//           onClick={(e) => {
//             e.stopPropagation();
//             showFolderDetails(folder);
//           }}
//         >
//           <Info className="h-4 w-4" />
//           <span className="sr-only">Folder Details</span>
//         </Button>
        
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button
//               variant="ghost"
//               size="sm"
//               className="h-8 w-8 p-0 opacity-70 hover:opacity-100"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <MoreVertical className="h-4 w-4" />
//               <span className="sr-only">Open menu</span>
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <DropdownMenuItem onClick={() => prepareEditFolder(folder)}>
//               <Edit className="mr-2 h-4 w-4" />
//               Edit Folder
//             </DropdownMenuItem>
//             <DropdownMenuItem
//               className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
//               onClick={() => prepareDeleteFolder(folder)}
//             >
//               <Trash2 className="mr-2 h-4 w-4" />
//               Delete Folder
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
        
//         {/* Visual indicator for drop target */}
//         {isOver && canDrop && (
//           <div className="absolute inset-0 border-2 border-primary border-dashed rounded-lg pointer-events-none" />
//         )}
//       </div>
//     );
//   };

//   // Add this function to handle folder movements without changing navigation
//   const handleFolderMove = async (draggedItemId: string, targetFolderId: string) => {
//     try {
//       setIsDragOperation(true);
      
//       // Check if it's an asset or folder being moved
//       const isAsset = assets.some(asset => asset.id === draggedItemId);
      
//       if (isAsset && onDropAsset) {
//         // Handle asset drop
//         onDropAsset({ id: draggedItemId, targetFolder: targetFolderId });
//       } else {
//         // Handle folder drop (move folder to new parent)
//         await folderService.updateFolder(draggedItemId, { parentId: targetFolderId });
        
//         // Reload the current view only, without changing navigation
//         await loadFolders(true);
//       }
//     } catch (error) {
//       console.error("Error moving item:", error);
//     } finally {
//       // Reset the drag operation flag after a short delay
//       setTimeout(() => {
//         setIsDragOperation(false);
//       }, 100);
//     }
//   };

//   return (
//     <div className="border rounded-md">
//       <div className="p-4 border-b bg-muted/40">
//         <div className="flex items-center justify-between">
//           <h3 className="text-sm font-medium">Folders</h3>
//           <Button size="sm" variant="outline" onClick={() => setShowAddFolderDialog(true)}>
//             <Plus className="h-3.5 w-3.5 mr-1" />
//             New Folder
//           </Button>
//         </div>

//         {folderPath.length > 0 && (
//           <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground overflow-x-auto py-1">
//             <Button variant="link" className="p-0 h-auto text-xs font-normal" onClick={navigateToRoot}>
//               Root
//             </Button>
//             {folderPath.map((folder, index) => (
//               <React.Fragment key={folder.id}>
//                 <ChevronRight className="h-3 w-3" />
//                 <Button
//                   variant="link"
//                   className={`p-0 h-auto text-xs font-normal ${
//                     index === folderPath.length - 1 ? "font-medium text-foreground" : ""
//                   }`}
//                   onClick={() => navigateToPathFolder(index)}
//                 >
//                   {folder.name}
//                 </Button>
//               </React.Fragment>
//             ))}
//           </div>
//         )}
//       </div>

//       <ScrollArea className="h-[200px] p-4">
//         {loading && (
//           <div className="flex items-center justify-center h-full">
//             <p className="text-sm text-muted-foreground">Loading folders...</p>
//           </div>
//         )}

//         {!loading && folders.length === 0 && !currentFolderId && (
//           <div className="flex flex-col items-center justify-center h-full text-center p-4">
//             <FolderOpen className="h-8 w-8 text-muted-foreground mb-2 opacity-50" />
//             <p className="text-sm text-muted-foreground">You don't have any folders yet</p>
//             <Button variant="link" className="text-xs mt-1" onClick={() => setShowAddFolderDialog(true)}>
//               Create a folder
//             </Button>
//           </div>
//         )}

//         {!loading && folders.length === 0 && currentFolderId && (
//           <div className="flex flex-col gap-2">
//             <Button variant="ghost" className="justify-start h-auto p-2" onClick={() => navigateToRoot()}>
//               <FolderOpen className="h-4 w-4 mr-2" />
//               <span className="truncate">Back to All Assets</span>
//             </Button>

//             <div className="flex flex-col items-center justify-center h-32 text-center p-4">
//               <p className="text-sm text-muted-foreground">This folder is empty</p>
//               <Button variant="link" className="text-xs mt-1" onClick={() => setShowAddFolderDialog(true)}>
//                 Create a folder
//               </Button>
//             </div>
//           </div>
//         )}

//         {!loading && (folders.length > 0 || currentFolderId) && (
//           <div className="grid grid-cols-1 gap-2">
//             {currentFolderId && (
//               <>
//                 <Button variant="ghost" className="justify-start h-auto p-2" onClick={() => navigateToRoot()}>
//                   <FolderOpen className="h-4 w-4 mr-2" />
//                   <span className="truncate">Back to All Assets</span>
//                 </Button>

//                 {folders.length > 0 && <Separator className="my-1" />}
//               </>
//             )}

//             {folders.map((folder) => (
//               <DraggableFolder
//                 key={folder.id}
//                 folder={folder}
//                 onDrop={handleFolderMove}
//               />
//             ))}
//           </div>
//         )}
//       </ScrollArea>

//       {/* Folder Details Dialog */}
//       <Dialog open={showFolderDetailsDialog} onOpenChange={setShowFolderDetailsDialog}>
//         <DialogContent className="sm:max-w-[525px]">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2 text-xl">
//               <Folder className="h-5 w-5" />
//               Folder: {activeFolder?.name}
//             </DialogTitle>
//           </DialogHeader>
          
//           <div className="space-y-4 py-4">
//             {/* Description */}
//             <div className="space-y-2">
//               <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
//               <div className="rounded-md border p-3 bg-muted/30">
//                 <p className="text-sm whitespace-pre-wrap leading-relaxed">
//                   {formatDescription(activeFolder?.description)}
//                 </p>
//               </div>
//             </div>
            
//             {/* Folder metadata */}
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <h4 className="text-xs font-medium text-muted-foreground mb-1">Created</h4>
//                 <p className="text-sm">
//                   {activeFolder?.createdAt 
//                     ? new Date(activeFolder.createdAt).toLocaleDateString('en-US', {
//                         year: 'numeric',
//                         month: 'short',
//                         day: 'numeric'
//                       })
//                     : 'Unknown date'}
//                 </p>
//               </div>
//               <div>
//                 <h4 className="text-xs font-medium text-muted-foreground mb-1">Location</h4>
//                 <p className="text-sm">
//                   {currentFolderId ? 'Subfolder' : 'Root level'}
//                 </p>
//               </div>
//             </div>
//           </div>
          
//           <DialogFooter className="gap-2">
//             <Button 
//               variant="outline" 
//               onClick={() => setShowFolderDetailsDialog(false)}
//             >
//               Close
//             </Button>
//             <Button
//               onClick={() => {
//                 setShowFolderDetailsDialog(false);
//                 if (activeFolder) {
//                   prepareEditFolder(activeFolder);
//                 }
//               }}
//             >
//               <Edit className="mr-2 h-4 w-4" />
//               Edit Folder
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={showAddFolderDialog} onOpenChange={setShowAddFolderDialog}>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Create New Folder</DialogTitle>
//             <DialogDescription>Enter a name for your new folder.</DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="grid gap-2">
//               <Label htmlFor="folderName">Folder Name*</Label>
//               <Input
//                 id="folderName"
//                 value={folderForm.name}
//                 onChange={(e) => setFolderForm({ ...folderForm, name: e.target.value })}
//                 placeholder="Enter folder name"
//                 autoFocus
//               />
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="folderDescription">Description (optional)</Label>
//               <Textarea
//                 id="folderDescription"
//                 value={folderForm.description}
//                 onChange={(e) => setFolderForm({ ...folderForm, description: e.target.value })}
//                 placeholder="Enter an optional description"
//                 rows={3}
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowAddFolderDialog(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleCreateFolder} disabled={loading || !folderForm.name.trim()}>
//               {loading ? "Creating..." : "Create Folder"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={showEditFolderDialog} onOpenChange={setShowEditFolderDialog}>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Edit Folder</DialogTitle>
//             <DialogDescription>Update the name or description of this folder.</DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="grid gap-2">
//               <Label htmlFor="editFolderName">Folder Name*</Label>
//               <Input
//                 id="editFolderName"
//                 value={folderForm.name}
//                 onChange={(e) => setFolderForm({ ...folderForm, name: e.target.value })}
//                 placeholder="Enter folder name"
//                 autoFocus
//               />
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="editFolderDescription">Description (optional)</Label>
//               <Textarea
//                 id="editFolderDescription"
//                 value={folderForm.description}
//                 onChange={(e) => setFolderForm({ ...folderForm, description: e.target.value })}
//                 placeholder="Enter an optional description"
//                 rows={3}
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowEditFolderDialog(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleEditFolder} disabled={loading || !folderForm.name.trim()}>
//               {loading ? "Updating..." : "Update Folder"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={showDeleteFolderDialog} onOpenChange={setShowDeleteFolderDialog}>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle className="text-red-600 dark:text-red-400">Delete Folder?</DialogTitle>
//             <DialogDescription>
//               This will delete this folder. Products inside this folder will not be deleted but will be moved to the
//               root.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="py-4">
//             <p className="text-sm">
//               Are you sure you want to delete this folder? This action cannot be undone.
//             </p>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowDeleteFolderDialog(false)}>
//               Cancel
//             </Button>
//             <Button variant="destructive" onClick={handleDeleteFolder} disabled={loading}>
//               {loading ? "Deleting..." : "Delete Folder"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }