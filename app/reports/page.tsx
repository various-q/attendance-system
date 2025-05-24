import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, DownloadIcon, PrinterIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AttendanceChart } from "@/components/attendance-chart"
import { StatsCard } from "@/components/stats-card"
import { getAttendanceStats } from "@/lib/actions/attendance"
import { getEmployeeCount } from "@/lib/actions/employees"

export const dynamic = "force-dynamic"
export const revalidate = 0

async function fetchReportData() {
  try {
    const [attendanceStats, employeeCount] = await Promise.all([
      getAttendanceStats().catch(() => ({
        today: { present: 0, late: 0, absent: 0, onLeave: 0 },
        month: { present: 0, late: 0, absent: 0, onLeave: 0 },
      })),
      getEmployeeCount().catch(() => 0),
    ])

    return {
      attendanceStats,
      employeeCount,
    }
  } catch (error) {
    console.error("Error fetching report data:", error)
    return {
      attendanceStats: {
        today: { present: 0, late: 0, absent: 0, onLeave: 0 },
        month: { present: 0, late: 0, absent: 0, onLeave: 0 },
      },
      employeeCount: 0,
    }
  }
}

export default function ReportsPage() {
  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">التقارير والإحصائيات</h1>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button className="gap-2">
            <DownloadIcon className="h-4 w-4" />
            تصدير التقرير
          </Button>
          <Button variant="outline" className="gap-2">
            <PrinterIcon className="h-4 w-4" />
            طباعة
          </Button>
        </div>
      </div>

      <Tabs defaultValue="daily">
        <TabsList className="mb-4 grid w-full grid-cols-3">
          <TabsTrigger value="daily">تقرير يومي</TabsTrigger>
          <TabsTrigger value="monthly">تقرير شهري</TabsTrigger>
          <TabsTrigger value="yearly">تقرير سنوي</TabsTrigger>
        </TabsList>
        <TabsContent value="daily">
          <Suspense fallback={<ReportSkeleton />}>
            <DailyReport />
          </Suspense>
        </TabsContent>
        <TabsContent value="monthly">
          <Suspense fallback={<ReportSkeleton />}>
            <MonthlyReport />
          </Suspense>
        </TabsContent>
        <TabsContent value="yearly">
          <Suspense fallback={<ReportSkeleton />}>
            <YearlyReport />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

async function DailyReport() {
  const { attendanceStats, employeeCount } = await fetchReportData()

  const attendanceRate = employeeCount ? Math.round((attendanceStats.today.present / employeeCount) * 100) : 0
  const lateRate = employeeCount ? Math.round((attendanceStats.today.late / employeeCount) * 100) : 0

  // بيانات الرسم البياني اليومي
  const dailyChartData = {
    labels: ["8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
    datasets: [
      {
        label: "الحضور",
        data: [5, 12, 18, 20, 22, 18, 22, 20, 18, 10],
        backgroundColor: "#1d78b5",
      },
      {
        label: "الانصراف",
        data: [0, 0, 0, 2, 4, 8, 10, 12, 15, 20],
        backgroundColor: "#34b5a6",
      },
    ],
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center">
          <CalendarIcon className="ml-2 h-5 w-5" />
          تقرير الحضور ليوم{" "}
          {new Date().toLocaleDateString("ar-SA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatsCard
          title="نسبة الحضور"
          value={`${attendanceRate}%`}
          icon={<CalendarIcon className="h-6 w-6" />}
          color="bg-green-500"
          trend={{ value: 5, isPositive: true, label: "عن الأمس" }}
        />
        <StatsCard
          title="نسبة التأخير"
          value={`${lateRate}%`}
          icon={<CalendarIcon className="h-6 w-6" />}
          color="bg-amber-500"
          trend={{ value: 2, isPositive: false, label: "عن الأمس" }}
        />
        <StatsCard
          title="متوسط ساعات العمل"
          value="7.5 ساعة"
          icon={<CalendarIcon className="h-6 w-6" />}
          color="bg-blue-500"
        />
        <StatsCard
          title="إجمالي الموظفين"
          value={employeeCount}
          icon={<CalendarIcon className="h-6 w-6" />}
          color="bg-purple-500"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <AttendanceChart data={dailyChartData} title="توزيع الحضور والانصراف على مدار اليوم" />

        <Card>
          <CardHeader>
            <CardTitle>ملخص الحضور اليومي</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">الموظفون الحاضرون</span>
                <span className="text-green-600 font-bold">{attendanceStats.today.present}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">الموظفون المتأخرون</span>
                <span className="text-amber-600 font-bold">{attendanceStats.today.late}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">الموظفون الغائبون</span>
                <span className="text-red-600 font-bold">{attendanceStats.today.absent}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">الموظفون في إجازة</span>
                <span className="text-blue-600 font-bold">{attendanceStats.today.onLeave}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">إجمالي الموظفين</span>
                <span className="font-bold">{employeeCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

async function MonthlyReport() {
  const { attendanceStats, employeeCount } = await fetchReportData()

  // بيانات الرسم البياني الشهري
  const monthlyChartData = {
    labels: ["1", "5", "10", "15", "20", "25", "30"],
    datasets: [
      {
        label: "الحضور",
        data: [22, 23, 20, 21, 19, 18, 20],
        backgroundColor: "#1d78b5",
      },
      {
        label: "التأخير",
        data: [3, 2, 5, 4, 6, 7, 5],
        backgroundColor: "#f59e0b",
      },
      {
        label: "الغياب",
        data: [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: "#ef4444",
      },
    ],
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center">
          <CalendarIcon className="ml-2 h-5 w-5" />
          تقرير الحضور لشهر {new Date().toLocaleDateString("ar-SA", { year: "numeric", month: "long" })}
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatsCard
          title="متوسط نسبة الحضور"
          value="92%"
          icon={<CalendarIcon className="h-6 w-6" />}
          color="bg-green-500"
          trend={{ value: 3, isPositive: true, label: "عن الشهر السابق" }}
        />
        <StatsCard
          title="متوسط نسبة التأخير"
          value="8%"
          icon={<CalendarIcon className="h-6 w-6" />}
          color="bg-amber-500"
          trend={{ value: 1, isPositive: false, label: "عن الشهر السابق" }}
        />
        <StatsCard
          title="متوسط ساعات العمل"
          value="165 ساعة"
          icon={<CalendarIcon className="h-6 w-6" />}
          color="bg-blue-500"
        />
        <StatsCard
          title="إجمالي الإجازات"
          value="15"
          icon={<CalendarIcon className="h-6 w-6" />}
          color="bg-purple-500"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <AttendanceChart data={monthlyChartData} title="توزيع الحضور على مدار الشهر" />

        <Card>
          <CardHeader>
            <CardTitle>ملخص الحضور الشهري</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">متوسط الحضور اليومي</span>
                <span className="text-green-600 font-bold">{Math.round(attendanceStats.month.present / 30)} موظف</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">متوسط التأخير اليومي</span>
                <span className="text-amber-600 font-bold">{Math.round(attendanceStats.month.late / 30)} موظف</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">متوسط الغياب اليومي</span>
                <span className="text-red-600 font-bold">{Math.round(attendanceStats.month.absent / 30)} موظف</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">إجمالي أيام العمل</span>
                <span className="font-bold">22 يوم</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">إجمالي الموظفين</span>
                <span className="font-bold">{employeeCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

async function YearlyReport() {
  const { employeeCount } = await fetchReportData()

  // بيانات الرسم البياني السنوي
  const yearlyChartData = {
    labels: [
      "يناير",
      "فبراير",
      "مارس",
      "أبريل",
      "مايو",
      "يونيو",
      "يوليو",
      "أغسطس",
      "سبتمبر",
      "أكتوبر",
      "نوفمبر",
      "ديسمبر",
    ],
    datasets: [
      {
        label: "نسبة الحضور",
        data: [90, 92, 91, 93, 94, 92, 91, 90, 92, 93, 94, 95],
        backgroundColor: "#1d78b5",
      },
    ],
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center">
          <CalendarIcon className="ml-2 h-5 w-5" />
          تقرير الحضور لعام {new Date().getFullYear()}
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatsCard
          title="متوسط نسبة الحضور"
          value="92%"
          icon={<CalendarIcon className="h-6 w-6" />}
          color="bg-green-500"
          trend={{ value: 2, isPositive: true, label: "عن العام السابق" }}
        />
        <StatsCard
          title="إجمالي ساعات العمل"
          value="1980 ساعة"
          icon={<CalendarIcon className="h-6 w-6" />}
          color="bg-blue-500"
        />
        <StatsCard
          title="إجمالي الإجازات"
          value="180"
          icon={<CalendarIcon className="h-6 w-6" />}
          color="bg-purple-500"
        />
        <StatsCard
          title="متوسط عدد الموظفين"
          value={employeeCount}
          icon={<CalendarIcon className="h-6 w-6" />}
          color="bg-indigo-500"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <AttendanceChart data={yearlyChartData} title="نسبة الحضور على مدار العام" />

        <Card>
          <CardHeader>
            <CardTitle>ملخص الحضور السنوي</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">إجمالي أيام العمل</span>
                <span className="font-bold">264 يوم</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">متوسط ساعات العمل الشهرية</span>
                <span className="text-blue-600 font-bold">165 ساعة</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">الشهر الأعلى حضوراً</span>
                <span className="text-green-600 font-bold">ديسمبر (95%)</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">الشهر الأقل حضوراً</span>
                <span className="text-amber-600 font-bold">أغسطس (90%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">متوسط عدد الموظفين</span>
                <span className="font-bold">{employeeCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

function ReportSkeleton() {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div className="h-6 w-48 animate-pulse rounded bg-gray-200"></div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-8 w-16 animate-pulse rounded bg-gray-200"></div>
                <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200"></div>
              </div>
              <div className="mt-2 h-6 w-32 animate-pulse rounded bg-gray-200"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="h-6 w-48 animate-pulse rounded bg-gray-200"></div>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full animate-pulse rounded bg-gray-200"></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="h-6 w-48 animate-pulse rounded bg-gray-200"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between items-center border-b pb-2">
                  <div className="h-5 w-32 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-5 w-16 animate-pulse rounded bg-gray-200"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
