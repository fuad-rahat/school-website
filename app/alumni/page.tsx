"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, GraduationCap, MapPin, Search, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AlumniRegistrationModal } from "@/components/alumni-registration-modal"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

interface Alumni {
  _id: string
  name: string
  graduationYear: number
  profession?: string
  company?: string
  location?: string
  image?: string
  achievements?: string[]
  quote?: string
  featured?: boolean
}

export default function AlumniPage() {
  const [selectedYear, setSelectedYear] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false)
  const [featuredAlumni, setFeaturedAlumni] = useState<Alumni[]>([])
  const [alumniByYear, setAlumniByYear] = useState<Record<string, Alumni[]>>({})
  const [years, setYears] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchAlumni() {
      try {
        setIsLoading(true)

        // Fetch featured alumni
        const featuredResponse = await fetch("/api/alumni?featured=true&limit=3")
        if (!featuredResponse.ok) throw new Error("Failed to fetch featured alumni")
        const featuredData = await featuredResponse.json()
        setFeaturedAlumni(featuredData)

        // Fetch graduation years only first (for better performance)
        const yearsResponse = await fetch("/api/alumni/years")
        if (!yearsResponse.ok) throw new Error("Failed to fetch alumni years")
        const yearsData = await yearsResponse.json()

        // Sort years in descending order
        const sortedYears = yearsData.sort((a: string, b: string) => Number(b) - Number(a))
        setYears(sortedYears)

        // Set default selected year to the most recent one
        if (sortedYears.length > 0 && !selectedYear) {
          setSelectedYear(sortedYears[0])
        }
      } catch (error) {
        console.error("Error fetching alumni:", error)
        toast.error("Failed to load alumni data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAlumni()
  }, [])

  // Fetch alumni for a specific year when selected
  useEffect(() => {
    async function fetchAlumniByYear() {
      if (!selectedYear) return

      try {
        // Check if we already have this year's data
        if (alumniByYear[selectedYear]) return

        const response = await fetch(`/api/alumni?year=${selectedYear}`)
        if (!response.ok) throw new Error(`Failed to fetch alumni for year ${selectedYear}`)

        const data = await response.json()
        setAlumniByYear((prev) => ({
          ...prev,
          [selectedYear]: data,
        }))
      } catch (error) {
        console.error("Error fetching alumni by year:", error)
        toast.error(`Failed to load alumni for year ${selectedYear}`)
      }
    }

    fetchAlumniByYear()
  }, [selectedYear, alumniByYear])

  // Filter alumni based on search query
  const filteredAlumni =
    selectedYear && alumniByYear[selectedYear]
      ? alumniByYear[selectedYear].filter(
          (alumni) =>
            alumni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (alumni.profession && alumni.profession.toLowerCase().includes(searchQuery.toLowerCase())),
        )
      : []

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">প্রাক্তন শিক্ষার্থী নেটওয়ার্ক</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          শুকতারা বিদ্যানিকেতনের প্রাক্তন শিক্ষার্থীদের অর্জন এবং অবদান উদযাপন করা যারা বিশ্বে পার্থক্য তৈরি করে চলেছে।
        </p>
      </div>

      {isLoading ? (
        <section>
          <h2 className="text-2xl font-bold mb-6">বিশিষ্ট প্রাক্তন শিক্ষার্থী</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-[300px] w-full" />
                <CardHeader className="p-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ) : (
        featuredAlumni.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">বিশিষ্ট প্রাক্তন শিক্ষার্থী</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredAlumni.map((alumni) => (
                <Card key={alumni._id} className="overflow-hidden">
                  <div className="aspect-square relative bg-slate-100 flex items-center justify-center">
                    {alumni.image ? (
                      <img
                        src={alumni.image || "/placeholder.svg"}
                        alt={alumni.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="bg-primary/10 p-6 rounded-full">
                        <GraduationCap className="h-16 w-16 text-primary" />
                      </div>
                    )}
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-xl">{alumni.name}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <GraduationCap className="h-4 w-4 mr-1" />
                      <span>ব্যাচ {alumni.graduationYear}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-3">
                    <div className="space-y-1">
                      {alumni.profession && (
                        <div className="flex items-center text-sm">
                          <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{alumni.profession}</span>
                        </div>
                      )}
                      {alumni.company && (
                        <div className="flex items-center text-sm">
                          <Badge variant="outline" className="mr-1">
                            {alumni.company}
                          </Badge>
                        </div>
                      )}
                      {alumni.location && (
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{alumni.location}</span>
                        </div>
                      )}
                    </div>

                    {alumni.achievements && alumni.achievements.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold mb-1">প্রধান অর্জনসমূহ</h4>
                        <ul className="text-sm space-y-1 list-disc pl-5">
                          {alumni.achievements.map((achievement, index) => (
                            <li key={index}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {alumni.quote && (
                      <blockquote className="italic text-sm border-l-2 border-primary pl-3 mt-3">
                        "{alumni.quote}"
                      </blockquote>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )
      )}

      <section>
        <h2 className="text-2xl font-bold mb-6">প্রাক্তন শিক্ষার্থী ডিরেক্টরি</h2>
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
          <div className="w-full md:w-1/3">
            <label htmlFor="year-select" className="block text-sm font-medium mb-2">
              ব্যাচ নির্বাচন করুন
            </label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger id="year-select">
                <SelectValue placeholder="ব্যাচ নির্বাচন করুন" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    ব্যাচ {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-2/3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="শিক্ষার্থী খুঁজুন..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-6">
          {!selectedYear ? (
            <p className="text-center py-8 text-muted-foreground">Please select a batch to view alumni</p>
          ) : !alumniByYear[selectedYear] ? (
            <div className="py-8">
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <p className="text-center mt-4 text-muted-foreground">Loading alumni data...</p>
            </div>
          ) : (
            <>
              <h3 className="text-xl font-semibold mb-4">
                ব্যাচ {selectedYear} ({filteredAlumni.length} জন শিক্ষার্থী)
              </h3>
              {filteredAlumni.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">কোন শিক্ষার্থী পাওয়া যায়নি</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredAlumni.map((alumni) => (
                    <Card key={alumni._id} className="overflow-hidden">
                      <div className="flex items-center p-4">
                        {alumni.image ? (
                          <img
                            src={alumni.image || "/placeholder.svg"}
                            alt={alumni.name}
                            className="w-10 h-10 mr-3 flex-shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 mr-3 flex-shrink-0 bg-primary/10 rounded-full flex items-center justify-center">
                            <GraduationCap className="h-5 w-5 text-primary" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium">{alumni.name}</h4>
                          <p className="text-sm text-muted-foreground">{alumni.profession || ""}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section className="bg-slate-50 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">প্রাক্তন শিক্ষার্থী নেটওয়ার্কে যোগ দিন</h2>
        <p className="mb-4">
          আপনি কি শুকতারা বিদ্যানিকেতনের একজন প্রাক্তন শিক্ষার্থী? আমাদের প্রাক্তন শিক্ষার্থী নেটওয়ার্কে যোগ দিন এবং সংযোগ বজায় রাখুন। আপনার
          সাফল্যের গল্প শেয়ার করুন, স্কুলের অনুষ্ঠানে অংশ নিন, এবং বর্তমান শিক্ষার্থীদের মেন্টরিং করুন।
        </p>
        <div className="flex justify-center">
          <Button className="bg-primary text-white" onClick={() => setIsRegistrationModalOpen(true)}>
            রেজিস্ট্রেশন ফর্ম
          </Button>
        </div>
      </section>

      <AlumniRegistrationModal open={isRegistrationModalOpen} onOpenChange={setIsRegistrationModalOpen} />
    </div>
  )
}
