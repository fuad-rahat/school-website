import type { Metadata } from "next"
import Link from "next/link"
import { CalendarDays, FileText } from "lucide-react"
import clientPromise from "@/lib/mongodb"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "Notices - School Website",
  description: "Important notices and announcements",
}

interface Notice {
  _id: string
  title: string
  date: string
  category: string
  content: string
  fileUrl?: string
  attachments?: string[]
  priority?: "High" | "Medium" | "Low"
}

async function getNotices() {
  try {
    const client = await clientPromise
    const db = client.db("school")

    // Debug log
    console.log("Fetching notices from database")

    const notices = await db.collection("notices").find({}).sort({ date: -1 }).toArray()

    // Debug log
    console.log(`Fetched ${notices.length} notices from database`)

    return JSON.parse(JSON.stringify(notices))
  } catch (error) {
    console.error("Error fetching notices:", error)
    return []
  }
}

export default async function NoticePage() {
  const notices = await getNotices()

  // Debug log
  console.log("Notices in component:", notices.length)

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">Notices & Announcements</h1>

      {notices.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium">No notices found</h3>
          <p className="text-muted-foreground">Check back later for new announcements.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {notices.map((notice) => (
            <Card
              key={notice._id}
              id={notice._id.toString()}
              className={`
                ${
                  notice.priority === "High"
                    ? "border-red-500"
                    : notice.priority === "Medium"
                      ? "border-yellow-500"
                      : "border-green-500"
                }
                ${notice.priority ? "border-l-4" : ""}
              `}
            >
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  <time dateTime={notice.date}>{formatDate(notice.date)}</time>
                </div>
                <CardTitle className="mt-2">{notice.title}</CardTitle>
                <CardDescription>{notice.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3">{notice.content}</p>
              </CardContent>
              {(notice.fileUrl || (notice.attachments && notice.attachments.length > 0)) && (
                <CardFooter>
                  <div className="w-full space-y-2">
                    {notice.fileUrl && (
                      <Button variant="outline" asChild className="w-full">
                        <Link href={notice.fileUrl} target="_blank" rel="noopener noreferrer">
                          <FileText className="mr-2 h-4 w-4" />
                          Download Attachment
                        </Link>
                      </Button>
                    )}
                    {notice.attachments &&
                      notice.attachments.map((attachment, index) => (
                        <Button key={index} variant="outline" asChild className="w-full">
                          <Link href={attachment} target="_blank" rel="noopener noreferrer">
                            <FileText className="mr-2 h-4 w-4" />
                            Attachment {index + 1}
                          </Link>
                        </Button>
                      ))}
                  </div>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}
