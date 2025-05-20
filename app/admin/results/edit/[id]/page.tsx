"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

interface Result {
  _id: string
  title: string
  year: string
  description: string
  fileUrl?: string
}

export default function EditResultPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Result>({
    _id: "",
    title: "",
    year: "",
    description: "",
    fileUrl: "",
  })

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await fetch(`/api/results/${id}`)
        if (!response.ok) throw new Error("Failed to fetch result")
        const data = await response.json()
        setFormData(data)
      } catch (error) {
        console.error("Error fetching result:", error)
        toast({
          title: "Error",
          description: "Failed to load result",
          variant: "destructive",
        })
        router.push("/admin/results")
      } finally {
        setLoading(false)
      }
    }

    fetchResult()
  }, [id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/results/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to update result")

      toast({
        title: "Success",
        description: "Result updated successfully",
      })
      router.push("/admin/results")
      router.refresh()
    } catch (error) {
      console.error("Error updating result:", error)
      toast({
        title: "Error",
        description: "Failed to update result",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Edit Result</h1>
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Result Information</CardTitle>
            <CardDescription>Update the details for this result.</CardDescription>
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
              <Label htmlFor="fileUrl">File URL (Optional)</Label>
              <Input
                id="fileUrl"
                name="fileUrl"
                value={formData.fileUrl || ""}
                onChange={handleChange}
                placeholder="https://example.com/result.pdf"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
