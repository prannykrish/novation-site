"use client";

import * as React from "react";
import { Folder, FolderOpen, Plus, MoreVertical, Edit, Trash2, ChevronRight } from "lucide-react";
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

import { folderService } from "@/lib/database";
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

function FolderDrop({ folder, onDrop, children }: { folder: FolderType; onDrop: (folderId: string) => void; children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    accept: 'ASSET',
    drop: (item: { id: string }) => onDrop(folder.id),
  });
  drop(ref);
  return (
    <div ref={ref} className="...">
      {children}
    </div>
  );
}

function DraggableAsset({ asset, onEdit }: { asset: any; onEdit: () => void }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag({
    type: 'ASSET',
    item: { id: asset.id },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });
  drag(ref);
  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }} className="...">
      {/* ... */}
    </div>
  );
}

export function FolderManager({ onSelectFolder, selectedFolderId, onDropAsset }: FolderManagerProps) {
  const [currentFolderId, setCurrentFolderId] = React.useState<string | null>(selectedFolderId);
  const [folderPath, setFolderPath] = React.useState<FolderType[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [folders, setFolders] = React.useState<FolderType[]>([]);
  const [assets, setAssets] = React.useState<any[]>([]); // Assuming assets are fetched and stored here

  React.useEffect(() => {
    if (currentFolderId !== selectedFolderId) {
      setCurrentFolderId(selectedFolderId);
    }
  }, [selectedFolderId]);

  const [showAddFolderDialog, setShowAddFolderDialog] = React.useState(false);
  const [showEditFolderDialog, setShowEditFolderDialog] = React.useState(false);
  const [showDeleteFolderDialog, setShowDeleteFolderDialog] = React.useState(false);
  const [activeFolderId, setActiveFolderId] = React.useState<string | null>(null);

  const [folderForm, setFolderForm] = React.useState({
    name: "",
    description: "",
  });

  React.useEffect(() => {
    loadFolders();
  }, [currentFolderId]);

  const loadFolders = async () => {
    setLoading(true);
    try {
      const folderData = await folderService.getFolders(currentFolderId);
      setFolders(folderData);

      if (currentFolderId) {
        const currentFolder = await folderService.getFolderById(currentFolderId);
        if (currentFolder) {
          if (!folderPath.some((f) => f.id === currentFolder.id)) {
            setFolderPath((prev) => [...prev, currentFolder]);
          }
        }
      } else {
        setFolderPath([]);
      }
    } catch (error) {
      console.error("Error loading folders:", error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToFolder = (folder: FolderType) => {
    setCurrentFolderId(folder.id);
    onSelectFolder(folder.id);
  };

  const navigateToRoot = () => {
    setCurrentFolderId(null);
    setFolderPath([]);
    onSelectFolder(null);
  };

  const navigateToPathFolder = (index: number) => {
    if (index < 0) {
      navigateToRoot();
      return;
    }

    const folder = folderPath[index];
    setCurrentFolderId(folder.id);
    setFolderPath(folderPath.slice(0, index + 1));
    onSelectFolder(folder.id);
  };

  const handleCreateFolder = async () => {
    if (!folderForm.name) {
      alert("Folder name is required");
      return;
    }

    setLoading(true);
    try {
      const newFolder = await folderService.createFolder({
        name: folderForm.name,
        description: folderForm.description,
        parentId: currentFolderId || undefined,
      });

      setFolderForm({ name: "", description: "" });
      setShowAddFolderDialog(false);
      await loadFolders();
    } catch (error) {
      console.error("Error creating folder:", error);
      alert("Failed to create folder. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const prepareEditFolder = (folder: FolderType) => {
    setActiveFolderId(folder.id);
    setFolderForm({
      name: folder.name,
      description: folder.description || "",
    });
    setShowEditFolderDialog(true);
  };

  const handleEditFolder = async () => {
    if (!activeFolderId || !folderForm.name) {
      return;
    }

    setLoading(true);
    try {
      await folderService.updateFolder(activeFolderId, {
        name: folderForm.name,
        description: folderForm.description,
      });

      setFolderForm({ name: "", description: "" });
      setShowEditFolderDialog(false);
      setActiveFolderId(null);
      await loadFolders();
    } catch (error) {
      console.error("Error updating folder:", error);
      alert("Failed to update folder. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const prepareDeleteFolder = (folder: FolderType) => {
    setActiveFolderId(folder.id);
    setShowDeleteFolderDialog(true);
  };

  const handleDeleteFolder = async () => {
    if (!activeFolderId) {
      return;
    }

    setLoading(true);
    try {
      await folderService.deleteFolder(activeFolderId);

      setShowDeleteFolderDialog(false);
      setActiveFolderId(null);
      await loadFolders();
    } catch (error) {
      console.error("Error deleting folder:", error);
      alert("Failed to delete folder. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const DraggableFolder = ({ folder, onDrop }: { folder: FolderType; onDrop: (draggedFolderId: string, targetFolderId: string) => void }) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const [, drag] = useDrag({
      type: ItemType.FOLDER,
      item: { id: folder.id },
    });

    const [, drop] = useDrop({
      accept: ItemType.FOLDER,
      drop: (item: { id: string }) => onDrop(item.id, folder.id),
    });

    drag(drop(ref));
    return (
      <div ref={ref} className="flex items-center">
        <Button
          variant="ghost"
          className={`justify-start h-auto p-2 flex-1 ${
            selectedFolderId === folder.id ? "bg-accent" : ""
          }`}
          onClick={() => {
            navigateToFolder(folder);
          }}
        >
          <Folder className="h-4 w-4 mr-2" />
          <span className="truncate">{folder.name}</span>
        </Button>
      </div>
    );
  };

  return (
    <div className="border rounded-md">
      <div className="p-4 border-b bg-muted/40">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Folders</h3>
          <Button size="sm" variant="outline" onClick={() => setShowAddFolderDialog(true)}>
            <Plus className="h-3.5 w-3.5 mr-1" />
            New Folder
          </Button>
        </div>

        {folderPath.length > 0 && (
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground overflow-x-auto py-1">
            <Button variant="link" className="p-0 h-auto text-xs font-normal" onClick={navigateToRoot}>
              Root
            </Button>
            {folderPath.map((folder, index) => (
              <React.Fragment key={folder.id}>
                <ChevronRight className="h-3 w-3" />
                <Button
                  variant="link"
                  className={`p-0 h-auto text-xs font-normal ${
                    index === folderPath.length - 1 ? "font-medium text-foreground" : ""
                  }`}
                  onClick={() => navigateToPathFolder(index)}
                >
                  {folder.name}
                </Button>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      <ScrollArea className="h-[200px] p-4">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">Loading folders...</p>
          </div>
        )}

        {!loading && folders.length === 0 && !currentFolderId && (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <FolderOpen className="h-8 w-8 text-muted-foreground mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground">You don't have any folders yet</p>
            <Button variant="link" className="text-xs mt-1" onClick={() => setShowAddFolderDialog(true)}>
              Create a folder
            </Button>
          </div>
        )}

        {!loading && folders.length === 0 && currentFolderId && (
          <div className="flex flex-col gap-2">
            <Button variant="ghost" className="justify-start h-auto p-2" onClick={() => navigateToRoot()}>
              <FolderOpen className="h-4 w-4 mr-2" />
              <span className="truncate">Back to All Assets</span>
            </Button>

            <div className="flex flex-col items-center justify-center h-32 text-center p-4">
              <p className="text-sm text-muted-foreground">This folder is empty</p>
              <Button variant="link" className="text-xs mt-1" onClick={() => setShowAddFolderDialog(true)}>
                Create a folder
              </Button>
            </div>
          </div>
        )}

        {!loading && (folders.length > 0 || currentFolderId) && (
          <div className="grid grid-cols-1 gap-2">
            {currentFolderId && (
              <>
                <Button variant="ghost" className="justify-start h-auto p-2" onClick={() => navigateToRoot()}>
                  <FolderOpen className="h-4 w-4 mr-2" />
                  <span className="truncate">Back to All Assets</span>
                </Button>

                {folders.length > 0 && <Separator className="my-1" />}
              </>
            )}

            {folders.map((folder) => (
              <DraggableFolder
                key={folder.id}
                folder={folder}
                onDrop={async (draggedFolderId, targetFolderId) => {
                  try {
                    await folderService.updateFolder(draggedFolderId, { parentId: targetFolderId });
                    await loadFolders();
                  } catch (error) {
                    console.error("Error moving folder:", error);
                  }
                }}
              />
            ))}

            {folders.map((folder) => (
              <FolderDrop key={folder.id} folder={folder} onDrop={(folderId) => onDropAsset && onDropAsset(folderId)}>
              {folder.name}
            </FolderDrop>
            ))}

            {assets.map((asset) => (
              <DraggableAsset key={asset.id} asset={asset} onEdit={() => {}} />
            ))}
          </div>
        )}
      </ScrollArea>

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
                value={folderForm.name}
                onChange={(e) => setFolderForm({ ...folderForm, name: e.target.value })}
                placeholder="Enter folder name"
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="folderDescription">Description (optional)</Label>
              <Textarea
                id="folderDescription"
                value={folderForm.description}
                onChange={(e) => setFolderForm({ ...folderForm, description: e.target.value })}
                placeholder="Enter an optional description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddFolderDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder} disabled={loading || !folderForm.name.trim()}>
              {loading ? "Creating..." : "Create Folder"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                value={folderForm.name}
                onChange={(e) => setFolderForm({ ...folderForm, name: e.target.value })}
                placeholder="Enter folder name"
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editFolderDescription">Description (optional)</Label>
              <Textarea
                id="editFolderDescription"
                value={folderForm.description}
                onChange={(e) => setFolderForm({ ...folderForm, description: e.target.value })}
                placeholder="Enter an optional description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditFolderDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditFolder} disabled={loading || !folderForm.name.trim()}>
              {loading ? "Updating..." : "Update Folder"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteFolderDialog} onOpenChange={setShowDeleteFolderDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-600 dark:text-red-400">Delete Folder?</DialogTitle>
            <DialogDescription>
              This will delete this folder. Products inside this folder will not be deleted but will be moved to the
              root.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm">
              Are you sure you want to delete this folder? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteFolderDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteFolder} disabled={loading}>
              {loading ? "Deleting..." : "Delete Folder"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}