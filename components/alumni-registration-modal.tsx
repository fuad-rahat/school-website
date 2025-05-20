"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function AlumniRegistrationModal({
  open,
  onOpenChange,
}: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
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
        setImageUrl(data.url)
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const graduationYear = Number.parseInt(formData.get("batch") as string)
    const profession = formData.get("profession") as string

    try {
      const response = await fetch("/api/alumni/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          graduationYear,
          profession: profession || undefined,
          image: imageUrl || undefined,
          // These alumni will not be featured by default
          featured: false,
        }),
      })

      if (response.ok) {
        toast.success("Registration successful! Your profile will be reviewed by an admin.")
        onOpenChange(false)
        // Reset form
        e.currentTarget.reset()
        setImageUrl("")
      } else {
        const error = await response.json()
        toast.error(error.message || "Registration failed")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Alumni Registration</DialogTitle>
          <DialogDescription>
            Register as an alumni of Brightwood Academy. Your profile will be reviewed by an admin before being
            published.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="batch">Batch (Graduation Year)</Label>
              <Input id="batch" name="batch" type="number" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="profession">Current Job (Optional)</Label>
              <Input id="profession" name="profession" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Profile Image (Optional)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Select Image"
                  )}
                </Button>
                {imageUrl && <div className="ml-2 text-sm text-green-600">Image uploaded successfully</div>}
              </div>
              {imageUrl && (
                <div className="mt-2">
                  <img
                    src={imageUrl || "/placeholder.svg"}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting || isUploading}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
