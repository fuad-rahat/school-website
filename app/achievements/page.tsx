import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Trophy, Award, Medal, Star } from "lucide-react"

export default function AchievementsPage() {
  const achievements = {
    academic: [
      {
        id: 1,
        title: "National Science Olympiad",
        year: 2025,
        image: "/placeholder.svg?height=400&width=600",
        description: "Our students secured 3 gold medals and 5 silver medals in the National Science Olympiad.",
        participants: ["Emma Thompson", "Michael Chen", "Sophia Rodriguez", "James Wilson"],
        category: "Science",
        level: "National",
      },
      {
        id: 2,
        title: "International Mathematics Competition",
        year: 2024,
        image: "/placeholder.svg?height=400&width=600",
        description: "Brightwood Academy ranked in the top 5% globally, with two students achieving perfect scores.",
        participants: ["David Kim", "Olivia Martinez"],
        category: "Mathematics",
        level: "International",
      },
      {
        id: 3,
        title: "National Debate Championship",
        year: 2024,
        image: "/placeholder.svg?height=400&width=600",
        description:
          "Our debate team won the national championship, demonstrating exceptional critical thinking and public speaking skills.",
        participants: ["Ethan Johnson", "Ava Williams", "Noah Brown"],
        category: "Debate",
        level: "National",
      },
    ],
    sports: [
      {
        id: 4,
        title: "State Basketball Championship",
        year: 2025,
        image: "/placeholder.svg?height=400&width=600",
        description: "Our basketball team won the state championship for the second consecutive year.",
        participants: ["Team Members (15)"],
        category: "Basketball",
        level: "State",
      },
      {
        id: 5,
        title: "Regional Swimming Competition",
        year: 2024,
        image: "/placeholder.svg?height=400&width=600",
        description: "Our swimmers broke 3 regional records and qualified for the national championship.",
        participants: ["Isabella Garcia", "William Davis", "Charlotte Wilson"],
        category: "Swimming",
        level: "Regional",
      },
      {
        id: 6,
        title: "Interschool Soccer Tournament",
        year: 2024,
        image: "/placeholder.svg?height=400&width=600",
        description: "The soccer team demonstrated exceptional sportsmanship and teamwork, winning the championship.",
        participants: ["Team Members (22)"],
        category: "Soccer",
        level: "Regional",
      },
    ],
    arts: [
      {
        id: 7,
        title: "National Youth Art Exhibition",
        year: 2025,
        image: "/placeholder.svg?height=400&width=600",
        description: "Five students had their artwork selected for the prestigious National Youth Art Exhibition.",
        participants: ["Benjamin Moore", "Mia Taylor", "Alexander Smith", "Abigail Johnson", "Daniel Brown"],
        category: "Visual Arts",
        level: "National",
      },
      {
        id: 8,
        title: "State Drama Festival",
        year: 2024,
        image: "/placeholder.svg?height=400&width=600",
        description: "Our drama club won 'Best Production' and 'Best Direction' awards at the State Drama Festival.",
        participants: ["Drama Club Members (18)"],
        category: "Theater",
        level: "State",
      },
      {
        id: 9,
        title: "Regional Music Competition",
        year: 2024,
        image: "/placeholder.svg?height=400&width=600",
        description:
          "Our orchestra and choir received 'Superior' ratings, with three students selected for All-State ensembles.",
        participants: ["Emily Davis", "Matthew Wilson", "Various Ensemble Members"],
        category: "Music",
        level: "Regional",
      },
    ],
    community: [
      {
        id: 10,
        title: "Community Service Excellence Award",
        year: 2025,
        image: "/placeholder.svg?height=400&width=600",
        description: "Recognized for contributing over 5,000 hours of community service through various initiatives.",
        participants: ["Volunteer Corps", "Environmental Club", "Student Council"],
        category: "Community Service",
        level: "Local",
      },
      {
        id: 11,
        title: "Environmental Sustainability Project",
        year: 2024,
        image: "/placeholder.svg?height=400&width=600",
        description:
          "Our environmental initiative to reduce waste and promote sustainability received state recognition.",
        participants: ["Environmental Club Members"],
        category: "Environmental",
        level: "State",
      },
      {
        id: 12,
        title: "Youth Leadership Summit",
        year: 2024,
        image: "/placeholder.svg?height=400&width=600",
        description:
          "Our student leaders organized a regional youth leadership summit, bringing together students from 15 schools.",
        participants: ["Student Council Members"],
        category: "Leadership",
        level: "Regional",
      },
    ],
  }

  const schoolRecognitions = [
    {
      id: 1,
      title: "Excellence in Education Award",
      year: 2025,
      organization: "National Education Association",
      description: "Recognized for outstanding educational programs and student outcomes.",
    },
    {
      id: 2,
      title: "STEM Education Leadership",
      year: 2024,
      organization: "Science & Technology Education Board",
      description:
        "Acknowledged for innovative STEM curriculum and exceptional student achievements in science and technology.",
    },
    {
      id: 3,
      title: "Inclusive Education Excellence",
      year: 2024,
      organization: "Education Diversity Council",
      description: "Recognized for creating an inclusive learning environment that supports all students.",
    },
    {
      id: 4,
      title: "Arts Program Distinction",
      year: 2023,
      organization: "National Arts Education Association",
      description: "Honored for exceptional arts education programs across visual arts, music, and theater.",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Achievements & Recognition</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Celebrating the outstanding accomplishments of our students, faculty, and school community across academics,
          sports, arts, and community service.
        </p>
      </div>

      <section className="bg-slate-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">School Recognition</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schoolRecognitions.map((recognition) => (
            <Card key={recognition.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{recognition.title}</CardTitle>
                  <Badge variant="outline" className="ml-2">
                    {recognition.year}
                  </Badge>
                </div>
                <CardDescription>{recognition.organization}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{recognition.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Student & Team Achievements</h2>
        <Tabs defaultValue="academic">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="sports">Sports</TabsTrigger>
            <TabsTrigger value="arts">Arts & Culture</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          {Object.entries(achievements).map(([category, items]) => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {items.map((achievement) => (
                  <Card key={achievement.id} className="overflow-hidden">
                    <div className="aspect-video relative">
                      <Image
                        src={achievement.image || "/placeholder.svg"}
                        alt={achievement.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-primary text-primary-foreground">{achievement.level}</Badge>
                      </div>
                    </div>
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{achievement.title}</CardTitle>
                        <Badge variant="outline" className="ml-2">
                          {achievement.year}
                        </Badge>
                      </div>
                      <CardDescription>{achievement.category}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-3">
                      <p className="text-sm">{achievement.description}</p>

                      <div>
                        <h4 className="text-sm font-semibold mb-1">Participants</h4>
                        <div className="flex flex-wrap gap-1">
                          {achievement.participants.map((participant, index) => (
                            <span key={index} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                              {participant}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-primary/10 p-6 rounded-lg text-center">
          <Trophy className="w-12 h-12 mx-auto text-primary mb-2" />
          <h3 className="text-2xl font-bold">100+</h3>
          <p className="text-sm">Academic Awards</p>
        </div>

        <div className="bg-primary/10 p-6 rounded-lg text-center">
          <Medal className="w-12 h-12 mx-auto text-primary mb-2" />
          <h3 className="text-2xl font-bold">50+</h3>
          <p className="text-sm">Sports Championships</p>
        </div>

        <div className="bg-primary/10 p-6 rounded-lg text-center">
          <Star className="w-12 h-12 mx-auto text-primary mb-2" />
          <h3 className="text-2xl font-bold">75+</h3>
          <p className="text-sm">Arts & Culture Recognitions</p>
        </div>

        <div className="bg-primary/10 p-6 rounded-lg text-center">
          <Award className="w-12 h-12 mx-auto text-primary mb-2" />
          <h3 className="text-2xl font-bold">25+</h3>
          <p className="text-sm">Community Service Awards</p>
        </div>
      </section>
    </div>
  )
}
