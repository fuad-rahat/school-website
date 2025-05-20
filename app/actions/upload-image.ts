"use server"

export async function uploadImage(formData: FormData) {
  try {
    const image = formData.get("image") as File

    if (!image || image.size === 0) {
      return { success: false, error: "No image provided" }
    }

    // Create a new FormData instance for the external API
    const imgbbFormData = new FormData()
    imgbbFormData.append("image", image)

    // Use the server-side environment variable (not exposed to client)
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, {
      method: "POST",
      body: imgbbFormData,
    })

    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`)
    }

    const data = await response.json()

    return {
      success: true,
      url: data.data.url,
      display_url: data.data.display_url,
      delete_url: data.data.delete_url,
    }
  } catch (error) {
    console.error("Error uploading image:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload image",
    }
  }
}
