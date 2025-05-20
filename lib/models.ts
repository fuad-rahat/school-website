import mongoose from "mongoose"

// Teacher Schema
const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  qualification: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  image: { type: String },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
})

// Notice Schema
const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  category: { type: String, required: true },
  fileUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
})

// Alumni Schema
const alumniSchema = new mongoose.Schema({
  name: { type: String, required: true },
  batch: { type: String, required: true },
  profession: { type: String, required: true },
  organization: { type: String },
  email: { type: String },
  phone: { type: String },
  image: { type: String },
  message: { type: String },
  isApproved: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

// Activity Schema
const activitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
})

// Result Schema
const resultSchema = new mongoose.Schema({
  title: { type: String, required: true },
  year: { type: String, required: true },
  description: { type: String, required: true },
  fileUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
})

// About Schema
const aboutSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  mission: { type: String, required: true },
  vision: { type: String, required: true },
  history: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
})

// Create or get models
export const Teacher = mongoose.models.Teacher || mongoose.model("Teacher", teacherSchema)
export const Notice = mongoose.models.Notice || mongoose.model("Notice", noticeSchema)
export const Alumni = mongoose.models.Alumni || mongoose.model("Alumni", alumniSchema)
export const Activity = mongoose.models.Activity || mongoose.model("Activity", activitySchema)
export const Result = mongoose.models.Result || mongoose.model("Result", resultSchema)
export const About = mongoose.models.About || mongoose.model("About", aboutSchema)
