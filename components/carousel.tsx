"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface CarouselImage {
  src: string
  alt: string
  title?: string
  description?: string
}

interface CarouselProps {
  autoPlay?: boolean
  interval?: number
}

export default function Carousel({ autoPlay = true, interval = 5000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mounted, setMounted] = useState(false)
  const images: CarouselImage[] = [
    {
      src: "/sbn1.jpg",
      alt: "School Building 1",
      title: "Our School Building",
      description: "A beautiful view of our school campus"
    },
    {
      src: "/sbn2.jpg",
      alt: "School Building 2",
      title: "Modern Facilities",
      description: "State-of-the-art facilities for our students"
    },
    {
      src: "/sbn3.jpg",
      alt: "School Building 3",
      title: "Learning Environment",
      description: "Creating the perfect environment for learning"
    },
    {
      src: "/sbn4.jpg",
      alt: "Teachers",
      title: "Teachers",
      description: "A special moment at our school"
    }
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  useEffect(() => {
    if (!autoPlay || !mounted) return

    const intervalId = setInterval(goToNext, interval)
    return () => clearInterval(intervalId)
  }, [autoPlay, interval, mounted])

  if (!mounted) {
    return null
  }

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none",
            )}
          >
            <div className="relative w-full h-full">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                quality={90}
              />
            </div>
            {(image.title || image.description) && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4 md:p-6">
                {image.title && <h2 className="text-xl md:text-2xl font-bold">{image.title}</h2>}
                {image.description && <p className="mt-2 text-sm md:text-base">{image.description}</p>}
              </div>
            )}
          </div>
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">Previous slide</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full"
        onClick={goToNext}
      >
        <ChevronRight className="h-6 w-6" />
        <span className="sr-only">Next slide</span>
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              index === currentIndex ? "bg-white w-4" : "bg-white/50",
            )}
            onClick={() => goToSlide(index)}
          >
            <span className="sr-only">Go to slide {index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
