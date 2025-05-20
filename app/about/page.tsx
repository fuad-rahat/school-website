import type { Metadata } from "next"
import Image from "next/image"
import clientPromise from "@/lib/mongodb"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "About Us - School Website",
  description: "Learn about our school, mission, vision and history",
}

interface AboutData {
  _id: string
  title: string
  description: string
  mission: string
  vision: string
  history: string
}

async function getAboutData() {
  try {
    const client = await clientPromise
    const db = client.db("school")

    // Debug log
    console.log("Fetching about data from database")

    const aboutData = await db.collection("about").findOne({})

    // Debug log
    console.log("About data from database:", aboutData)

    return aboutData ? JSON.parse(JSON.stringify(aboutData)) : null
  } catch (error) {
    console.error("Error fetching about data:", error)
    return null
  }
}

export default async function AboutPage() {
  const aboutData = await getAboutData()

  // Debug log
  console.log("About data in component:", aboutData)

  // Default data if no data is found in the database
  const data = aboutData || {
    title: "About Our School",
    description: "Welcome to our school, a place of learning and growth.",
    mission: "Our mission is to provide quality education to all students.",
    vision: "Our vision is to create a learning environment that fosters creativity and excellence.",
    history: "Our school was founded with the goal of providing quality education to all students.",
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">{data.title}</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <p className="mb-6 text-lg">{data.description}</p>

          <div className="mb-6">
            <h2 className="mb-2 text-2xl font-semibold">Our Mission</h2>
            <p>{data.mission}</p>
          </div>

          <div className="mb-6">
            <h2 className="mb-2 text-2xl font-semibold">Our Vision</h2>
            <p>{data.vision}</p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">Our History</h2>
            <p>{data.history}</p>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <div className="sticky top-8 overflow-hidden rounded-lg">
            <Image
              src="/placeholder.svg?height=600&width=800"
              alt="School Building"
              width={800}
              height={600}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </main>
  )
}
