export default function Home() {
  return (
    <div className="w-full h-full p-6 bg-background">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6 w-full">
        <div className="rounded-lg border p-4 w-full">
          <h3 className="text-lg font-medium mb-2">Assets</h3>
          <p className="text-3xl font-bold">6</p>
          <p className="text-sm text-muted-foreground mt-1">3 new this week</p>
        </div>
        <div className="rounded-lg border p-4 w-full">
          <h3 className="text-lg font-medium mb-2">Messages</h3>
          <p className="text-3xl font-bold">5</p>
          <p className="text-sm text-muted-foreground mt-1">2 unread</p>
        </div>
        <div className="rounded-lg border p-4 w-full">
          <h3 className="text-lg font-medium mb-2">Database Items</h3>
          <p className="text-3xl font-bold">10</p>
          <p className="text-sm text-muted-foreground mt-1">Last updated today</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-4 w-full">
        <div className="rounded-lg border p-4 w-full flex justify-between items-start">
          <div>
            <h3 className="font-medium mb-1">New asset created</h3>
            <p className="text-sm">Marketing Presentation was added to Assets</p>
          </div>
          <span className="text-sm text-muted-foreground">Today at 10:30 AM</span>
        </div>
        <div className="rounded-lg border p-4 w-full flex justify-between items-start">
          <div>
            <h3 className="font-medium mb-1">New message received</h3>
            <p className="text-sm">Jane Smith sent a message about "Meeting Tomorrow"</p>
          </div>
          <span className="text-sm text-muted-foreground">Yesterday at 4:15 PM</span>
        </div>
        <div className="rounded-lg border p-4 w-full flex justify-between items-start">
          <div>
            <h3 className="font-medium mb-1">Database updated</h3>
            <p className="text-sm">Customer Database was updated with new entries</p>
          </div>
          <span className="text-sm text-muted-foreground">2 days ago</span>
        </div>
      </div>
    </div>
  )
}

// "use client"

// import { useRouter } from "next/navigation"
// import { useEffect } from "react"

// export default function Home() {
//   const router = useRouter()

//   useEffect(() => {
//     // Replace so the user doesn't go back to this redirect page
//     router.replace("/dashboard/assets")
//   }, [router])

//   return null
// }