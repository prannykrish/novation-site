"use client"

import { useState, useEffect } from "react"
import { FileText, Image, FileSpreadsheet, FileCode, AlertCircle, Eye, Download, ExternalLink, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { AssetFile, MessageAttachment } from "@/types/database"

interface FilePreviewProps {
  file: AssetFile | MessageAttachment | null
  isOpen: boolean
  onClose: () => void
}

export function FilePreview({ file, isOpen, onClose }: FilePreviewProps) {
  const [previewType, setPreviewType] = useState<"preview" | "info">("preview")
  const [loading, setLoading] = useState(true)
  const [previewError, setPreviewError] = useState(false)
  
  // Reset state when file changes
  useEffect(() => {
    if (isOpen && file) {
      setLoading(true)
      setPreviewError(false)
      setPreviewType("preview")
    }
  }, [file, isOpen])

  const fileType = getFileType(file?.name || "")
  const isPreviewable = canPreviewFile(fileType)

  function getFileType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase() || ""
    
    const fileTypes: Record<string, string[]> = {
      image: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'],
      pdf: ['pdf'],
      text: ['txt', 'md', 'csv', 'json', 'xml', 'html', 'css', 'js', 'ts'],
      spreadsheet: ['xls', 'xlsx', 'csv'],
      document: ['doc', 'docx'],
      presentation: ['ppt', 'pptx'],
      video: ['mp4', 'webm', 'ogg'],
      audio: ['mp3', 'wav', 'ogg']
    }
    
    for (const [type, extensions] of Object.entries(fileTypes)) {
      if (extensions.includes(extension)) {
        return type
      }
    }
    
    return "unknown"
  }

  function canPreviewFile(type: string): boolean {
    // List of file types that can be previewed in the browser
    const previewableTypes = ["image", "pdf", "video", "audio", "text"]
    return previewableTypes.includes(type)
  }

  function getFileIcon() {
    switch (fileType) {
      case "image":
        return <Image className="h-5 w-5" />
      case "pdf":
        return <FileText className="h-5 w-5" />
      case "text":
        return <FileCode className="h-5 w-5" />
      case "spreadsheet":
        return <FileSpreadsheet className="h-5 w-5" />
      case "document":
        return <FileText className="h-5 w-5" />
      case "presentation":
        return <FileText className="h-5 w-5" />
      case "video":
        return <FileText className="h-5 w-5" />
      case "audio":
        return <FileText className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  function renderFilePreview() {
    if (!file) return null
    if (!isPreviewable || previewError) {
      return (
        <div className="flex flex-col items-center justify-center h-[400px] bg-muted/30 rounded-md">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Preview not available</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {previewError 
              ? "There was an error loading the preview" 
              : "This file type cannot be previewed"}
          </p>
          <Button asChild variant="outline">
            <a href={file.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Open file in new tab
            </a>
          </Button>
        </div>
      )
    }

    switch (fileType) {
      case "image":
        return (
          <div className="flex items-center justify-center bg-muted/20 rounded-md p-4 h-[400px] overflow-hidden">
            {loading && <Skeleton className="h-full w-full" />}
            <img
              src={file.url}
              alt={file.name || "Image preview"}
              className="max-h-full max-w-full object-contain"
              onLoad={() => setLoading(false)}
              onError={() => {
                setLoading(false)
                setPreviewError(true)
              }}
              style={{ display: loading ? 'none' : 'block' }}
            />
          </div>
        )
      case "pdf":
        return (
          <div className="h-[400px] rounded-md border overflow-hidden">
            {loading && <Skeleton className="h-full w-full" />}
            <iframe
              src={`${file.url}#toolbar=0&navpanes=0`}
              title={file.name || "PDF preview"}
              className="w-full h-full"
              onLoad={() => setLoading(false)}
              onError={() => {
                setLoading(false)
                setPreviewError(true)
              }}
              style={{ display: loading ? 'none' : 'block' }}
            />
          </div>
        )
      case "video":
        return (
          <div className="h-[400px] rounded-md overflow-hidden bg-muted/20">
            {loading && <Skeleton className="h-full w-full" />}
            <video
              src={file.url}
              controls
              className="w-full h-full"
              onLoadedData={() => setLoading(false)}
              onError={() => {
                setLoading(false) 
                setPreviewError(true)
              }}
              style={{ display: loading ? 'none' : 'block' }}
            />
          </div>
        )
      case "audio":
        return (
          <div className="flex flex-col items-center justify-center h-[400px] bg-muted/20 rounded-md p-4">
            {loading && <Skeleton className="h-full w-full" />}
            <div className={loading ? 'hidden' : 'w-full max-w-md'}>
              <div className="mb-8">
                <FileText className="h-16 w-16 mx-auto mb-4 text-primary/80" />
                <h3 className="text-center font-medium text-lg mb-2">{file.name}</h3>
              </div>
              <audio
                src={file.url}
                controls
                className="w-full"
                onLoadedData={() => setLoading(false)}
                onError={() => {
                  setLoading(false)
                  setPreviewError(true)
                }}
              />
            </div>
          </div>
        )
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[400px] bg-muted/20 rounded-md">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Preview not available</h3>
            <p className="text-sm text-muted-foreground mb-4">This file type cannot be previewed</p>
            <Button asChild variant="outline">
              <a href={file.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open file in new tab
              </a>
            </Button>
          </div>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-auto flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center gap-3">
            {getFileIcon()}
            <DialogTitle className="truncate">
              {file?.name || "File Preview"}
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <Tabs value={previewType} onValueChange={(v) => setPreviewType(v as "preview" | "info")} className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid grid-cols-2 w-full max-w-[200px] mb-4">
            <TabsTrigger value="preview" disabled={!file}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="info" disabled={!file}>
              <FileText className="h-4 w-4 mr-2" />
              Details
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="flex-1 overflow-auto">
            {renderFilePreview()}
          </TabsContent>
          
          <TabsContent value="info" className="flex-1 overflow-auto">
            {file && (
              <div className="space-y-4">
                <div className="grid grid-cols-[100px_1fr] gap-2">
                  <span className="font-medium text-muted-foreground">Name:</span>
                  <span className="break-words">{file.name}</span>
                  
                  <span className="font-medium text-muted-foreground">Type:</span>
                  <span>{file.type || "Unknown"}</span>
                  
                  {file.size && (
                    <>
                      <span className="font-medium text-muted-foreground">Size:</span>
                      <span>{formatFileSize(file.size)}</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            Close
          </Button>
          {file && (
            <Button asChild>
              <a href={file.url} download target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" />
                Download
              </a>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}