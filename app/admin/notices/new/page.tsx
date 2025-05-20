"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { ImageUpload } from "@/components/image-upload"

interface NoticeFormData {
  title: string
  date: string
  time: string
  category: string
  priority: "High" | "Medium" | "Low"
  content: string
  attachments: string[]
  image?: string
}

export default function NewNoticePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notice, setNotice] = useState<NoticeFormData>({
    title: "",
    date: new Date().toISOString().split("T")[0],
    time: "12:00",
    category: "Events",
    priority: "Medium",
    content: "",
    attachments: [],
    image: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNotice((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNotice((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (url: string) => {
    setNotice((prev) => ({ ...prev, image: url }))
  }

  const handleAttachmentChange = (index: number, url: string) => {
    const updatedAttachments = [...notice.attachments]
    updatedAttachments[index] = url
    setNotice((prev) => ({ ...prev, attachments: updatedAttachments }))
  }

  const addAttachment = () => {
    setNotice((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ""],
    }))
  }

  const removeAttachment = (index: number) => {
    const updatedAttachments = [...notice.attachments]
    updatedAttachments.splice(index, 1)
    setNotice((prev) => ({ ...prev, attachments: updatedAttachments }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/notices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notice),
      })

      if (response.ok) {
        toast.success("Notice added successfully")
        router.push("/admin/notices")
        router.refresh()
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to add notice")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Notice</h1>
        <p className="text-muted-foreground">Create a new notice for the school website.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Notice Information</CardTitle>
            <CardDescription>Enter the details of the new notice.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={notice.title} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" value={notice.date} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" name="time" type="time" value={notice.time} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={notice.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Events">Events</SelectItem>
                    <SelectItem value="Academic">Academic</SelectItem>
                    <SelectItem value="Administrative">Administrative</SelectItem>
                    <SelectItem value="Arts">Arts</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Guidance">Guidance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={notice.priority}
                onValueChange={(value) => handleSelectChange("priority", value as "High" | "Medium" | "Low")}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea id="content" name="content" value={notice.content} onChange={handleChange} rows={6} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Cover Image (Optional)</Label>
              <ImageUpload value={notice.image || ""} onChange={handleImageChange} />
            </div>

            <div className="space-y-2">
              <Label>Attachments (Optional)</Label>
              {notice.attachments.map((_, index) => (
                <div key={index} className="mt-2">
                  <div className="flex items-center justify-between">
                    <Label>Attachment {index + 1}</Label>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeAttachment(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <ImageUpload
                    value={notice.attachments[index]}
                    onChange={(url) => handleAttachmentChange(index, url)}
                    className="mt-1"
                  />
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" className="mt-2" onClick={addAttachment}>
                <Plus className="h-4 w-4 mr-2" /> Add Attachment
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/notices")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Notice"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
