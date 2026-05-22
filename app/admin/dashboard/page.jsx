import { auth } from "@/auth"
import { redirect } from "next/navigation"
import connectDB from "@/lib/mongodb"
import Booking from "@/models/Booking"
import Analytics from "@/models/Analytics"
import AdminNav from "@/components/admin/AdminNav"
import StatsCards from "@/components/admin/StatsCards"
import DropOffChart from "@/components/admin/DropOffChart"
import BookingsTable from "@/components/admin/BookingsTable"

const STEP_LABELS = {
  1: "Service",
  2: "Date & Time",
  3: "Style",
  4: "Measurements",
  5: "Save Progress",
  6: "Your Details",
  7: "Review & Pay",
}

const aggregateDropOff = (events) => {
  const stepMap = {}

  events.forEach(({ step, event, timeSpent }) => {
    if (!stepMap[step]) {
      stepMap[step] = {
        entered:   0,
        abandoned: 0,
        completed: 0,
        totalTime: 0,
      }
    }
    if (event === "entered")   stepMap[step].entered++
    if (event === "abandoned") stepMap[step].abandoned++
    if (event === "completed") stepMap[step].completed++
    stepMap[step].totalTime += timeSpent || 0
  })

  return Object.entries(STEP_LABELS).map(([stepNum, label]) => {
    const num  = parseInt(stepNum)
    const data = stepMap[num] || {
      entered: 0, abandoned: 0, completed: 0, totalTime: 0,
    }

    const dropOffRate = data.entered > 0
      ? Math.round((data.abandoned / data.entered) * 100)
      : 0

    const avgTime = data.entered > 0
      ? Math.round(data.totalTime / data.entered)
      : 0

    return {
      step: num,
      label,
      ...data,
      dropOffRate,
      avgTime,
    }
  })
}

export const metadata = {
  title: "Dashboard — FlowTrack Admin",
}

export default async function AdminDashboardPage() {
  const session = await auth()
  if (!session) redirect("/admin/login")

  await connectDB()

  const [bookings, analyticsEvents] = await Promise.all([
    Booking.find({ paymentStatus: "paid" })
      .sort({ createdAt: -1 })
      .select("-otp -otpExpiresAt")
      .lean(),
    Analytics.find({}).lean(),
  ])

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.amount ?? 0), 0)
  const dropOffData  = aggregateDropOff(analyticsEvents)

  // Completion rate — step 7 completed vs step 1 entered
  const step1Entered    = analyticsEvents.filter(
    (e) => e.step === 1 && e.event === "entered"
  ).length
  const step7Completed  = analyticsEvents.filter(
    (e) => e.step === 7 && e.event === "completed"
  ).length

  const completionRate = step1Entered > 0
    ? Math.round((step7Completed / step1Entered) * 100)
    : 0

  const stats = {
    totalBookings:  bookings.length,
    totalRevenue,
    completionRate,
  }

  const serializedBookings = JSON.parse(JSON.stringify(bookings))
  const serializedDropOff  = JSON.parse(JSON.stringify(dropOffData))

  return (
    <>
      <AdminNav />
      <main className="min-h-screen bg-off-white pt-20 pb-12">
        <div className="container">

          <div className="mb-8">
            <h1 className="text-[1.75rem] font-bold text-text-primary tracking-tight">
              Dashboard
            </h1>
            <p className="text-text-secondary text-[.9375rem] mt-1">
              Overview of all bookings and customer flow analytics.
            </p>
          </div>

          <StatsCards stats={stats} />

          <div className="mt-8 bg-white rounded-[20px] border border-border-light p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-[1.125rem] font-bold text-text-primary tracking-tight">
                Booking flow drop-off
              </h2>
              <p className="text-[.875rem] text-text-secondary mt-1">
                Where customers are abandoning the booking flow.
                {step1Entered > 0 && (
                  <span className="ml-2 text-text-muted">
                    ({step1Entered} session{step1Entered !== 1 ? "s" : ""} started)
                  </span>
                )}
              </p>
            </div>
            <DropOffChart data={serializedDropOff} />
          </div>

          <div className="mt-8 bg-white rounded-[20px] border border-border-light p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-[1.125rem] font-bold text-text-primary tracking-tight">
                All bookings
              </h2>
              <p className="text-[.875rem] text-text-secondary mt-1">
                {bookings.length} confirmed booking{bookings.length !== 1 ? "s" : ""}
              </p>
            </div>
            <BookingsTable bookings={serializedBookings} />
          </div>

        </div>
      </main>
    </>
  )
}