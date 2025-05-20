"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import type { Alumni } from "@/lib/models"
import { X, Plus } from "lucide-react"
import { toast } from "sonner"

export default function EditAlumniPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alumni, setAlumni] = useState<Partial<Alumni>>({
    name: "",
    graduationYear: 0,
    profession: "",
    company: "",
    location: "",
    achievements: [""],
    quote: "",
    image: "",
    featured: false,
  })

  useEffect(() => {
    async function fetchAlumni() {
      try {
        const response = await fetch(`/api/alumni/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setAlumni(data)
        } else {
          toast.error("Failed to fetch alumni details")
          router.push("/admin/alumni")
        }
      } catch (error) {
        console.error("Error fetching alumni:", error)
        toast.error("An error occurred while fetching alumni details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAlumni()
  }, [params.id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setAlumni((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAlumni((prev) => ({ ...prev, [name]: Number.parseInt(value) || 0 }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setAlumni((prev) => ({ ...prev, featured: checked }))
  }

  const handleAchievementChange = (index: number, value: string) => {
    const updatedAchievements = [...(alumni.achievements || [])]
    updatedAchievements[index] = value
    setAlumni((prev) => ({ ...prev, achievements: updatedAchievements }))
  }

  const addAchievement = () => {
    setAlumni((prev) => ({
      ...prev,
      achievements: [...(prev.achievements || []), ""],
    }))
  }

  const removeAchievement = (index: number) => {
    const updatedAchievements = [...(alumni.achievements || [])]
    updatedAchievements.splice(index, 1)
    setAlumni((prev) => ({ ...prev, achievements: updatedAchievements }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/alumni/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(alumni),
      })

      if (response.ok) {
        toast.success("Alumni updated successfully")
        router.push("/admin/alumni")
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to update alumni")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading alumni details...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Alumni</h1>
        <p className="text-muted-foreground">Update alumni information.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Alumni Information</CardTitle>
            <CardDescription>Edit the details of the alumni.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={alumni.name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="graduationYear">Graduation Year</Label>
                <Input
                  id="graduationYear"
                  name="graduationYear"
                  type="number"
                  value={alumni.graduationYear}
                  onChange={handleNumberChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="profession">Profession</Label>
                <Input id="profession" name="profession" value={alumni.profession} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company/Organization</Label>
                <Input id="company" name="company" value={alumni.company} onChange={handleChange} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" value={alumni.location} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                value={alumni.image}
                onChange={handleChange}
                placeholder="/placeholder.svg?height=300&width=300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quote">Quote</Label>
              <Textarea id="quote" name="quote" value={alumni.quote} onChange={handleChange} rows={3} />
            </div>

            <div className="space-y-2">
              <Label>Achievements</Label>
              {alumni.achievements?.map((achievement, index) => (
                <div key={index} className="flex items-center gap-2 mt-2">
                  <Input
                    value={achievement}
                    onChange={(e) => handleAchievementChange(index, e.target.value)}
                    placeholder={`Achievement ${index + 1}`}
                  />
                  {alumni.achievements && alumni.achievements.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeAchievement(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" className="mt-2" onClick={addAchievement}>
                <Plus className="h-4 w-4 mr-2" /> Add Achievement
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="featured" checked={alumni.featured} onCheckedChange={handleCheckboxChange} />
              <Label htmlFor="featured">Feature this alumni on the website</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/alumni")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Update Alumni"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
