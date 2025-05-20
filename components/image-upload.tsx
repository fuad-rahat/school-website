"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  className?: string
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB")
      return
    }

    setIsUploading(true)

    try {
      // Create FormData for server upload
      const formData = new FormData()
      formData.append("image", file)

      // Using our server API route instead of directly calling imgBB
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        onChange(data.url)
        toast.success("Image uploaded successfully")
      } else {
        toast.error(data.error || "Failed to upload image")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Error uploading image")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-4">
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Select Image"
          )}
        </Button>
        {value && <div className="text-sm text-green-600">Image uploaded successfully</div>}
      </div>
      {value && (
        <div className="mt-2">
          <img src={value || "/placeholder.svg"} alt="Preview" className="h-20 w-20 object-cover rounded-md" />
        </div>
      )}
    </div>
  )
}
