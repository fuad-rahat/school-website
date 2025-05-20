import Carousel from "@/components/carousel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, BookOpen, Users, Calendar, Award } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import clientPromise from "@/lib/mongodb"
import { formatDate } from "@/lib/utils"

export const dynamic = "force-dynamic"
export const revalidate = 0

// Interface for notices
interface Notice {
  _id: string
  title: string
  date: string
  category: string
  content: string
}

// Function to get latest notices
async function getLatestNotices() {
  try {
    const client = await clientPromise
    const db = client.db("school")
    const notices = await db.collection("notices").find({}).sort({ date: -1 }).limit(3).toArray()
    return JSON.parse(JSON.stringify(notices))
  } catch (error) {
    console.error("Error fetching notices:", error)
    return []
  }
}

export default async function Home() {
  // Fetch latest notices
  const latestNotices = await getLatestNotices()

  const carouselImages = [
    {
      src: "/placeholder.svg?height=600&width=1200",
      alt: "School building",
      title: "শুকতারা বিদ্যানিকেতন",
      description: "শিক্ষা, সংস্কৃতি ও মূল্যবোধের সেতুবন্ধন",
    },
    {
      src: "/placeholder.svg?height=600&width=1200",
      alt: "Students in classroom",
      title: "উন্নত শিক্ষা পরিবেশ",
      description: "যেখানে জ্ঞান ও কৌতূহলের মিলন ঘটে",
    },
    {
      src: "/placeholder.svg?height=600&width=1200",
      alt: "Sports day",
      title: "সর্বাঙ্গীণ বিকাশ",
      description: "শিক্ষা, খেলাধুলা এবং সাংস্কৃতিক কার্যক্রমে শ্রেষ্ঠত্ব",
    },
    {
      src: "/placeholder.svg?height=600&width=1200",
      alt: "Graduation ceremony",
      title: "সাফল্য উদযাপন",
      description: "উজ্জ্বল ভবিষ্যতের জন্য শিক্ষার্থীদের প্রস্তুত করা",
    },
  ]

  return (
    <div className="space-y-8">
      <Carousel images={carouselImages} />

      <section className="py-8">
        <h2 className="text-3xl font-bold text-center mb-8">শুকতারা বিদ্যানিকেতনে স্বাগতম</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="text-center">
              <Trophy className="w-12 h-12 mx-auto text-primary" />
              <CardTitle>শ্রেষ্ঠত্ব</CardTitle>
            </CardHeader>
            <CardContent>
              <p>প্রতিটি শিক্ষার্থীর সর্বাঙ্গীণ বিকাশ ও শৈক্ষিক শ্রেষ্ঠত্বের প্রতি অঙ্গীকারবদ্ধ।</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <BookOpen className="w-12 h-12 mx-auto text-primary" />
              <CardTitle>শিক্ষা</CardTitle>
            </CardHeader>
            <CardContent>
              <p>উদ্ভাবনী শিক্ষাদান পদ্ধতির মাধ্যমে শিক্ষার প্রতি ভালোবাসা জাগ্রত করা।</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Users className="w-12 h-12 mx-auto text-primary" />
              <CardTitle>সম্প্রদায়</CardTitle>
            </CardHeader>
            <CardContent>
              <p>শিক্ষার্থী, শিক্ষক এবং অভিভাবকদের একটি সহায়ক সম্প্রদায় গড়ে তোলা।</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Award className="w-12 h-12 mx-auto text-primary" />
              <CardTitle>অর্জন</CardTitle>
            </CardHeader>
            <CardContent>
              <p>শিক্ষা, খেলাধুলা, শিল্পকলা এবং আরও অনেক ক্ষেত্রে অর্জনসমূহ উদযাপন করা।</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-8 bg-slate-50 rounded-lg p-6">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/3">
            <Image
              src="/kamalsir.jpeg"
              alt="Principal"
              width={300}
              height={400}
              className="rounded-lg shadow-lg mx-auto"
            />
          </div>
          <div className="md:w-2/3">
            <h2 className="text-2xl font-bold mb-4">অধ্যক্ষের বাণী</h2>
            <blockquote className="italic border-l-4 border-primary pl-4 mb-4">
              "শুকতারা বিদ্যানিকেতনে, আমরা শুধু উজ্জ্বল মনই নয়, করুণাময় হৃদয়ও গড়ে তুলি। আমাদের লক্ষ্য হল শিক্ষার্থীদের এমন জ্ঞান, দক্ষতা এবং
              মূল্যবোধে সমৃদ্ধ করা যা তাদের আধুনিক বিশ্বের জটিলতা নেভিগেট করতে এবং সমাজে অর্থপূর্ণ অবদান রাখতে সাহায্য করবে।"
            </blockquote>
            <p className="mb-4">
              শিক্ষা শুধু একাডেমিক শ্রেষ্ঠত্ব নয়, বরং জীবনের জন্য প্রস্তুতি। শুকতারা বিদ্যানিকেতনে, আমরা সমালোচনামূলক চিন্তা, সৃজনশীলতা, সহযোগিতা
              এবং যোগাযোগ দক্ষতা বিকাশের উপর ফোকাস করি যা ২১ শতকে সাফল্যের জন্য অপরিহার্য।
            </p>
            <p className="font-semibold">মোঃ কামাল হোসেন আকন্দ, অধ্যক্ষ</p>
          </div>
        </div>
      </section>

      

      

      {/* School Pledge Section */}
      <section className="py-8 bg-primary/5 rounded-lg">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">শপথ বাক্য</h2>
          <div className="max-w-3xl mx-auto">
            <blockquote className="text-center italic border-l-4 border-primary pl-4 py-2">
              <p className="text-lg mb-4">
                "আমরা শুকতারা বিদ্যানিকেতনের ছাত্রছাত্রীরা শপথ করছি যে, আমরা সর্বদা সত্য বলব, সৎ থাকব, অন্যের প্রতি শ্রদ্ধাশীল হব, দেশ ও জাতির
                কল্যাণে কাজ করব এবং জ্ঞান অর্জনের মাধ্যমে নিজেদের যোগ্য নাগরিক হিসেবে গড়ে তুলব।"
              </p>
              <footer className="font-semibold">- শুকতারা বিদ্যানিকেতন</footer>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="py-8">
        <h2 className="text-3xl font-bold text-center mb-8">সাম্প্রতিক অর্জনসমূহ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex gap-4 items-start">
            <div className="bg-primary/10 p-3 rounded-full">
              <Trophy className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">জাতীয় বিজ্ঞান অলিম্পিয়াড</h3>
              <p className="text-muted-foreground">
                আমাদের শিক্ষার্থীরা জাতীয় বিজ্ঞান অলিম্পিয়াড ২০২৫-এ ৩টি স্বর্ণ পদক এবং ৫টি রৌপ্য পদক অর্জন করেছে।
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="bg-primary/10 p-3 rounded-full">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">আন্তঃস্কুল বিতর্ক প্রতিযোগিতা</h3>
              <p className="text-muted-foreground">শুকতারা বিদ্যানিকেতন আঞ্চলিক বিতর্ক প্রতিযোগিতায় চ্যাম্পিয়নশিপ ট্রফি জিতেছে।</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="bg-primary/10 p-3 rounded-full">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">১০০% উত্তীর্ণের হার</h3>
              <p className="text-muted-foreground">
                টানা পঞ্চম বছরের মতো, আমরা ১০০% উত্তীর্ণের হার অর্জন করেছি, যেখানে ৮৫% শিক্ষার্থী সর্বোচ্চ গ্রেড অর্জন করেছে।
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="bg-primary/10 p-3 rounded-full">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">সামাজিক সেবা পুরস্কার</h3>
              <p className="text-muted-foreground">
                আমাদের স্কুল বিভিন্ন সামাজিক উদ্যোগের জন্য সম্প্রদায় সেবা শ্রেষ্ঠত্ব পুরস্কার পেয়েছে।
              </p>
            </div>
          </div>
        </div>
       
      </section>
    </div>
  )
}
