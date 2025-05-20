"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { ImageUpload } from "@/components/image-upload"

interface TeacherFormData {
  name: string
  position: string
  image: string
  education: string
  experience: string
  email: string
  phone: string
  subjects: string[]
}

export default function NewTeacherPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [teacher, setTeacher] = useState<TeacherFormData>({
    name: "",
    position: "",
    image: "",
    education: "",
    experience: "",
    email: "",
    phone: "",
    subjects: [""],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTeacher((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (url: string) => {
    setTeacher((prev) => ({ ...prev, image: url }))
  }

  const handleSubjectChange = (index: number, value: string) => {
    const updatedSubjects = [...teacher.subjects]
    updatedSubjects[index] = value
    setTeacher((prev) => ({ ...prev, subjects: updatedSubjects }))
  }

  const addSubject = () => {
    setTeacher((prev) => ({
      ...prev,
      subjects: [...prev.subjects, ""],
    }))
  }

  const removeSubject = (index: number) => {
    const updatedSubjects = [...teacher.subjects]
    updatedSubjects.splice(index, 1)
    setTeacher((prev) => ({ ...prev, subjects: updatedSubjects }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/teachers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(teacher),
      })

      if (response.ok) {
        toast.success("Teacher added successfully")
        router.push("/admin/teachers")
        router.refresh()
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to add teacher")
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
        <h1 className="text-3xl font-bold tracking-tight">Add New Teacher</h1>
        <p className="text-muted-foreground">Create a new teacher profile.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Teacher Information</CardTitle>
            <CardDescription>Enter the details of the new teacher.</CardDescription>
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
              <Label htmlFor="image">Teacher Image</Label>
              <ImageUpload value={teacher.image} onChange={handleImageChange} />
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
              {teacher.subjects.map((subject, index) => (
                <div key={index} className="flex items-center gap-2 mt-2">
                  <Input
                    value={subject}
                    onChange={(e) => handleSubjectChange(index, e.target.value)}
                    placeholder={`Subject ${index + 1}`}
                    required
                  />
                  {teacher.subjects.length > 1 && (
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
                "Save Teacher"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
