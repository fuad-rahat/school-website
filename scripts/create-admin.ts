import clientPromise from "@/lib/mongodb"

async function createAdmin() {
  try {
    const client = await clientPromise
    const db = client.db("school")

    // Check if admin already exists
    const existingAdmin = await db.collection("admins").findOne({ username: "rahatfuad" })
    if (existingAdmin) {
      console.log("Admin user already exists")
      return
    }

    // Create admin user
    const result = await db.collection("admins").insertOne({
      username: "rahatfuad",
      password: "rahat1221",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    console.log("Admin user created successfully:", result.insertedId)
  } catch (error) {
    console.error("Error creating admin:", error)
  } finally {
    process.exit()
  }
}

createAdmin() 