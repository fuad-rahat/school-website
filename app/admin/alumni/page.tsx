"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Pencil, Trash2, Star } from "lucide-react"
import type { Alumni } from "@/lib/models"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

export default function AlumniPage() {
  const router = useRouter()
  const [alumni, setAlumni] = useState<Alumni[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    async function fetchAlumni() {
      try {
        const response = await fetch("/api/alumni")
        if (response.ok) {
          const data = await response.json()
          setAlumni(data)
        } else {
          console.error("Failed to fetch alumni")
          toast.error("Failed to load alumni")
        }
      } catch (error) {
        console.error("Error fetching alumni:", error)
        toast.error("Error loading alumni")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAlumni()
  }, [])

  const filteredAlumni = alumni.filter(
    (alum) =>
      alum.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alum.profession?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alum.graduationYear.toString().includes(searchQuery),
  )

  const handleDeleteClick = (id: string) => {
    setDeleteId(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return

    try {
      const response = await fetch(`/api/alumni/${deleteId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setAlumni(alumni.filter((alum) => alum._id !== deleteId))
        toast.success("Alumni deleted successfully")
      } else {
        console.error("Failed to delete alumni")
        toast.error("Failed to delete alumni")
      }
    } catch (error) {
      console.error("Error deleting alumni:", error)
      toast.error("Error deleting alumni")
    } finally {
      setIsDeleteDialogOpen(false)
      setDeleteId(null)
    }
  }

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const response = await fetch(`/api/alumni/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ featured: !currentFeatured }),
      })

      if (response.ok) {
        setAlumni(alumni.map((alum) => (alum._id === id ? { ...alum, featured: !currentFeatured } : alum)))
        toast.success(`Alumni ${!currentFeatured ? "featured" : "unfeatured"} successfully`)
      } else {
        toast.error("Failed to update alumni")
      }
    } catch (error) {
      console.error("Error updating alumni:", error)
      toast.error("Error updating alumni")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Alumni</h1>
        <Button onClick={() => router.push("/admin/alumni/new")}>
          <Plus className="mr-2 h-4 w-4" /> Add Alumni
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Alumni</CardTitle>
          <CardDescription>View, edit, and delete alumni profiles.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search alumni..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="text-center py-4">Loading alumni...</div>
          ) : filteredAlumni.length === 0 ? (
            <div className="text-center py-4">No alumni found.</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Profession</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlumni.map((alum) => (
                    <TableRow key={alum._id}>
                      <TableCell className="font-medium">{alum.name}</TableCell>
                      <TableCell>{alum.graduationYear}</TableCell>
                      <TableCell>{alum.profession || "-"}</TableCell>
                      <TableCell>{alum.location || "-"}</TableCell>
                      <TableCell>
                        {alum.featured ? (
                          <Badge className="bg-yellow-500">Featured</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleFeatured(alum._id as string, !!alum.featured)}
                            title={alum.featured ? "Remove from featured" : "Add to featured"}
                          >
                            <Star className={`h-4 w-4 ${alum.featured ? "fill-yellow-500 text-yellow-500" : ""}`} />
                            <span className="sr-only">
                              {alum.featured ? "Remove from featured" : "Add to featured"}
                            </span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/admin/alumni/edit/${alum._id}`)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(alum._id as string)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the alumni profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
