"use client"

import dynamic from 'next/dynamic'

const Carousel = dynamic(() => import('./carousel'), {
  ssr: false,
})

interface ImageInfo {
  src: string
  alt: string
  title?: string
  description?: string
}

export default function ImageCarousel() {
  // Static images array
  const images: ImageInfo[] = [
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
      src: "/shuktara.jpg",
      alt: "Shuktara",
      title: "Shuktara",
      description: "A special moment at our school"
    }
  ]

  return <Carousel images={images} autoPlay={true} interval={5000} />
} 