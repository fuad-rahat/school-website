"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Pencil, Trash2 } from "lucide-react"
import type { Activity } from "@/lib/models"
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

export default function ActivitiesPage() {
  const router = useRouter()
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    async function fetchActivities() {
      try {
        const response = await fetch("/api/activities")
        if (response.ok) {
          const data = await response.json()
          setActivities(data)
        } else {
          console.error("Failed to fetch activities")
          toast.error("Failed to load activities")
        }
      } catch (error) {
        console.error("Error fetching activities:", error)
        toast.error("Error loading activities")
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivities()
  }, [])

  const filteredActivities = activities.filter(
    (activity) =>
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDeleteClick = (id: string) => {
    setDeleteId(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return

    try {
      const response = await fetch(`/api/activities/${deleteId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setActivities(activities.filter((activity) => activity._id !== deleteId))
        toast.success("Activity deleted successfully")
      } else {
        console.error("Failed to delete activity")
        toast.error("Failed to delete activity")
      }
    } catch (error) {
      console.error("Error deleting activity:", error)
      toast.error("Error deleting activity")
    } finally {
      setIsDeleteDialogOpen(false)
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Activities</h1>
        <Button onClick={() => router.push("/admin/activities/new")}>
          <Plus className="mr-2 h-4 w-4" /> Add Activity
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Activities</CardTitle>
          <CardDescription>View, edit, and delete school activities.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search activities..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="text-center py-4">Loading activities...</div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-4">No activities found.</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Coach</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivities.map((activity) => (
                    <TableRow key={activity._id}>
                      <TableCell className="font-medium">{activity.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{activity.category}</Badge>
                      </TableCell>
                      <TableCell>{activity.location}</TableCell>
                      <TableCell>{activity.coach}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/admin/activities/edit/${activity._id}`)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(activity._id as string)}>
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
              This action cannot be undone. This will permanently delete the activity.
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
