import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Award, Calendar, ArrowUpRight, GraduationCap, BookOpen, Bell } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

async function getStats() {
  try {
    const client = await clientPromise
    const db = client.db("school")

    const teacherCount = await db.collection("teachers").countDocuments()
    const noticeCount = await db.collection("notices").countDocuments()
    const eventCount = await db.collection("events").countDocuments()
    const studentCount = await db.collection("students").countDocuments()

    return {
      teacherCount,
      noticeCount,
      eventCount,
      studentCount,
    }
  } catch (error) {
    console.error("Error fetching stats:", error)
    return {
      teacherCount: 0,
      noticeCount: 0,
      eventCount: 0,
      studentCount: 0,
    }
  }
}

export default async function AdminDashboard() {
  const session = await getSession()
  const stats = await getStats()

  if (!session) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Authentication Error</h1>
          <p className="mb-4">You are not authenticated. Please log in again.</p>
          <Button asChild>
            <Link href="/admin/login">Go to Login</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session?.username}! Here's an overview of your school website.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-50 dark:bg-blue-950">
            <CardTitle className="text-sm font-medium">Teachers</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{stats.teacherCount}</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">Total faculty members</p>
              <Link href="/admin/teachers" className="text-xs text-blue-500 flex items-center">
                Manage <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-green-50 dark:bg-green-950">
            <CardTitle className="text-sm font-medium">Notices</CardTitle>
            <Bell className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{stats.noticeCount}</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">Published notices</p>
              <Link href="/admin/notices" className="text-xs text-green-500 flex items-center">
                Manage <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-amber-50 dark:bg-amber-950">
            <CardTitle className="text-sm font-medium">Activities</CardTitle>
            <Calendar className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{stats.eventCount}</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">School activities</p>
              <Link href="/admin/activities" className="text-xs text-amber-500 flex items-center">
                Manage <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-purple-50 dark:bg-purple-950">
            <CardTitle className="text-sm font-medium">Alumni</CardTitle>
            <GraduationCap className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{stats.studentCount}</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">Registered alumni</p>
              <Link href="/admin/alumni" className="text-xs text-purple-500 flex items-center">
                Manage <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="w-full">
        <Tabs defaultValue="actions" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="actions">Quick Actions</TabsTrigger>
            <TabsTrigger value="recent">Recent Updates</TabsTrigger>
          </TabsList>
          <TabsContent value="actions" className="w-full">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Link href="/admin/teachers/new">
                <Card className="h-full hover:bg-accent/50 transition-colors cursor-pointer">
                  <CardContent className="flex flex-col items-center justify-center p-4 md:p-6 text-center">
                    <Users className="h-8 w-8 md:h-10 md:w-10 text-blue-500 mb-2" />
                    <h3 className="font-medium text-sm md:text-base">Add Teacher</h3>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1 hidden md:block">
                      Create a new faculty profile
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/admin/notices/new">
                <Card className="h-full hover:bg-accent/50 transition-colors cursor-pointer">
                  <CardContent className="flex flex-col items-center justify-center p-4 md:p-6 text-center">
                    <Bell className="h-8 w-8 md:h-10 md:w-10 text-green-500 mb-2" />
                    <h3 className="font-medium text-sm md:text-base">Add Notice</h3>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1 hidden md:block">
                      Publish a new announcement
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/admin/activities/new">
                <Card className="h-full hover:bg-accent/50 transition-colors cursor-pointer">
                  <CardContent className="flex flex-col items-center justify-center p-4 md:p-6 text-center">
                    <Calendar className="h-8 w-8 md:h-10 md:w-10 text-amber-500 mb-2" />
                    <h3 className="font-medium text-sm md:text-base">Add Activity</h3>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1 hidden md:block">
                      Create a new school activity
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/admin/results/new">
                <Card className="h-full hover:bg-accent/50 transition-colors cursor-pointer">
                  <CardContent className="flex flex-col items-center justify-center p-4 md:p-6 text-center">
                    <Award className="h-8 w-8 md:h-10 md:w-10 text-red-500 mb-2" />
                    <h3 className="font-medium text-sm md:text-base">Add Result</h3>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1 hidden md:block">
                      Publish exam results
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/admin/alumni/new">
                <Card className="h-full hover:bg-accent/50 transition-colors cursor-pointer">
                  <CardContent className="flex flex-col items-center justify-center p-4 md:p-6 text-center">
                    <GraduationCap className="h-8 w-8 md:h-10 md:w-10 text-purple-500 mb-2" />
                    <h3 className="font-medium text-sm md:text-base">Add Alumni</h3>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1 hidden md:block">
                      Register a new alumni
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/admin/about">
                <Card className="h-full hover:bg-accent/50 transition-colors cursor-pointer">
                  <CardContent className="flex flex-col items-center justify-center p-4 md:p-6 text-center">
                    <BookOpen className="h-8 w-8 md:h-10 md:w-10 text-indigo-500 mb-2" />
                    <h3 className="font-medium text-sm md:text-base">About</h3>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1 hidden md:block">
                      Update school information
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </TabsContent>
          <TabsContent value="recent" className="w-full">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest updates across the website</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Bell className="h-8 w-8 text-primary p-1 bg-primary/10 rounded-full" />
                    <div>
                      <p className="font-medium">New notice added</p>
                      <p className="text-sm text-muted-foreground">Annual Sports Day Registration</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Users className="h-8 w-8 text-primary p-1 bg-primary/10 rounded-full" />
                    <div>
                      <p className="font-medium">Teacher profile updated</p>
                      <p className="text-sm text-muted-foreground">Dr. Michael Anderson</p>
                      <p className="text-xs text-muted-foreground">Yesterday</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Award className="h-8 w-8 text-primary p-1 bg-primary/10 rounded-full" />
                    <div>
                      <p className="font-medium">New achievement added</p>
                      <p className="text-sm text-muted-foreground">National Science Olympiad</p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
