import { redirect } from "next/navigation"

export default function AdminPage() {
  // Redirect from /admin to /admin/dashboard
  redirect("/admin/dashboard")
}
