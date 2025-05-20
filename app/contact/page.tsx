"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">যোগাযোগ</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          আমাদের সাথে যোগাযোগ করুন। যেকোনো প্রশ্ন, মতামত বা জিজ্ঞাসার জন্য আমাদের সাথে যোগাযোগ করুন।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>যোগাযোগের তথ্য</CardTitle>
              <CardDescription>আমাদের সাথে যোগাযোগের বিভিন্ন উপায়</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold">ঠিকানা</h3>
                  <p className="text-sm text-muted-foreground">শুকতারা বিদ্যানিকেতন</p>
                  <p className="text-sm text-muted-foreground">পোস্ট অফিস রোড দরিরামপুর, ৮নং ওয়ার্ড</p>
                  <p className="text-sm text-muted-foreground">কিশোরগঞ্জ, বাংলাদেশ</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="w-5 h-5 mr-3 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold">ফোন</h3>
                  <p className="text-sm text-muted-foreground">০১৩০৯১৩০৮২৫</p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="w-5 h-5 mr-3 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold">ইমেইল</h3>
                  <p className="text-sm text-muted-foreground">kamalakand130825@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="w-5 h-5 mr-3 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold">অফিস সময়</h3>
                  <p className="text-sm text-muted-foreground">শনিবার - বৃহস্পতিবার: সকাল ৭:০০ - বিকাল ৪:০০</p>
                  <p className="text-sm text-muted-foreground">শুক্রবার: বন্ধ</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>সচরাচর জিজ্ঞাসা</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">ভর্তির প্রয়োজনীয়তা কী?</h3>
                <p className="text-sm text-muted-foreground">
                  ভর্তির প্রয়োজনীয়তা শ্রেণি অনুযায়ী ভিন্ন হয়। সাধারণত, পূর্ববর্তী শিক্ষাগত রেকর্ড, প্রবেশিকা পরীক্ষা এবং সাক্ষাৎকার প্রয়োজন। বিস্তারিত জানতে আমাদের অফিসে যোগাযোগ করুন।
                </p>
              </div>

              <div>
                <h3 className="font-semibold">আপনারা কি আর্থিক সহায়তা বা বৃত্তি প্রদান করেন?</h3>
                <p className="text-sm text-muted-foreground">
                  হ্যাঁ, আমরা মেধাভিত্তিক বৃত্তি এবং প্রয়োজনভিত্তিক আর্থিক সহায়তা প্রদান করি। আবেদন আমাদের অফিস থেকে পাওয়া যাবে।
                </p>
              </div>

              <div>
                <h3 className="font-semibold">কোন কোন সহশিক্ষা কার্যক্রম রয়েছে?</h3>
                <p className="text-sm text-muted-foreground">
                  আমরা খেলাধুলা, শিল্পকলা, সংগীত, বিতর্ক, রোবটিক্স এবং সামাজিক সেবা সহ বিভিন্ন ধরনের কার্যক্রম পরিচালনা করি। বিস্তারিত জানতে আমাদের ওয়েবসাইট দেখুন।
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="h-[600px] w-full rounded-lg overflow-hidden border">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.2550249657816!2d90.39492477536206!3d24.58523037810999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375643b996faa315%3A0xb3805f7d815e126a!2sShuktara%20Vidyaniketan!5e1!3m2!1sen!2sbd!4v1747756709497!5m2!1sen!2sbd" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  )
}
