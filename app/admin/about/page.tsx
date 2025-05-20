"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

// Define the form schema
const aboutFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  mission: z.string().min(1, "Mission is required"),
  vision: z.string().min(1, "Vision is required"),
  history: z.string().min(1, "History is required"),
})

type AboutFormValues = z.infer<typeof aboutFormSchema>

export default function AboutPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [aboutData, setAboutData] = useState<AboutFormValues | null>(null)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Initialize the form
  const form = useForm<AboutFormValues>({
    resolver: zodResolver(aboutFormSchema),
    defaultValues: {
      title: "",
      description: "",
      mission: "",
      vision: "",
      history: "",
    },
  })

  // Fetch existing about data
  useEffect(() => {
    async function fetchAboutData() {
      try {
        const response = await fetch("/api/about")
        const data = await response.json()

        if (data && data.length > 0) {
          const aboutInfo = data[0]
          setAboutData(aboutInfo)
          form.reset({
            title: aboutInfo.title || "",
            description: aboutInfo.description || "",
            mission: aboutInfo.mission || "",
            vision: aboutInfo.vision || "",
            history: aboutInfo.history || "",
          })
        }
      } catch (error) {
        console.error("Error fetching about data:", error)
        toast({
          title: "Error",
          description: "Failed to load about data",
          variant: "destructive",
        })
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchAboutData()
  }, [form, toast])

  // Handle form submission
  async function onSubmit(values: AboutFormValues) {
    setIsLoading(true)

    try {
      const url = aboutData?._id ? `/api/about/${aboutData._id}` : "/api/about"
      const method = aboutData?._id ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to save about data")
      }

      toast({
        title: "Success",
        description: "About information has been saved",
      })

      router.refresh()
    } catch (error) {
      console.error("Error saving about data:", error)
      toast({
        title: "Error",
        description: "Failed to save about data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">About Information</h3>
        <p className="text-sm text-muted-foreground">
          Manage the about page content including mission, vision, and history.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About Page Content</CardTitle>
          <CardDescription>This information will be displayed on the about page of the school website.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="About Our School" {...field} />
                    </FormControl>
                    <FormDescription>The main title for the about page.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a general description about the school..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>A general overview of the school.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mission</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Our mission is to..." className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormDescription>The school's mission statement.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vision"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vision</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Our vision is to..." className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormDescription>The school's vision for the future.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="history"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>History</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Our school was founded..." className="min-h-[150px]" {...field} />
                    </FormControl>
                    <FormDescription>The history and background of the school.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <p className="text-xs text-muted-foreground">
            Last updated: {aboutData?.updatedAt ? new Date(aboutData.updatedAt).toLocaleString() : "Never"}
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
