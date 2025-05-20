"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import { uploadImage } from "@/app/actions/upload-image"

interface Teacher {
  _id?: string
  name: string
  position: string
  email: string
  phone: string
  subjects: string[]
  image?: string
  education?: string
  experience?: string
}

export default function EditTeacherPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [teacher, setTeacher] = useState<Teacher>({
    name: "",
    position: "",
    email: "",
    phone: "",
    subjects: [""],
    image: "",
    education: "",
    experience: "",
  })

  useEffect(() => {
    async function fetchTeacher() {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/teachers/${params.id}`)

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()
        setTeacher(data)
      } catch (error) {
        console.error("Error fetching teacher:", error)
        toast.error("Failed to load teacher details. Please try again.")
        router.push("/admin/teachers")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeacher()
  }, [params.id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTeacher((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubjectChange = (index: number, value: string) => {
    const updatedSubjects = [...(teacher.subjects || [])]
    updatedSubjects[index] = value
    setTeacher((prev) => ({ ...prev, subjects: updatedSubjects }))
  }

  const addSubject = () => {
    setTeacher((prev) => ({
      ...prev,
      subjects: [...(prev.subjects || []), ""],
    }))
  }

  const removeSubject = (index: number) => {
    const updatedSubjects = [...(teacher.subjects || [])]
    updatedSubjects.splice(index, 1)
    setTeacher((prev) => ({ ...prev, subjects: updatedSubjects }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        throw new Error(result.error || "Failed to upload image")
      }

      setTeacher((prev) => ({ ...prev, image: result.url }))
      toast.success("Image uploaded successfully")

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error(error instanceof Error ? error.message : "Failed to upload image. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/teachers/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(teacher),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update teacher")
      }

      toast.success("Teacher updated successfully")
      router.push("/admin/teachers")
      router.refresh()
    } catch (error) {
      console.error("Error updating teacher:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update teacher. Please try again.")
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
        <h1 className="text-3xl font-bold tracking-tight">Edit Teacher</h1>
        <p className="text-muted-foreground">Update teacher information.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Teacher Information</CardTitle>
            <CardDescription>Edit the details of the teacher.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={teacher.name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input id="position" name="position" value={teacher.position} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={teacher.email} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" value={teacher.phone} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Profile Image</Label>
              <div className="flex flex-col gap-4">
                {teacher.image && (
                  <div className="relative w-32 h-32 rounded-md overflow-hidden border">
                    <Image src={teacher.image || "/placeholder.svg"} alt={teacher.name} fill className="object-cover" />
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <Input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    ref={fileInputRef}
                  />
                  {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
                </div>
                <Input
                  id="image"
                  name="image"
                  value={teacher.image || ""}
                  onChange={handleChange}
                  placeholder="Or enter image URL directly"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <Textarea id="education" name="education" value={teacher.education} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Experience</Label>
                <Textarea
                  id="experience"
                  name="experience"
                  value={teacher.experience}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Subjects</Label>
              {teacher.subjects?.map((subject, index) => (
                <div key={index} className="flex items-center gap-2 mt-2">
                  <Input
                    value={subject}
                    onChange={(e) => handleSubjectChange(index, e.target.value)}
                    placeholder={`Subject ${index + 1}`}
                    required
                  />
                  {teacher.subjects && teacher.subjects.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeSubject(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" className="mt-2" onClick={addSubject}>
                <Plus className="h-4 w-4 mr-2" /> Add Subject
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/teachers")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Update Teacher"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
