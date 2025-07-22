"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Sample asset data
const sampleAssets = [
  { id: 1, name: "Marketing Presentation", type: "Presentation", date: "2023-04-15" },
  { id: 2, name: "Q1 Financial Report", type: "Document", date: "2023-04-10" },
  { id: 3, name: "Product Roadmap", type: "Spreadsheet", date: "2023-04-05" },
  { id: 4, name: "Brand Guidelines", type: "Document", date: "2023-03-28" },
  { id: 5, name: "Customer Survey Results", type: "Spreadsheet", date: "2023-03-20" },
  { id: 6, name: "Team Photo", type: "Image", date: "2023-03-15" },
]

export function AssetPageContent() {
  const [assets, setAssets] = React.useState(sampleAssets)
  const [newAsset, setNewAsset] = React.useState({ name: "", description: "", type: "" })
  const [open, setOpen] = React.useState(false)

  const handleCreateAsset = () => {
    if (!newAsset.name || !newAsset.type) return

    const asset = {
      id: assets.length + 1,
      name: newAsset.name,
      type: newAsset.type,
      date: new Date().toISOString().split("T")[0],
    }

    setAssets([asset, ...assets])
    setNewAsset({ name: "", description: "", type: "" })
    setOpen(false)
  }

  const handleUpdateAsset = () => {
    // Update asset logic here
  }

  return (
    <div className="p-4">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Assets</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Asset
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Asset</DialogTitle>
              <DialogDescription>Fill in the details to create a new asset.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                  placeholder="Asset name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Input
                  id="type"
                  value={newAsset.type}
                  onChange={(e) => setNewAsset({ ...newAsset, type: e.target.value })}
                  placeholder="Document, Image, etc."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newAsset.description}
                  onChange={(e) => setNewAsset({ ...newAsset, description: e.target.value })}
                  placeholder="Describe the asset"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateAsset}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {assets.map((asset) => (
          <Card key={asset.id}>
            <CardHeader>
              <CardTitle>{asset.name}</CardTitle>
              <CardDescription>{asset.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Created on {asset.date}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                View
              </Button>
              <Button variant="outline" size="sm">
                Move
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
