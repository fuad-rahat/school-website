"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { ImageUpload } from "@/components/image-upload"

export default function NewResultPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    year: new Date().getFullYear().toString(),
    description: "",
    fileUrl: "",
    image: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (url: string) => {
    setFormData((prev) => ({ ...prev, image: url }))
  }

  const handleFileChange = (url: string) => {
    setFormData((prev) => ({ ...prev, fileUrl: url }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to create result")

      toast.success("Result created successfully")
      router.push("/admin/results")
      router.refresh()
    } catch (error) {
      console.error("Error creating result:", error)
      toast.error("Failed to create result")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Add New Result</h1>
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Result Information</CardTitle>
            <CardDescription>Enter the details for the new result.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input id="year" name="year" value={formData.year} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fileUrl">Result File</Label>
              <ImageUpload value={formData.fileUrl} onChange={handleFileChange} />
              <p className="text-xs text-muted-foreground mt-1">Upload PDF or image file of the result</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Cover Image (Optional)</Label>
              <ImageUpload value={formData.image} onChange={handleImageChange} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Result
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
