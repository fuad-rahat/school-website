import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Get the API key from environment variables
    const apiKey = process.env.IMGBB_API_KEY || "9a461936c108ef76797f8b446d345b80";

    if (!apiKey) {
      console.error("IMGBB_API_KEY is not configured")
      return NextResponse.json({ error: "Image upload is not configured" }, { status: 500 })
    }

    const formData = await request.formData()
    const image = formData.get("image") as File

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Check file size (max 2MB)
    if (image.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "Image size should be less than 2MB" }, { status: 400 })
    }

    // Create a new FormData for the imgBB API
    const imgbbFormData = new FormData()
    imgbbFormData.append("image", image)

    // Upload to imgBB using server-side API key
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: imgbbFormData,
    })

    const data = await response.json()

    if (data.success) {
      return NextResponse.json({ success: true, url: data.data.url })
    } else {
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
