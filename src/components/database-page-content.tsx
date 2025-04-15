"use client"

import * as React from "react"
import { Search, Filter, Plus, MessageSquare, AlertCircle, X, Edit, FolderUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FolderManager } from "./folder-manager"

import { productService, categoryService, messageService, userService, folderService } from "@/lib/database"
import { Product, Category, DatabaseUser, SearchFilters } from "@/types/database"

// Default categories if none are found in the database
const DEFAULT_CATEGORIES = [
  { id: "body-care", name: "Body Care" },
  { id: "mens-grooming", name: "Men's Grooming" }
]

export function DatabasePageContent() {
  // State for products, categories, and users
  const [products, setProducts] = React.useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>([])
  const [categories, setCategories] = React.useState<Category[]>(DEFAULT_CATEGORIES)
  const [users, setUsers] = React.useState<DatabaseUser[]>([])
  const [currentUser, setCurrentUser] = React.useState<DatabaseUser | null>(null)
  
  // State for folders
  const [selectedFolderId, setSelectedFolderId] = React.useState<string | null>(null)
  const [showMoveToPFolderDialog, setShowMoveToPFolderDialog] = React.useState(false)
  const [productToMove, setProductToMove] = React.useState<Product | null>(null)
  const [availableFolders, setAvailableFolders] = React.useState<{id: string, name: string}[]>([])
  const [selectedMoveToFolder, setSelectedMoveToFolder] = React.useState<string>('')
  
  // State for new product form
  const [newProduct, setNewProduct] = React.useState({
    name: "",
    category: "",
    tags: "",
    isPublic: true,
    usageStartDate: "",
    usageEndDate: "",
    folderId: "",
  })
  
  // State for search filters
  const [searchFilters, setSearchFilters] = React.useState<SearchFilters>({
    keyword: "",
    categories: [],
    tags: [],
    startDate: "",
    endDate: "",
    isPublicOnly: false
  })
  
  // State for dialogs
  const [showAddProductDialog, setShowAddProductDialog] = React.useState(false)
  const [showFilterDialog, setShowFilterDialog] = React.useState(false)
  const [showNameWarning, setShowNameWarning] = React.useState(false)
  const [existingProducts, setExistingProducts] = React.useState<Product[]>([])
  const [showSendMessageDialog, setShowSendMessageDialog] = React.useState(false)
  const [selectedProductForMessage, setSelectedProductForMessage] = React.useState<Product | null>(null)
  
  // State for messages
  const [newMessage, setNewMessage] = React.useState({
    recipientId: "",
    subject: "",
    content: "",
    relatedProductId: ""
  })
  
  // State for loading
  const [loading, setLoading] = React.useState(false)
  
  // Initial data load
  React.useEffect(() => {
    async function loadInitialData() {
      setLoading(true)
      try {
        // Load current user
        const user = await userService.getCurrentUser()
        setCurrentUser(user)
        
        // Load all categories
        const categoryData = await categoryService.getCategories()
        if (categoryData.length > 0) {
          setCategories(categoryData)
        }
        
        // Load all users for messaging
        const userData = await userService.getUsers()
        setUsers(userData)
        
        // Load folders for the move to folder dialog
        const rootFolders = await folderService.getFolders(null)
        setAvailableFolders(rootFolders.map(f => ({ id: f.id, name: f.name })))
        
      } catch (error) {
        console.error("Error loading initial data:", error)
      } finally {
        setLoading(false)
      }
    }
    
    loadInitialData()
  }, [])
  
  // Load products when selected folder changes
  React.useEffect(() => {
    loadProducts()
  }, [selectedFolderId])
  
  // Load products based on selected folder
  const loadProducts = async () => {
    setLoading(true)
    try {
      // Load products filtered by folder if applicable
      const productData = await productService.getProducts({ folderId: selectedFolderId })
      setProducts(productData)
      setFilteredProducts(productData)
    } catch (error) {
      console.error("Error loading products:", error)
    } finally {
      setLoading(false)
    }
  }
  
  // Handle folder selection from FolderManager
  const handleFolderSelect = (folderId: string | null) => {
    setSelectedFolderId(folderId)
    // Reset search filters when changing folders
    setSearchFilters({
      keyword: "",
      categories: [],
      tags: [],
      startDate: "",
      endDate: "",
      isPublicOnly: false
    })
  }
  
  // Handle product search
  const handleSearch = (keyword: string) => {
    setSearchFilters(prev => ({ ...prev, keyword }))
    
    if (!keyword.trim()) {
      setFilteredProducts(products)
      return
    }
    
    const lowerKeyword = keyword.toLowerCase()
    const results = products.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(lowerKeyword)
      const tagMatch = product.tags?.some(tag => tag.toLowerCase().includes(lowerKeyword)) || false
      return nameMatch || tagMatch
    })
    
    setFilteredProducts(results)
  }
  
  // Apply advanced filters
  const applyFilters = () => {
    let results = [...products]
    
    // Filter by categories
    if (searchFilters.categories && searchFilters.categories.length > 0) {
      results = results.filter(p => searchFilters.categories?.includes(p.category))
    }
    
    // Filter by tags
    if (searchFilters.tags && searchFilters.tags.length > 0) {
      results = results.filter(p => 
        p.tags?.some(tag => searchFilters.tags?.some(filterTag => 
          tag.toLowerCase().includes(filterTag.toLowerCase())
        ))
      )
    }
    
    // Filter by date range
    if (searchFilters.startDate) {
      results = results.filter(p => !p.usageStartDate || p.usageStartDate >= searchFilters.startDate!)
    }
    if (searchFilters.endDate) {
      results = results.filter(p => !p.usageEndDate || p.usageEndDate <= searchFilters.endDate!)
    }
    
    // Filter by public only
    if (searchFilters.isPublicOnly) {
      results = results.filter(p => p.isPublic)
    }
    
    // Also apply keyword search if it exists
    if (searchFilters.keyword) {
      const lowerKeyword = searchFilters.keyword.toLowerCase()
      results = results.filter(product => {
        const nameMatch = product.name.toLowerCase().includes(lowerKeyword)
        const tagMatch = product.tags?.some(tag => tag.toLowerCase().includes(lowerKeyword)) || false
        return nameMatch || tagMatch
      })
    }
    
    setFilteredProducts(results)
    setShowFilterDialog(false)
  }
  
  // Reset filters
  const resetFilters = () => {
    setSearchFilters({
      keyword: "",
      categories: [],
      tags: [],
      startDate: "",
      endDate: "",
      isPublicOnly: false
    })
    setFilteredProducts(products)
    setShowFilterDialog(false)
  }
  
  // Prepare to move a product to a folder
  const prepareMoveToFolder = (product: Product) => {
    setProductToMove(product)
    
    // Load latest folders
    folderService.getFolders(null).then(folders => {
      setAvailableFolders(folders.map(f => ({ id: f.id, name: f.name })))
      setSelectedMoveToFolder(product.folderId || '')
      setShowMoveToPFolderDialog(true)
    })
  }
  
  // Handle move product to folder
  const handleMoveToFolder = async () => {
    if (!productToMove?.id) return
    
    setLoading(true)
    try {
      // If selectedMoveToFolder is empty string, it means move to root (null)
      const targetFolderId = selectedMoveToFolder || null
      
      await productService.moveProductToFolder(productToMove.id, targetFolderId)
      
      // Refresh products
      await loadProducts()
      
      setShowMoveToPFolderDialog(false)
      setProductToMove(null)
      setSelectedMoveToFolder('')
    } catch (error) {
      console.error("Error moving product to folder:", error)
      alert("Failed to move product. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  
  // Handle create product
  const handleCreateProduct = async () => {
    if (!newProduct.name || !newProduct.category) {
      alert("Product name and category are required")
      return
    }
    
    try {
      // Check if a product with the same name exists
      const existingProductCheck = await productService.checkProductExists(newProduct.name)
      if (existingProductCheck) {
        setExistingProducts(existingProductCheck)
        setShowNameWarning(true)
        return
      }
      
      const tagsArray = newProduct.tags
        ? newProduct.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : []
      
      await createProduct(tagsArray)
    } catch (error) {
      console.error("Error creating product:", error)
      alert("Failed to create product. Please try again.")
    }
  }
  
  // Create product (after warning confirmation if needed)
  const createProduct = async (tagsArray: string[]) => {
    setLoading(true)
    try {
      const createdProduct = await productService.createProduct({
        name: newProduct.name,
        category: newProduct.category,
        tags: tagsArray,
        isPublic: newProduct.isPublic,
        usageStartDate: newProduct.usageStartDate || undefined,
        usageEndDate: newProduct.usageEndDate || undefined,
        folderId: newProduct.folderId || selectedFolderId || undefined,
      })
      
      // Reset form and refresh products
      setNewProduct({
        name: "",
        category: "",
        tags: "",
        isPublic: true,
        usageStartDate: "",
        usageEndDate: "",
        folderId: "",
      })
      setShowAddProductDialog(false)
      setShowNameWarning(false)
      
      // Refresh product list
      await loadProducts()
    } catch (error) {
      console.error("Error creating product:", error)
      alert("Failed to create product. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  
  // Handle send message
  const handleSendMessage = async () => {
    if (!newMessage.recipientId || !newMessage.subject || !newMessage.content) {
      alert("Recipient, subject and message content are required")
      return
    }
    
    setLoading(true)
    try {
      await messageService.sendMessage({
        recipientId: newMessage.recipientId,
        subject: newMessage.subject,
        content: newMessage.content,
        relatedProductId: newMessage.relatedProductId || undefined
      })
      
      // Reset form and close dialog
      setNewMessage({
        recipientId: "",
        subject: "",
        content: "",
        relatedProductId: ""
      })
      setShowSendMessageDialog(false)
      setSelectedProductForMessage(null)
      
      alert("Message sent successfully")
    } catch (error) {
      console.error("Error sending message:", error)
      alert("Failed to send message. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  
  // Open message dialog for a specific product
  const openMessageDialogForProduct = (product: Product) => {
    setSelectedProductForMessage(product)
    setNewMessage({
      recipientId: product.userId,
      subject: `Regarding your product: ${product.name}`,
      content: "",
      relatedProductId: product.id
    })
    setShowSendMessageDialog(true)
  }
  
  return (
    <div className="p-4">
      <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Product Database</h1>
        
        <div className="flex gap-2">
          <div className="relative max-w-lg w-full mx-auto">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-10 w-[300px] md:w-[450px] h-12 text-base"
              value={searchFilters.keyword || ""}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          
          <Button variant="outline" onClick={() => setShowFilterDialog(true)}>
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          
          <Button onClick={() => setShowAddProductDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>
      
      {/* Main layout with folders and products */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Folder section */}
        <div className="md:col-span-1">
          <FolderManager onSelectFolder={handleFolderSelect} selectedFolderId={selectedFolderId} />
        </div>
        
        {/* Products section */}
        <div className="md:col-span-3">
          {/* Current folder title */}
          {selectedFolderId && (
            <div className="mb-4 pb-2 border-b">
              <h2 className="text-lg font-medium">
                Current Folder: {availableFolders.find(f => f.id === selectedFolderId)?.name || 'Loading...'}
              </h2>
            </div>
          )}
          
          {/* Product grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {loading && Array(3).fill(0).map((_, i) => (
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
            
            {!loading && filteredProducts.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">
                  {selectedFolderId 
                    ? "No products in this folder. Add products or move existing ones here."
                    : "No products found. Try adjusting your search or adding new products."
                  }
                </p>
              </div>
            )}
            
            {!loading && filteredProducts.map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{product.name}</CardTitle>
                      <CardDescription>{categories.find(c => c.id === product.category)?.name || product.category}</CardDescription>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                          <span className="sr-only">Menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => openMessageDialogForProduct(product)}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Contact Owner
                        </DropdownMenuItem>
                        {product.userId === currentUser?.id && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => prepareMoveToFolder(product)}>
                              <FolderUp className="mr-2 h-4 w-4" />
                              Move to Folder
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Product
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2">
                    {product.tags && product.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {product.tags.map((tag, i) => (
                          <Badge key={`${product.id}-tag-${i}`} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="text-sm">
                      <span className={product.isPublic ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}>
                        {product.isPublic ? "Public" : "Private"} product
                      </span>
                    </div>
                    
                    {(product.usageStartDate || product.usageEndDate) && (
                      <div className="text-sm text-muted-foreground">
                        Usage: {product.usageStartDate || 'Any time'} 
                        {product.usageEndDate ? ` to ${product.usageEndDate}` : ''}
                      </div>
                    )}
                    
                    <div className="text-sm text-muted-foreground">
                      Added on {new Date(product.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <div className="text-sm text-muted-foreground w-full">
                    By {product.userName || product.userEmail || 'Unknown user'}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      {/* Add Product Dialog */}
      <Dialog open={showAddProductDialog} onOpenChange={setShowAddProductDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Enter the details of your product. Name and category are required.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name*</Label>
              <Input
                id="name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="Enter product name"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category*</Label>
              <Select
                value={newProduct.category}
                onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={newProduct.tags}
                onChange={(e) => setNewProduct({ ...newProduct, tags: e.target.value })}
                placeholder="moisturizer, cleanser, skin care"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Checkbox 
                id="isPublic" 
                checked={newProduct.isPublic}
                onCheckedChange={(checked) => 
                  setNewProduct({ ...newProduct, isPublic: Boolean(checked) })
                }
              />
              <Label htmlFor="isPublic">
                Allow others to use this product
              </Label>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="folder">Folder (optional)</Label>
              <Select
                value={newProduct.folderId || (selectedFolderId || '')}
                onValueChange={(value) => setNewProduct({ ...newProduct, folderId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select folder (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No folder (root)</SelectItem>
                  {availableFolders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>{folder.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="usageStartDate">Usage Start Date</Label>
                <Input
                  id="usageStartDate"
                  type="date"
                  value={newProduct.usageStartDate}
                  onChange={(e) => setNewProduct({ ...newProduct, usageStartDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="usageEndDate">Usage End Date</Label>
                <Input
                  id="usageEndDate"
                  type="date"
                  value={newProduct.usageEndDate}
                  onChange={(e) => setNewProduct({ ...newProduct, usageEndDate: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddProductDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateProduct} disabled={loading}>
              {loading ? "Adding..." : "Add Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Move to Folder Dialog */}
      <Dialog open={showMoveToPFolderDialog} onOpenChange={setShowMoveToPFolderDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Move to Folder</DialogTitle>
            <DialogDescription>
              Select a folder to move "{productToMove?.name}" to.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="moveToFolder">Select Folder</Label>
              <Select
                value={selectedMoveToFolder}
                onValueChange={setSelectedMoveToFolder}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a folder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Root (No folder)</SelectItem>
                  {availableFolders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>{folder.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMoveToPFolderDialog(false)}>Cancel</Button>
            <Button onClick={handleMoveToFolder} disabled={loading}>
              {loading ? "Moving..." : "Move Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Product Name Warning Dialog */}
      <Dialog open={showNameWarning} onOpenChange={setShowNameWarning}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Product Already Exists
            </DialogTitle>
            <DialogDescription>
              A product with this name already exists in the database. You can still add your product if you wish.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="rounded-md border p-4">
              <h4 className="text-sm font-medium">Existing products with the same name:</h4>
              {existingProducts.map((product, index) => (
                <div key={product.id} className="mt-2">
                  <p className="text-sm">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    By {product.users?.name || product.users?.email || 'Unknown user'}
                  </p>
                  {index < existingProducts.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNameWarning(false)}>Cancel</Button>
            <Button 
              onClick={() => {
                setShowNameWarning(false)
                const tagsArray = newProduct.tags
                  ? newProduct.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
                  : []
                createProduct(tagsArray)
              }}
              disabled={loading}
            >
              Add Anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Filter Dialog */}
      <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Filter Products</DialogTitle>
            <DialogDescription>
              Set filters to narrow down your product search.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
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
            
            <div className="flex items-center gap-2">
              <Checkbox 
                id="isPublicOnly"
                checked={searchFilters.isPublicOnly}
                onCheckedChange={(checked) => 
                  setSearchFilters(prev => ({ ...prev, isPublicOnly: Boolean(checked) }))
                }
              />
              <Label htmlFor="isPublicOnly">
                Show only public products
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
      
      {/* Send Message Dialog */}
      <Dialog open={showSendMessageDialog} onOpenChange={setShowSendMessageDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
            <DialogDescription>
              {selectedProductForMessage 
                ? `Send a message to the owner of ${selectedProductForMessage.name}`
                : 'Send a message to another user'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {!selectedProductForMessage && (
              <div className="grid gap-2">
                <Label htmlFor="recipient">Recipient</Label>
                <Select
                  value={newMessage.recipientId}
                  onValueChange={(value) => setNewMessage({ ...newMessage, recipientId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a recipient" />
                  </SelectTrigger>
                  <SelectContent>
                    {users
                      .filter(user => user.id !== currentUser?.id)
                      .map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name || user.email}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={newMessage.subject}
                onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                placeholder="Enter message subject"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="content">Message</Label>
              <Textarea
                id="content"
                value={newMessage.content}
                onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                placeholder="Enter your message"
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSendMessageDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage} disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
