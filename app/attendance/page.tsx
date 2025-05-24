import { Suspense } from "react"
import { getAttendanceByDate } from "@/lib/actions/attendance"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { CalendarIcon, PlusIcon, FilterIcon, DownloadIcon } from "lucide-react"
import { DatePicker } from "@/components/date-picker"
import { AttendanceTable } from "@/components/attendance-table"
import { AddAttendanceDialog } from "@/components/add-attendance-dialog"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default function AttendancePage() {
  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">الحضور والانصراف</h1>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <DatePicker />
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <FilterIcon className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <DownloadIcon className="h-4 w-4" />
            </Button>
          </div>
          <AddAttendanceDialog>
            <Button className="w-full sm:w-auto">
              <PlusIcon className="ml-2 h-4 w-4" />
              إضافة سجل حضور
            </Button>
          </AddAttendanceDialog>
        </div>
      </div>

      <Tabs defaultValue="present">
        <TabsList className="mb-4 grid w-full grid-cols-3">
          <TabsTrigger value="present">الحاضرون</TabsTrigger>
          <TabsTrigger value="absent">الغائبون</TabsTrigger>
          <TabsTrigger value="all">الكل</TabsTrigger>
        </TabsList>
        <TabsContent value="present">
          <Suspense fallback={<AttendanceTableSkeleton />}>
            <PresentEmployees />
          </Suspense>
        </TabsContent>
        <TabsContent value="absent">
          <Suspense fallback={<AttendanceTableSkeleton />}>
            <AbsentEmployees />
          </Suspense>
        </TabsContent>
        <TabsContent value="all">
          <Suspense fallback={<AttendanceTableSkeleton />}>
            <AllEmployees />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

async function PresentEmployees() {
  const today = new Date().toISOString().split("T")[0]
  const attendanceRecords = await getAttendanceByDate(today)
  const presentRecords = attendanceRecords.filter((record) => record.status !== "غائب")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarIcon className="ml-2 h-5 w-5" />
          الموظفون الحاضرون اليوم ({presentRecords.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AttendanceTable records={presentRecords} />
      </CardContent>
    </Card>
  )
}

async function AbsentEmployees() {
  const today = new Date().toISOString().split("T")[0]
  const attendanceRecords = await getAttendanceByDate(today)
  const absentRecords = attendanceRecords.filter((record) => record.status === "غائب")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarIcon className="ml-2 h-5 w-5" />
          الموظفون الغائبون اليوم ({absentRecords.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AttendanceTable records={absentRecords} />
      </CardContent>
    </Card>
  )
}

async function AllEmployees() {
  const today = new Date().toISOString().split("T")[0]
  const attendanceRecords = await getAttendanceByDate(today)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarIcon className="ml-2 h-5 w-5" />
          جميع الموظفين ({attendanceRecords.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AttendanceTable records={attendanceRecords} />
      </CardContent>
    </Card>
  )
}

function AttendanceTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 w-48 animate-pulse rounded bg-gray-200"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-10 w-full animate-pulse rounded bg-gray-200"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 w-full animate-pulse rounded bg-gray-200"></div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
