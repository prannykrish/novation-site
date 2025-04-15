"use client"

import * as React from "react"
import { Search, Filter, FileText, FileImage, PresentationIcon, Maximize2 } from "lucide-react"
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
import { assetService, categoryService, userService } from "@/lib/database"
import { Asset, Category, SearchFilters } from "@/types/database"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Default asset types
const DEFAULT_ASSET_TYPES = [
  { id: "document", name: "Document" },
  { id: "image", name: "Image" },
  { id: "presentation", name: "Presentation" },
  { id: "spreadsheet", name: "Spreadsheet" },
  { id: "other", name: "Other" }
]

// Default categories if none are found in the database
const DEFAULT_CATEGORIES = [
  { id: "body-care", name: "Body Care" },
  { id: "mens-grooming", name: "Men's Grooming" }
]

export default function LookupPage() {
  // State for assets and search
  const [assets, setAssets] = React.useState<Asset[]>([])
  const [filteredAssets, setFilteredAssets] = React.useState<Asset[]>([])
  const [categories, setCategories] = React.useState<Category[]>(DEFAULT_CATEGORIES)
  const [loading, setLoading] = React.useState(false)
  
  // State for search filters
  const [isClient, setIsClient] = React.useState(false)
  const [initialLoadComplete, setInitialLoadComplete] = React.useState(false)
  const [searchFilters, setSearchFilters] = React.useState<SearchFilters>({
    keyword: "",
    categories: [],
    tags: [],
    types: [],
    startDate: "",
    endDate: "",
    isPublicOnly: false
  })
  
  // Load saved filters from localStorage only on client-side
  React.useEffect(() => {
    setIsClient(true)
    // Try to load saved filters from localStorage after component mounts (client-side only)
    const savedFilters = localStorage.getItem('assetLookupFilters')
    if (savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters)
        
        // Important: Set the filters first before loading data
        setSearchFilters(parsedFilters)
        
        // Create a fresh service filters object from the parsed filters
        const serviceFilters: any = {}
        
        if (parsedFilters.keyword) serviceFilters.keyword = parsedFilters.keyword
        if (parsedFilters.categories?.length) serviceFilters.category = parsedFilters.categories[0]
        if (parsedFilters.tags?.length) serviceFilters.tags = parsedFilters.tags
        if (parsedFilters.types?.length) serviceFilters.type = parsedFilters.types[0]
        if (parsedFilters.startDate) serviceFilters.startDate = parsedFilters.startDate
        if (parsedFilters.endDate) serviceFilters.endDate = parsedFilters.endDate
        parsedFilters.isPublicOnly = (parsedFilters.isPublicOnly === 'true');
        // Load assets directly with the filters - ensure isPublicOnly is correctly applied
        setLoading(true)
        assetService.getAssets(serviceFilters)
          .then(assetData => {
            setAssets(assetData)
            setFilteredAssets(assetData)
            setInitialLoadComplete(true)
            setLoading(false)
          })
          .catch(error => {
            console.error("Error loading assets:", error)
            setLoading(false)
          })
      } catch (e) {
        console.error('Error parsing saved filters:', e)
        // If there's an error, mark load as complete anyway
        setInitialLoadComplete(true)
      }
    } else {
      // If no saved filters, mark load as complete
      setInitialLoadComplete(true)
    }
  }, [])
  
  // Save filters to localStorage whenever they change
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('assetLookupFilters', JSON.stringify(searchFilters))
    }
  }, [searchFilters])
  
  // Dialog states
  const [showFilterDialog, setShowFilterDialog] = React.useState(false)
  const [showExpandDialog, setShowExpandDialog] = React.useState(false)
  const [expandedAsset, setExpandedAsset] = React.useState<Asset | null>(null)
  
  // Initial data load for categories only
  React.useEffect(() => {
    async function loadInitialData() {
      try {
        // Load all categories
        const categoryData = await categoryService.getCategories()
        if (categoryData.length > 0) {
          setCategories(categoryData)
        }
        
        // Only load assets if localStorage load hasn't happened yet
        if (!isClient && !initialLoadComplete) {
          setLoading(true)
          await loadAssets()
          setInitialLoadComplete(true)
          setLoading(false)
        }
      } catch (error) {
        console.error("Error loading initial data:", error)
        setLoading(false)
        setInitialLoadComplete(true)
      }
    }
    
    loadInitialData()
  }, [isClient, initialLoadComplete]) // Add initialLoadComplete dependency
  
  // Load assets with optional filters
  const loadAssets = async () => {
    setLoading(true)
    try {
      // Convert our UI filters to the format expected by the asset service
      const serviceFilters: any = {}
      
      if (searchFilters.keyword) serviceFilters.keyword = searchFilters.keyword
      if (searchFilters.categories?.length) serviceFilters.category = searchFilters.categories[0] // API only supports one category
      if (searchFilters.tags?.length) serviceFilters.tags = searchFilters.tags
      if (searchFilters.types?.length) serviceFilters.type = searchFilters.types[0] // API only supports one type
      if (searchFilters.startDate) serviceFilters.startDate = searchFilters.startDate
      if (searchFilters.endDate) serviceFilters.endDate = searchFilters.endDate
      if (searchFilters.isPublicOnly === true) serviceFilters.isPublicOnly = true
      
      // Get all assets (no folder filtering)
      const assetData = await assetService.getAssets(serviceFilters)
      setAssets(assetData)
      setFilteredAssets(assetData)
    } catch (error) {
      console.error("Error loading assets:", error)
    } finally {
      setLoading(false)
    }
  }
  
  // Handle basic search
  const handleSearch = (keyword: string) => {
    setSearchFilters(prev => ({ ...prev, keyword }))
    
    if (!keyword.trim()) {
      setFilteredAssets(assets)
      return
    }
    
    const lowerKeyword = keyword.toLowerCase()
    const results = assets.filter(asset => {
      const nameMatch = asset.name.toLowerCase().includes(lowerKeyword)
      const descMatch = asset.description?.toLowerCase().includes(lowerKeyword) || false
      const tagMatch = asset.tags?.some(tag => tag.toLowerCase().includes(lowerKeyword)) || false
      
      return nameMatch || descMatch || tagMatch
    })
    
    setFilteredAssets(results)
  }
  
  // Apply advanced filters
  const applyFilters = async () => {
    // Instead of filtering the existing results, we'll make a new request to get
    // filtered results directly from the database for better performance
    await loadAssets()
    setShowFilterDialog(false)
  }
  
  // Reset filters
  const resetFilters = () => {
    setSearchFilters({
      keyword: "",
      categories: [],
      tags: [],
      types: [],
      startDate: "",
      endDate: "",
      isPublicOnly: false
    })
    
    // Reload all assets
    loadAssets()
    setShowFilterDialog(false)
  }
  
  // Get appropriate icon for asset type
  const getAssetIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'document':
        return <FileText className="h-5 w-5" />
      case 'image':
        return <FileImage className="h-5 w-5" />
      case 'presentation':
        return <PresentationIcon className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  // Toggle between public and all assets
  const togglePublicOnly = (value: string) => {
    const showPublic = value === "public"
    
    // Build fresh filters first
    const updatedFilters = { ...searchFilters, isPublicOnly: showPublic }
    
    // Update state
    setSearchFilters(updatedFilters)
  
    // Construct serviceFilters from updatedFilters (not the stale searchFilters)
    const serviceFilters: any = {}
    if (updatedFilters.keyword) serviceFilters.keyword = updatedFilters.keyword
    if (updatedFilters.categories?.length) serviceFilters.category = updatedFilters.categories[0]
    if (updatedFilters.tags?.length) serviceFilters.tags = updatedFilters.tags
    if (updatedFilters.types?.length) serviceFilters.type = updatedFilters.types[0]
    if (updatedFilters.startDate) serviceFilters.startDate = updatedFilters.startDate
    if (updatedFilters.endDate) serviceFilters.endDate = updatedFilters.endDate
    if (updatedFilters.isPublicOnly === true) serviceFilters.isPublicOnly = true
  
    // Load assets with the updated filters
    setLoading(true)
    assetService.getAssets(serviceFilters)
      .then(assetData => {
        setAssets(assetData)
        setFilteredAssets(assetData)
        setLoading(false)
      })
      .catch(error => {
        console.error("Error loading assets:", error)
        setLoading(false)
      })
  }

  // Handle expand view
  const handleExpandAsset = (asset: Asset, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent any parent onClick handlers from firing
    setExpandedAsset(asset)
    setShowExpandDialog(true)
  }
  
  return (
    <div className="w-full h-full p-6 bg-background">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-6">Asset Lookup</h1>
        
        {/* Centered search bar with toggle */}
        <div className="flex flex-col items-center max-w-3xl mx-auto gap-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              className="pl-10 w-full h-12 text-base rounded-xl"
              value={searchFilters.keyword || ""}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          
          <div className="flex items-center justify-center w-full">
            {isClient ? (
              <Tabs 
                defaultValue="all"
                className="w-[250px]"
                value={searchFilters.isPublicOnly ? "public" : "all"}
                onValueChange={togglePublicOnly}
              >
                <TabsList className="grid w-full grid-cols-2 rounded-xl">
                  <TabsTrigger value="all" className="rounded-lg">All Assets</TabsTrigger>
                  <TabsTrigger value="public" className="rounded-lg">Public Only</TabsTrigger>
                </TabsList>
              </Tabs>
            ) : (
              <div className="w-[250px] h-10 bg-muted rounded-lg animate-pulse" />
            )}
            
            <Button variant="outline" onClick={() => setShowFilterDialog(true)} className="ml-4">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </div>
      </div>
      
      {/* Asset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Loading indicators */}
        {loading && Array(8).fill(0).map((_, i) => (
          <Card key={`skeleton-${i}`} className="opacity-50">
            <CardHeader>
              <CardTitle className="bg-muted w-2/3 h-6 rounded animate-pulse"></CardTitle>
              <CardDescription className="bg-muted w-1/2 h-4 rounded animate-pulse"></CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted w-full h-4 rounded animate-pulse mb-2"></div>
              <div className="bg-muted w-3/4 h-4 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
        
        {/* Empty state */}
        {!loading && filteredAssets.length === 0 && (
          <div className="col-span-full text-center py-12">
            <h3 className="text-lg font-medium mb-1">No assets found</h3>
            <p className="text-muted-foreground mb-4">
              No assets match your current search criteria. Try adjusting your filters.
            </p>
          </div>
        )}
        
        {/* Asset cards */}
        {!loading && filteredAssets.map(asset => (
          <Card key={asset.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getAssetIcon(asset.type)}
                  <div className="max-w-[80%]">
                    <div className="flex items-center gap-1 group">
                      <CardTitle className="text-base truncate">{asset.name}</CardTitle>
                      {asset.name.length > 20 && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5 opacity-30 group-hover:opacity-100 transition-opacity" 
                          onClick={(e) => handleExpandAsset(asset, e)}
                        >
                          <Maximize2 className="h-3 w-3" />
                          <span className="sr-only">Expand</span>
                        </Button>
                      )}
                    </div>
                    <CardDescription className="text-xs truncate">{asset.type}</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pb-2">
              {asset.description && (
                <div className="flex items-start gap-1 group">
                  <p className="text-sm text-muted-foreground mt-1 mb-2 line-clamp-2">
                    {asset.description}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5 mt-1 opacity-30 group-hover:opacity-100 transition-opacity" 
                    onClick={(e) => handleExpandAsset(asset, e)}
                  >
                    <Maximize2 className="h-3 w-3" />
                    <span className="sr-only">Expand</span>
                  </Button>
                </div>
              )}
              
              <div className="space-y-2">
                {asset.category && (
                  <div className="text-xs overflow-hidden">
                    <span className="text-muted-foreground">Category: </span>
                    <span className="inline-block truncate max-w-[150px]">
                      {categories.find(c => c.id === asset.category)?.name || asset.category}
                    </span>
                  </div>
                )}
                
                {asset.tags && asset.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 max-h-[40px] overflow-hidden">
                    {asset.tags.map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs truncate max-w-[100px]">
                        {tag}
                      </Badge>
                    ))}
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
            
            <CardFooter className="pt-2 text-xs text-muted-foreground">
              <span className="truncate">By {asset.userName || asset.userEmail || 'Unknown'}</span>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Filter Dialog */}
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
                            : (prev.types || []).filter(id => id !== type.id)
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
                            : (prev.categories || []).filter(id => id !== category.id)
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
                    tags: tagArray
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
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="filterEndDate">Usage End Date</Label>
                <Input
                  id="filterEndDate"
                  type="date"
                  value={searchFilters.endDate || ''}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>
            
            {/* Public only filter */}
            <div className="flex items-center gap-2">
              <Checkbox 
                id="isPublicOnly"
                checked={searchFilters.isPublicOnly}
                onCheckedChange={(checked) => 
                  setSearchFilters(prev => ({ ...prev, isPublicOnly: Boolean(checked) }))
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
            <Button onClick={applyFilters}>
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Expand Content Dialog */}
      <Dialog open={showExpandDialog} onOpenChange={setShowExpandDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{expandedAsset?.name}</DialogTitle>
            <DialogDescription>{expandedAsset?.type}</DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {expandedAsset?.description && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-1">Description:</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {expandedAsset.description}
                </p>
              </div>
            )}
            
            {expandedAsset?.category && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-1">Category:</h3>
                <p className="text-sm text-muted-foreground">
                  {categories.find(c => c.id === expandedAsset.category)?.name || expandedAsset.category}
                </p>
              </div>
            )}
            
            {expandedAsset?.tags && expandedAsset.tags.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-1">Tags:</h3>
                <div className="flex flex-wrap gap-1">
                  {expandedAsset.tags.map((tag, i) => (
                    <Badge key={i} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-medium mb-1">Visibility:</h3>
                <p className={expandedAsset?.isPublic ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}>
                  {expandedAsset?.isPublic ? "Public" : "Private"}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Created:</h3>
                <p className="text-muted-foreground">
                  {expandedAsset && new Date(expandedAsset.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              {(expandedAsset?.usageStartDate || expandedAsset?.usageEndDate) && (
                <div className="col-span-2">
                  <h3 className="font-medium mb-1">Usage Period:</h3>
                  <p className="text-muted-foreground">
                    {expandedAsset?.usageStartDate || 'Any time'} 
                    {expandedAsset?.usageEndDate ? ` to ${expandedAsset.usageEndDate}` : ''}
                  </p>
                </div>
              )}
              
              <div className="col-span-2">
                <h3 className="font-medium mb-1">Created By:</h3>
                <p className="text-muted-foreground">
                  {expandedAsset?.userName || expandedAsset?.userEmail || 'Unknown'}
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExpandDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}