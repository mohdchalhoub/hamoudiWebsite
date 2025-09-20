"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, Image as ImageIcon, Video, Play } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { uploadImage } from "@/lib/storage"

interface MediaItem {
  id: string
  url: string
  type: 'image' | 'video'
  name?: string
}

interface MultipleMediaUploadProps {
  value: MediaItem[]
  onChange: (media: MediaItem[]) => void
  disabled?: boolean
  maxItems?: number
}

export function MultipleMediaUpload({ 
  value = [], 
  onChange, 
  disabled = false, 
  maxItems = 10 
}: MultipleMediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (files: FileList) => {
    if (value.length + files.length > maxItems) {
      alert(`Maximum ${maxItems} media items allowed`)
      return
    }

    setIsUploading(true)
    const newMediaItems: MediaItem[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Validate file type
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
          alert(`File ${file.name} is not a supported image or video format`)
          continue
        }

        // Validate file size (10MB for images, 50MB for videos)
        const maxSize = file.type.startsWith('video/') ? 50 * 1024 * 1024 : 10 * 1024 * 1024
        if (file.size > maxSize) {
          alert(`File ${file.name} is too large. Max size: ${file.type.startsWith('video/') ? '50MB' : '10MB'}`)
          continue
        }

        try {
          // Try to upload to Supabase Storage first
          const uploadedUrl = await uploadImage(file)
          newMediaItems.push({
            id: `${Date.now()}-${i}`,
            url: uploadedUrl,
            type: file.type.startsWith('video/') ? 'video' : 'image',
            name: file.name
          })
        } catch (storageError) {
          console.warn('Storage upload failed, falling back to data URL:', storageError)
          // Fallback to data URL if storage fails
          const reader = new FileReader()
          reader.onload = (e) => {
            const dataUrl = e.target?.result as string
            newMediaItems.push({
              id: `${Date.now()}-${i}`,
              url: dataUrl,
              type: file.type.startsWith('video/') ? 'video' : 'image',
              name: file.name
            })
          }
          reader.readAsDataURL(file)
        }
      }

      onChange([...value, ...newMediaItems])
    } catch (error: any) {
      console.error('Error processing files:', error)
      alert(`Error processing files: ${error.message}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFileSelect(files)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleClick = () => {
    if (disabled) return
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files)
    }
    // Reset the input so the same file can be selected again
    e.target.value = ''
  }

  const removeMedia = (id: string) => {
    onChange(value.filter(item => item.id !== id))
  }

  const addFromUrl = (url: string, type: 'image' | 'video') => {
    if (value.length >= maxItems) {
      alert(`Maximum ${maxItems} media items allowed`)
      return
    }

    const newItem: MediaItem = {
      id: `${Date.now()}`,
      url: url.trim(),
      type,
      name: `Media ${value.length + 1}`
    }

    onChange([...value, newItem])
  }

  const getFileTypeIcon = (type: 'image' | 'video') => {
    return type === 'video' ? <Video className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Product Media ({value.length}/{maxItems})</Label>
        <Badge variant="outline" className="text-xs">
          Images & Videos
        </Badge>
      </div>
      
      {/* Media Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((item) => (
            <div key={item.id} className="relative group">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  {item.type === 'image' ? (
                    <img 
                      src={item.url} 
                      alt={item.name || 'Product media'} 
                      className="w-full h-32 object-cover"
                    />
                  ) : (
                    <div className="relative w-full h-32 bg-gray-100 flex items-center justify-center">
                      <video 
                        src={item.url} 
                        className="w-full h-full object-cover"
                        muted
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  )}
                  
                  {/* Media type badge */}
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="text-xs">
                      {getFileTypeIcon(item.type)}
                      <span className="ml-1 capitalize">{item.type}</span>
                    </Badge>
                  </div>

                  {/* Remove button */}
                  {!disabled && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeMedia(item.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </CardContent>
              </Card>
              
              {/* Media name */}
              {item.name && (
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {item.name}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Area - Enhanced for Mobile */}
      {value.length < maxItems && (
        <Card 
          className={`border-2 border-dashed transition-colors ${
            dragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary/50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                {isUploading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                ) : (
                  <Upload className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {isUploading ? 'Uploading...' : 'Upload media files'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Drag and drop or tap to select images and videos
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Images: JPG, PNG, GIF (max 10MB) • Videos: MP4, WebM (max 50MB)
                </p>
              </div>
              
              {/* Mobile-friendly upload button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2 min-h-[44px] min-w-[120px]" // Minimum touch target size
                onClick={(e) => {
                  e.stopPropagation()
                  handleClick()
                }}
                disabled={disabled || isUploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose Files
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hidden file input - Enhanced for mobile */}
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
        // Mobile-specific attributes
        capture="environment" // Use back camera on mobile
        style={{ 
          position: 'absolute',
          left: '-9999px',
          opacity: 0,
          pointerEvents: 'none'
        }}
      />

      {/* Manual URL inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="image-url">Add Image URL</Label>
          <div className="flex space-x-2">
            <Input
              id="image-url"
              type="url"
              placeholder="https://example.com/image.jpg"
              disabled={disabled}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  const input = e.target as HTMLInputElement
                  if (input.value.trim()) {
                    addFromUrl(input.value, 'image')
                    input.value = ''
                  }
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={disabled}
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement
                if (input.value.trim()) {
                  addFromUrl(input.value, 'image')
                  input.value = ''
                }
              }}
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="video-url">Add Video URL</Label>
          <div className="flex space-x-2">
            <Input
              id="video-url"
              type="url"
              placeholder="https://example.com/video.mp4"
              disabled={disabled}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  const input = e.target as HTMLInputElement
                  if (input.value.trim()) {
                    addFromUrl(input.value, 'video')
                    input.value = ''
                  }
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={disabled}
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement
                if (input.value.trim()) {
                  addFromUrl(input.value, 'video')
                  input.value = ''
                }
              }}
            >
              <Video className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}