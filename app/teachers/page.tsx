import Image from "next/image"
import clientPromise from "@/lib/mongodb"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, BookOpen } from "lucide-react"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata = {
  title: "Teachers - School Website",
  description: "Meet our dedicated teaching staff",
}

interface Teacher {
  _id: string
  name: string
  position: string
  image?: string
  education?: string
  experience?: string
  email?: string
  phone?: string
  subjects?: string[]
}

async function getTeachers(): Promise<Teacher[]> {
  try {
    const client = await clientPromise
    const db = client.db("school")
    const teachers = await db.collection("teachers").find({}).sort({ name: 1 }).toArray()

    // Convert MongoDB documents to plain objects
    return JSON.parse(JSON.stringify(teachers))
  } catch (error) {
    console.error("Error fetching teachers:", error)
    return []
  }
}

export default async function TeachersPage() {
  const teachers = await getTeachers()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Our Faculty</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Meet our dedicated team of educators committed to providing quality education and guidance.
        </p>
      </div>

      {teachers.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <p className="text-lg text-muted-foreground">No faculty members found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
            <Card key={teacher._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square relative overflow-hidden">
                <Image
                  src={teacher.image || "/placeholder.svg?height=300&width=300"}
                  alt={teacher.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold">{teacher.name}</h2>
                <p className="text-primary font-medium">{teacher.position}</p>

                {teacher.education && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-sm">Education</h4>
                    <p className="text-sm text-muted-foreground">{teacher.education}</p>
                  </div>
                )}

                {teacher.experience && (
                  <div className="mt-2">
                    <h4 className="font-semibold text-sm">Experience</h4>
                    <p className="text-sm text-muted-foreground">{teacher.experience}</p>
                  </div>
                )}

                {teacher.subjects && teacher.subjects.length > 0 && (
                  <div className="mt-2">
                    <h4 className="font-semibold text-sm">Subjects</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {teacher.subjects.map((subject, index) => (
                        <div key={index} className="flex items-center text-xs bg-muted px-2 py-1 rounded">
                          <BookOpen className="h-3 w-3 mr-1" />
                          {subject}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 space-y-2">
                  {teacher.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{teacher.email}</span>
                    </div>
                  )}
                  {teacher.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{teacher.phone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
