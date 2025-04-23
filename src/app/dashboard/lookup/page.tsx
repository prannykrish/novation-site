"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, Filter, FileText, FileImage, PresentationIcon, Maximize2, Eye, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { assetService, categoryService } from "@/lib/database"
import { Asset, Category, SearchFilters, AssetFile } from "@/types/database"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FilePreview } from "@/components/file-preview"

/* ----------------------------------------------------------------
  Constants
-----------------------------------------------------------------*/
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

/* ----------------------------------------------------------------
  Helpers
-----------------------------------------------------------------*/
const getAssetIcon = (type: string) => {
  switch (type?.toLowerCase()) {
    case "image":
      return <FileImage className="h-5 w-5" />
    case "presentation":
      return <PresentationIcon className="h-5 w-5" />
    case "document":
    default:
      return <FileText className="h-5 w-5" />
  }
}

/* ----------------------------------------------------------------
  Component
-----------------------------------------------------------------*/
export default function LookupPage() {
  /* ---------------------------- State ---------------------------*/
  const [assets, setAssets] = React.useState<Asset[]>([])
  const [filteredAssets, setFilteredAssets] = React.useState<Asset[]>([])
  const [categories, setCategories] = React.useState<Category[]>(DEFAULT_CATEGORIES)
  const [loading, setLoading] = React.useState(false)
  const [initialLoadComplete, setInitialLoadComplete] = React.useState(false)
  const [isClient, setIsClient] = React.useState(false)
  const [showFilterDialog, setShowFilterDialog] = React.useState(false)
  const [expandedAsset, setExpandedAsset] = React.useState<Asset | null>(null)
  
  // Add pagination state
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(12)
  const [totalAssets, setTotalAssets] = React.useState(0)
  
  // Add file preview state
  const [previewFile, setPreviewFile] = React.useState<AssetFile | null>(null)
  const [showFilePreview, setShowFilePreview] = React.useState(false)

  const [searchFilters, setSearchFilters] = React.useState<SearchFilters>({
    keyword: "",
    categories: [],
    tags: [],
    types: [],
    startDate: "",
    endDate: "",
    isPublicOnly: false,
    page: 1,
    pageSize: 12,
  })

  // Import useRouter hook
  const router = useRouter()

  /* -------------------------- Side‑effects ----------------------*/
  // hydrate filters from localStorage on mount
  React.useEffect(() => {
    setIsClient(true)
    const raw = localStorage.getItem("assetLookupFilters")
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        setSearchFilters(parsed)
      } catch (_) {
        /* ignore malformed */
      }
    }
    setInitialLoadComplete(true)
  }, [])

  // persist filters
  React.useEffect(() => {
    if (isClient) {
      localStorage.setItem("assetLookupFilters", JSON.stringify(searchFilters))
    }
  }, [searchFilters, isClient])

  // fetch categories once
  React.useEffect(() => {
    ;(async () => {
      try {
        const list = await categoryService.getCategories()
        if (list.length) setCategories(list)
      } catch (_) {}
    })()
  }, [])

  // fetch assets whenever filters change after initial mount
  React.useEffect(() => {
    if (!initialLoadComplete) return
    ;(async () => {
      await loadAssets()
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFilters, initialLoadComplete])

  /* ------------------------ Data fetching ----------------------*/
  const loadAssets = async () => {
    setLoading(true)
    try {
      const srvFilters: any = {}
      if (searchFilters.keyword) srvFilters.keyword = searchFilters.keyword
      if (searchFilters.categories.length) srvFilters.category = searchFilters.categories[0]
      if (searchFilters.tags.length) srvFilters.tags = searchFilters.tags
      if (searchFilters.types.length) srvFilters.type = searchFilters.types[0]
      if (searchFilters.startDate) srvFilters.startDate = searchFilters.startDate
      if (searchFilters.endDate) srvFilters.endDate = searchFilters.endDate
      if (searchFilters.isPublicOnly) srvFilters.isPublicOnly = true
      
      // Add pagination parameters
      srvFilters.page = searchFilters.page || 1
      srvFilters.pageSize = searchFilters.pageSize || 12

      // Get assets with pagination
      const result = await assetService.getAssetsWithPagination(srvFilters)
      setAssets(result.items)
      setFilteredAssets(result.items)
      setTotalAssets(result.total)
    } catch (err) {
      console.error("Error loading assets", err)
    } finally {
      setLoading(false)
    }
  }

  /* ------------------------- Handlers --------------------------*/
  // Handle page change
  const handlePageChange = (newPage: number) => {
    setSearchFilters(prev => ({ ...prev, page: newPage }));
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize: number) => {
    setSearchFilters(prev => ({ 
      ...prev, 
      page: 1, // Reset to first page when changing page size
      pageSize: newPageSize 
    }));
  };

  // Other filter changes should reset pagination to first page
  const handleSearch = (keyword: string) => {
    setSearchFilters((prev) => ({ ...prev, keyword, page: 1 }))
  }

  const togglePublicOnly = (value: string) => {
    setSearchFilters((prev) => ({ ...prev, isPublicOnly: value === "public", page: 1 }))
  }

  const resetFilters = () => {
    setSearchFilters({
      keyword: "",
      categories: [],
      tags: [],
      types: [],
      startDate: "",
      endDate: "",
      isPublicOnly: false,
      page: 1,
      pageSize: 12,
    })
  }

  // Handle file preview
  const handlePreviewFile = (file: AssetFile) => {
    setPreviewFile(file);
    setShowFilePreview(true);
  };

  // In expanded asset dialog, add preview capability for files
  const handlePreviewFileFromExpanded = (file: AssetFile) => {
    // Close the expanded view, then show the file preview
    setExpandedAsset(null);
    // Small timeout to allow the dialog to close smoothly
    setTimeout(() => {
      setPreviewFile(file);
      setShowFilePreview(true);
    }, 100);
  };

  // Navigate to messages page with the user ID to start a conversation
  const handleMessageUser = (userId: string, userName: string) => {
    // Navigate to messages page with user parameter
    router.push(`/dashboard/messages?user=${userId}`);
  };

  /* --------------------------- UI ------------------------------*/
  return (
    <div className="w-full h-full p-6 bg-background">
      {/* ------------------- Header --------------------*/}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-6">Asset Lookup</h1>
        <div className="flex flex-col items-center max-w-3xl mx-auto gap-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              className="pl-10 w-full h-12 text-base rounded-xl"
              value={searchFilters.keyword}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-center w-full">
            {isClient ? (
              <Tabs
                className="w-[250px]"
                value={searchFilters.isPublicOnly ? "public" : "all"}
                onValueChange={togglePublicOnly}
              >
                <TabsList className="grid w-full grid-cols-2 rounded-xl">
                  <TabsTrigger value="all">All Assets</TabsTrigger>
                  <TabsTrigger value="public">Public Only</TabsTrigger>
                </TabsList>
              </Tabs>
            ) : (
              <div className="w-[250px] h-10 bg-muted rounded-lg animate-pulse" />
            )}
            <Button variant="outline" onClick={() => setShowFilterDialog(true)} className="ml-4">
              <Filter className="mr-2 h-4 w-4" />More Filters
            </Button>
          </div>
        </div>
      </div>

      {/* ------------------- Grid ----------------------*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* skeletons */}
        {loading &&
          [...Array(searchFilters.pageSize || 12)].map((_, i) => (
            <Card key={i} className="opacity-50 min-h-[220px] animate-pulse">
              <CardHeader>
                <CardTitle className="bg-muted h-6 rounded mb-2" />
                <CardDescription className="bg-muted h-4 rounded" />
              </CardHeader>
              <CardContent>
                <div className="bg-muted h-4 rounded mb-2" />
                <div className="bg-muted h-4 rounded w-3/4" />
              </CardContent>
            </Card>
          ))}

        {/* empty */}
        {!loading && filteredAssets.length === 0 && (
          <div className="col-span-full text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No items found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        )}

        {/* cards */}
        {!loading &&
          filteredAssets.map((asset) => (
            <Card key={asset.id} className="overflow-hidden flex flex-col justify-between shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="flex items-center justify-center h-7 w-7 rounded bg-muted shrink-0">
                    {getAssetIcon(asset.type)}
                  </span>
                  <CardTitle
                    className="text-base line-clamp-1"
                    title={asset.name}
                  >
                    {asset.name}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto h-7 w-7 p-0 rounded-full opacity-70 hover:opacity-100"
                    onClick={() => {
                      setExpandedAsset(asset)
                    }}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription className="text-xs capitalize" title={asset.type}>
                  {asset.type}
                </CardDescription>
              </CardHeader>

              <CardContent className="pb-2">
                {asset.description && (
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2" title={asset.description}>
                    {asset.description}
                  </p>
                )}
                <div className="space-y-2">
                  {asset.category && (
                    <div className="text-xs flex items-start">
                      <span className="text-muted-foreground inline-block min-w-[70px]">Category:</span>
                      <span className="truncate" title={asset.category}>
                        {categories.find((c) => c.id === asset.category)?.name || asset.category}
                      </span>
                    </div>
                  )}
                  {asset.tags?.length ? (
                    <div className="flex flex-wrap gap-1 max-h-[40px] overflow-hidden">
                      {asset.tags.slice(0, 3).map((t, i) => (
                        <Badge key={i} variant="outline" className="text-xs truncate max-w-[100px]" title={t}>
                          {t}
                        </Badge>
                      ))}
                      {asset.tags.length > 3 && <Badge variant="outline">+{asset.tags.length - 3}</Badge>}
                    </div>
                  ) : null}
                  
                  {/* Show files only for public assets */}
                  {asset.isPublic && ((asset.files && asset.files.length > 0) || asset.fileUrl) && (
                    <div className="mt-2 text-xs">
                      <div className="text-muted-foreground mb-1">Files:</div>
                      <div className="space-y-1">
                        {/* Legacy file URL */}
                        {asset.fileUrl && (
                          <div className="flex items-center gap-1 justify-between">
                            <div className="flex items-center gap-1 min-w-0">
                              <FileText className="h-3 w-3 text-muted-foreground" />
                              <a
                                href={asset.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="truncate text-primary hover:underline"
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
                                handlePreviewFile({url: asset.fileUrl!, name: "Attached file", type: "", size: 0});
                              }}
                            >
                              <Eye className="h-3 w-3" />
                              <span className="sr-only">Preview</span>
                            </Button>
                          </div>
                        )}
                        
                        {/* New multiple files */}
                        {asset.files?.map((file, index) => (
                          <div key={index} className="flex items-center gap-1 justify-between">
                            <div className="flex items-center gap-1 min-w-0">
                              <FileText className="h-3 w-3 text-muted-foreground" />
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="truncate text-primary hover:underline"
                                title={file.name}
                              >
                                {file.name || `File ${index + 1}`}
                              </a>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 rounded-full hover:bg-muted" 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handlePreviewFile(file);
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
                  
                  <div className="text-xs flex justify-between items-center">
                    <span className={asset.isPublic ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}>
                      {asset.isPublic ? "Public" : "Private"}
                    </span>
                    <span className="text-muted-foreground">
                      {new Date(asset.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center py-3 px-4 border-t">
                <span className="text-xs text-muted-foreground">
                  By {asset.userName || asset.userEmail || "Unknown"}
                </span>
                {asset.userId && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMessageUser(asset.userId, asset.userName || asset.userEmail || "User");
                    }}
                  >
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Message
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
      </div>

      {/* ------------------- Pagination ----------------------*/}
      {!loading && totalAssets > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {((searchFilters.page || 1) - 1) * (searchFilters.pageSize || 12) + 1}-
            {Math.min((searchFilters.page || 1) * (searchFilters.pageSize || 12), totalAssets)} of {totalAssets} assets
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Label htmlFor="pageSize" className="mr-2 text-sm">Per page:</Label>
              <Select
                value={String(searchFilters.pageSize || 12)}
                onValueChange={(value) => handlePageSizeChange(Number(value))}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder="12" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                  <SelectItem value="48">48</SelectItem>
                  <SelectItem value="96">96</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handlePageChange(1)}
                disabled={(searchFilters.page || 1) <= 1}
              >
                <span className="sr-only">First page</span>
                <span>«</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 ml-1"
                onClick={() => handlePageChange((searchFilters.page || 1) - 1)}
                disabled={(searchFilters.page || 1) <= 1}
              >
                <span className="sr-only">Previous page</span>
                <span>‹</span>
              </Button>
              
              <span className="mx-2 text-sm">
                Page {searchFilters.page || 1} of {Math.ceil(totalAssets / (searchFilters.pageSize || 12))}
              </span>
              
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handlePageChange((searchFilters.page || 1) + 1)}
                disabled={(searchFilters.page || 1) >= Math.ceil(totalAssets / (searchFilters.pageSize || 12))}
              >
                <span className="sr-only">Next page</span>
                <span>›</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 ml-1"
                onClick={() => handlePageChange(Math.ceil(totalAssets / (searchFilters.pageSize || 12)))}
                disabled={(searchFilters.page || 1) >= Math.ceil(totalAssets / (searchFilters.pageSize || 12))}
              >
                <span className="sr-only">Last page</span>
                <span>»</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Filter dialog ---------------*/}
      <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Filter Assets</DialogTitle>
            <DialogDescription>
              Set filters to narrow down your asset search.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* Asset Type filter */}
            <div className="grid gap-2">
              <Label>Asset Types</Label>
              <div className="grid grid-cols-2 gap-2">
                {DEFAULT_ASSET_TYPES.map((type) => (
                  <div key={type.id} className="flex items-center gap-2">
                    <Checkbox 
                      id={`type-${type.id}`}
                      checked={searchFilters.types?.includes(type.id)}
                      onCheckedChange={(checked) => {
                        setSearchFilters(prev => ({
                          ...prev,
                          types: checked 
                            ? [...(prev.types || []), type.id]
                            : (prev.types || []).filter(id => id !== type.id),
                          page: 1
                        }))
                      }}
                    />
                    <Label htmlFor={`type-${type.id}`}>{type.name}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Category filter */}
            <div className="grid gap-2">
              <Label>Categories</Label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center gap-2">
                    <Checkbox 
                      id={`category-${category.id}`}
                      checked={searchFilters.categories?.includes(category.id)}
                      onCheckedChange={(checked) => {
                        setSearchFilters(prev => ({
                          ...prev,
                          categories: checked 
                            ? [...(prev.categories || []), category.id]
                            : (prev.categories || []).filter(id => id !== category.id),
                          page: 1
                        }))
                      }}
                    />
                    <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Tags filter */}
            <div className="grid gap-2">
              <Label htmlFor="filterTags">Tags (comma separated)</Label>
              <Input
                id="filterTags"
                value={searchFilters.tags?.join(', ') || ''}
                onChange={(e) => {
                  const tagArray = e.target.value
                    ? e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
                    : []
                  setSearchFilters(prev => ({
                    ...prev,
                    tags: tagArray,
                    page: 1
                  }))
                }}
                placeholder="Enter tags to filter by"
              />
            </div>
            
            {/* Date filters */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="filterStartDate">Usage Start Date</Label>
                <Input
                  id="filterStartDate"
                  type="date"
                  value={searchFilters.startDate || ''}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, startDate: e.target.value, page: 1 }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="filterEndDate">Usage End Date</Label>
                <Input
                  id="filterEndDate"
                  type="date"
                  value={searchFilters.endDate || ''}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, endDate: e.target.value, page: 1 }))}
                />
              </div>
            </div>
            
            {/* Public only filter */}
            <div className="flex items-center gap-2">
              <Checkbox 
                id="isPublicOnly"
                checked={searchFilters.isPublicOnly}
                onCheckedChange={(checked) => 
                  setSearchFilters(prev => ({ ...prev, isPublicOnly: Boolean(checked), page: 1 }))
                }
              />
              <Label htmlFor="isPublicOnly">
                Show only public assets
              </Label>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={resetFilters}>
              Reset Filters
            </Button>
            <Button onClick={() => setShowFilterDialog(false)}>
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---------------- Expand dialog ---------------*/}
      <Dialog open={!!expandedAsset} onOpenChange={(isOpen) => !isOpen && setExpandedAsset(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{expandedAsset?.name}</DialogTitle>
            <DialogDescription className="flex items-center gap-1">
              {getAssetIcon(expandedAsset?.type || "")}
              <span className="capitalize">{expandedAsset?.type}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4 text-sm">
            {expandedAsset?.description && (
              <>
                <h3 className="font-medium text-base">Description</h3>
                <p className="whitespace-pre-wrap break-words text-muted-foreground">{expandedAsset.description}</p>
              </>
            )}
            {expandedAsset?.category && (
              <>
                <h3 className="font-medium text-base">Category</h3>
                <p className="text-muted-foreground">{categories.find((c) => c.id === expandedAsset.category)?.name || expandedAsset.category}</p>
              </>
            )}
            {expandedAsset?.tags?.length ? (
              <>
                <h3 className="font-medium text-base">Tags</h3>
                <div className="flex flex-wrap gap-1">
                  {expandedAsset.tags.map((tag, i) => (
                    <Badge key={i} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </>
            ) : null}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-base">Visibility</h3>
                <p className={expandedAsset?.isPublic ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}>
                  {expandedAsset?.isPublic ? "Public" : "Private"}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-base">Created</h3>
                <p className="text-muted-foreground">
                  {expandedAsset && new Date(expandedAsset.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            {(expandedAsset?.usageStartDate || expandedAsset?.usageEndDate) && (
              <div>
                <h3 className="font-medium text-base">Usage Period</h3>
                <p className="text-muted-foreground">
                  {expandedAsset.usageStartDate ? new Date(expandedAsset.usageStartDate).toLocaleDateString() : 'Any time'} 
                  {expandedAsset.usageEndDate ? ` to ${new Date(expandedAsset.usageEndDate).toLocaleDateString()}` : ''}
                </p>
              </div>
            )}
            <div>
              <h3 className="font-medium text-base">Owner</h3>
              <p className="text-muted-foreground">
                {expandedAsset?.userName || expandedAsset?.userEmail || "Unknown"}
              </p>
            </div>
            
            {/* Show files for all assets in the expanded view (both public and private) */}
            {((expandedAsset?.files && expandedAsset.files.length > 0) || expandedAsset?.fileUrl) && (
              <>
                <h3 className="font-medium text-base">Files</h3>
                <div className="space-y-2">
                  {/* Legacy file URL */}
                  {expandedAsset?.fileUrl && (
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <a
                          href={expandedAsset.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline truncate"
                          title="Attached file"
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
                  
                  {/* New multiple files */}
                  {expandedAsset?.files?.map((file, index) => (
                    <div key={index} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline truncate"
                          title={file.name}
                        >
                          {file.name || `File ${index + 1}`}
                        </a>
                        {file.size && (
                          <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                            {Math.round(file.size / 1024)} KB
                          </span>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-shrink-0"
                        onClick={() => handlePreviewFileFromExpanded(file)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExpandedAsset(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* File Preview Component */}
      <FilePreview
        file={previewFile}
        isOpen={showFilePreview}
        onClose={() => {
          setShowFilePreview(false);
          setPreviewFile(null);
        }}
      />
    </div>
  )
}