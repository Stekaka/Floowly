"use client"

import { useState, useRef } from "react"
import { Camera, X, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AvatarCardProps {
  avatar?: string
  fullName: string
  onAvatarChange: (file: File) => Promise<void>
  onAvatarRemove: () => void
  isUploading: boolean
}

export function AvatarCard({ 
  avatar, 
  fullName, 
  onAvatarChange, 
  onAvatarRemove, 
  isUploading 
}: AvatarCardProps) {
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      onAvatarChange(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
        <CardDescription>
          Upload a new avatar or remove the current one
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              {avatar ? (
                <img
                  src={avatar}
                  alt={fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 text-muted-foreground">
                  <Camera className="w-full h-full" />
                </div>
              )}
            </div>
            {avatar && (
              <Button
                size="icon"
                variant="destructive"
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
                onClick={onAvatarRemove}
                disabled={isUploading}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{fullName}</p>
            <p className="text-xs text-muted-foreground">
              {avatar ? "Click to change" : "No avatar uploaded"}
            </p>
          </div>
        </div>

        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
            dragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50",
            isUploading && "opacity-50 cursor-not-allowed"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            disabled={isUploading}
          />
          
          {isUploading ? (
            <div className="space-y-2">
              <div className="w-6 h-6 mx-auto animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="w-6 h-6 mx-auto text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  {avatar ? "Change avatar" : "Upload avatar"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Drag and drop or click to select
                </p>
              </div>
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          Max file size: 5MB. Supported formats: JPG, PNG, GIF
        </p>
      </CardContent>
    </Card>
  )
}
