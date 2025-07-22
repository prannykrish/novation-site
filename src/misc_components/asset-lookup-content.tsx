"use client"

import * as React from "react"
import { FileText, FileImage, PresentationIcon, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Asset, Category } from "@/types/database"

interface AssetCardProps {
  asset: Asset
  categories: Category[]
  onExpand: (asset: Asset) => void
}

// Helper function to get appropriate icon for asset type
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

// Helper function to truncate text with ellipsis
const truncateText = (text: string | undefined, maxLength: number = 40) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

export function AssetCard({ asset, categories, onExpand }: AssetCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 w-[75%]">
            {getAssetIcon(asset.type)}
            <CardTitle className="text-base truncate" title={asset.name}>
              {truncateText(asset.name, 40)}
            </CardTitle>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0 rounded-full opacity-70 hover:opacity-100 flex-shrink-0"
            onClick={() => onExpand(asset)}
          >
            <Maximize2 className="h-3.5 w-3.5" />
            <span className="sr-only">View Details</span>
          </Button>
        </div>
        <CardDescription className="text-xs truncate">{asset.type}</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        {asset.description && (
          <p 
            className="text-sm text-muted-foreground mt-1 mb-2 line-clamp-2"
            title={asset.description}
          >
            {truncateText(asset.description, 80)}
          </p>
        )}
        
        <div className="space-y-2">
          {asset.category && (
            <div className="text-xs flex items-start">
              <span className="text-muted-foreground inline-block min-w-[70px]">Category:</span>
              <span className="truncate max-w-[calc(100%-75px)]">
                {categories.find(c => c.id === asset.category)?.name || asset.category}
              </span>
            </div>
          )}
          
          {asset.tags && asset.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 max-h-[40px] overflow-hidden">
              {asset.tags.slice(0, 3).map((tag, i) => (
                <Badge key={i} variant="outline" className="text-xs truncate max-w-[100px]">
                  {tag}
                </Badge>
              ))}
              {asset.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">+{asset.tags.length - 3}</Badge>
              )}
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
  )
}

export { getAssetIcon }
