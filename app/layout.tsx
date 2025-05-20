import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Sidebar from "@/components/sidebar"
import Footer from "@/components/footer"
import MobileFooter from "@/components/mobile-footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "শুকতারা বিদ্যানিকেতন",
  description: "শিক্ষা, সংস্কৃতি ও মূল্যবোধের সেতুবন্ধন",
  keywords: ["শুকতারা বিদ্যানিকেতন", "Shuktara Biddyaniketon", "ময়মনসিংহ", "বাংলাদেশ", "EIIN-130825"],
  authors: [{ name: "Shuktara Biddyaniketon" }],
  creator: "Md. Muhtasim Fuad Rahat (https://fuadrahat.com)",
  publisher: "Shuktara Biddyaniketon",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://sbn.vercel.app"),
  openGraph: {
    type: "website",
    locale: "bn_BD",
    url: "https://sbn.vercel.app",
    title: "শুকতারা বিদ্যানিকেতন",
    description: "শিক্ষা, সংস্কৃতি ও মূল্যবোধের সেতুবন্ধন",
    siteName: "শুকতারা বিদ্যানিকেতন",
    images: [
      {
        url: "/shuktara.jpg",
        width: 1200,
        height: 630,
        alt: "শুকতারা বিদ্যানিকেতন",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "শুকতারা বিদ্যানিকেতন",
    description: "শিক্ষা, সংস্কৃতি ও মূল্যবোধের সেতুবন্ধন",
    images: ["/shuktara.jpg"],
  },
  icons: {
    icon: [
      {
        url: "/shuktara.jpg",
        sizes: "32x32",
        type: "image/jpeg",
      },
      {
        url: "/shuktara.jpg",
        sizes: "16x16",
        type: "image/jpeg",
      },
    ],
    apple: [
      {
        url: "/shuktara.jpg",
        sizes: "180x180",
        type: "image/jpeg",
      },
    ],
  },
  manifest: "/manifest.json",
  themeColor: "#ffffff",
  viewport: "width=device-width, initial-scale=1",
  verification: {
    google: "your-google-site-verification",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="bn">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <div className="flex flex-col md:flex-row flex-1">
            <main className="flex-1 p-4 pb-20 md:pb-4">{children}</main>
            <Sidebar />
          </div>
          <Footer />
          <MobileFooter />
        </div>
      </body>
    </html>
  )
}
