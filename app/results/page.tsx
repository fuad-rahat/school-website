import type { Metadata } from "next"
import Link from "next/link"
import { FileText } from "lucide-react"
import clientPromise from "@/lib/mongodb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "ফলাফল - শুকতারা বিদ্যানিকেতন",
  description: "শিক্ষার্থীদের ফলাফল এবং অর্জন",
}

interface Result {
  _id: string
  title: string
  year: string
  description: string
  fileUrl?: string
}

async function getResults() {
  try {
    const client = await clientPromise
    const db = client.db()

    // Use the correct collection name
    const results = await db.collection("results").find({}).sort({ year: -1 }).toArray()

    return JSON.parse(JSON.stringify(results))
  } catch (error) {
    console.error("Error fetching results:", error)
    return []
  }
}

export default async function ResultsPage() {
  const results = await getResults()

  // Group results by year
  const resultsByYear = results.reduce((acc: Record<string, Result[]>, result: Result) => {
    const year = result.year
    if (!acc[year]) {
      acc[year] = []
    }
    acc[year].push(result)
    return acc
  }, {})

  // Sort years in descending order
  const sortedYears = Object.keys(resultsByYear).sort((a, b) => b.localeCompare(a))

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">ফলাফল</h1>

      {results.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium">কোন ফলাফল পাওয়া যায়নি</h3>
          <p className="text-muted-foreground">পরে আবার দেখুন।</p>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedYears.map((year) => (
            <div key={year} className="space-y-4">
              <h2 className="text-2xl font-bold">{year}</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {resultsByYear[year].map((result) => (
                  <Card key={result._id} className="h-full flex flex-col">
                    <CardHeader>
                      <CardTitle>{result.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p>{result.description}</p>
                    </CardContent>
                    {result.fileUrl && (
                      <CardFooter>
                        <Button variant="outline" asChild className="w-full">
                          <Link href={result.fileUrl} target="_blank" rel="noopener noreferrer">
                            <FileText className="mr-2 h-4 w-4" />
                            ফলাফল ডাউনলোড করুন
                          </Link>
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
