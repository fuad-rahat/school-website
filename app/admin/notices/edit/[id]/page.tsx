"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import { uploadImage } from "@/app/actions/upload-image"

interface Notice {
  _id?: string
  title: string
  date: string
  time: string
  category: string
  priority: "High" | "Medium" | "Low"
  content: string
  attachments?: string[]
}

export default function EditNoticePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [notice, setNotice] = useState<Notice>({
    title: "",
    date: "",
    time: "",
    category: "",
    priority: "Medium",
    content: "",
    attachments: [],
  })

  useEffect(() => {
    async function fetchNotice() {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/notices/${params.id}`)

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()

        // Format date for input if it exists
        if (data.date && typeof data.date === "string") {
          const dateObj = new Date(data.date)
          if (!isNaN(dateObj.getTime())) {
            data.date = dateObj.toISOString().split("T")[0]
          }
        }

        setNotice(data)
      } catch (error) {
        console.error("Error fetching notice:", error)
        toast.error("Failed to load notice details. Please try again.")
        router.push("/admin/notices")
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotice()
  }, [params.id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNotice((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNotice((prev) => ({ ...prev, [name]: value }))
  }

  const handleAttachmentChange = (index: number, value: string) => {
    const updatedAttachments = [...(notice.attachments || [])]
    updatedAttachments[index] = value
    setNotice((prev) => ({ ...prev, attachments: updatedAttachments }))
  }

  const addAttachment = () => {
    setNotice((prev) => ({
      ...prev,
      attachments: [...(prev.attachments || []), ""],
    }))
  }

  const removeAttachment = (index: number) => {
    const updatedAttachments = [...(notice.attachments || [])]
    updatedAttachments.splice(index, 1)
    setNotice((prev) => ({ ...prev, attachments: updatedAttachments }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)

      // Create FormData and append the file
      const formData = new FormData()
      formData.append("image", file)

      // Use the server action instead of direct API call
      const result = await uploadImage(formData)

      if (!result.success) {
        throw new Error(result.error || "Failed to upload file")
      }

      // Update the specific attachment
      const updatedAttachments = [...(notice.attachments || [])]
      updatedAttachments[index] = result.url
      setNotice((prev) => ({ ...prev, attachments: updatedAttachments }))

      toast.success("File uploaded successfully")

      // Reset the file input
      if (fileInputRefs.current[index]) {
        fileInputRefs.current[index]!.value = ""
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      toast.error(error instanceof Error ? error.message : "Failed to upload file. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/notices/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notice),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update notice")
      }

      toast.success("Notice updated successfully")
      router.push("/admin/notices")
      router.refresh()
    } catch (error) {
      console.error("Error updating notice:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update notice. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Notice</h1>
        <p className="text-muted-foreground">Update notice information.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Notice Information</CardTitle>
            <CardDescription>Edit the details of the notice.</CardDescription>
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
              <Label>Attachments (Optional)</Label>
              {notice.attachments?.map((attachment, index) => (
                <div key={index} className="flex flex-col gap-2 mt-2">
                  <div className="flex items-center gap-2">
                    <Input
                      value={attachment}
                      onChange={(e) => handleAttachmentChange(index, e.target.value)}
                      placeholder={`Attachment ${index + 1} URL`}
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeAttachment(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      onChange={(e) => handleFileUpload(e, index)}
                      disabled={isUploading}
                      ref={(el) => (fileInputRefs.current[index] = el)}
                    />
                    {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
                  </div>
                  {attachment && attachment.match(/\.(jpeg|jpg|gif|png)$/i) && (
                    <div className="relative w-32 h-32 rounded-md overflow-hidden border">
                      <Image
                        src={attachment || "/placeholder.svg"}
                        alt={`Attachment ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
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
                "Update Notice"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
