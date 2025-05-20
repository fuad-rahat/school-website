import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), 'public')
    const files = fs.readdirSync(publicDir)
    
    // Filter for image files
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase()
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)
    })

    // Create image info objects with proper paths
    const images = imageFiles.map(file => {
      const fileName = path.parse(file).name
      return {
        src: `/${file}`,
        alt: fileName.replace(/[_-]/g, ' '),
        title: fileName.replace(/[_-]/g, ' ').split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        description: `A beautiful image of ${fileName.replace(/[_-]/g, ' ')}`
      }
    })

    return NextResponse.json(images)
  } catch (error) {
    console.error('Error reading images:', error)
    return NextResponse.json({ error: 'Failed to load images' }, { status: 500 })
  }
} 