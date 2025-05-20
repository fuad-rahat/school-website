import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200 ">
      <div className="container py-8 md:py-12 ">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">শুকতারা বিদ্যানিকেতন</h3>
            <p className="mb-4">EIIN-130825</p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="hover:text-primary">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">দ্রুত লিঙ্ক</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-primary">
                  আমাদের সম্পর্কে
                </Link>
              </li>
              <li>
                <Link href="/teachers" className="hover:text-primary">
                  শিক্ষকমণ্ডলী
                </Link>
              </li>
             
              <li>
                <Link href="/notice" className="hover:text-primary">
                  নোটিশ
                </Link>
              </li>
            </ul>
          </div>

         

          <div className="sm:col-span-2 md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">যোগাযোগ</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5" />
                <span>পোস্ট অফিস রোড দরিরামপুর, ৮নং ওয়ার্ড</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                <span>০১৩০৯১৩০৮২৫</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                <span>kamalakand130825@gmail.com</span>
              </li>
            </ul>
          </div>
          <div className="sm:col-span-2 md:col-span-1">
          <img src="/shuktara.jpg"/>
        </div>
        </div>
       

        <div className="border-t border-slate-700 mt-8 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} শুকতারা বিদ্যানিকেতন। সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </div>
    </footer>
  )
}
