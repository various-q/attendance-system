import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, FileDown, RefreshCw, UserPlus, Bell, Users, Briefcase, Calendar } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { StatsCard } from "@/components/stats-card"
import { getPendingLeaveRequests } from "@/lib/actions/leaves"
import { getEmployeeCount, getLatestEmployees } from "@/lib/actions/employees"
import { getAttendanceStats, getLateLogs, getRecentLogs } from "@/lib/actions/attendance"
import { getDeviceCount } from "@/lib/actions/devices"

export const dynamic = "force-dynamic"
export const revalidate = 0

async function fetchDashboardData() {
  try {
    const results = await Promise.allSettled([
      getEmployeeCount().catch(() => 0),
      getPendingLeaveRequests().catch(() => []),
      getAttendanceStats().catch(() => ({
        today: { present: 0, late: 0, absent: 0, onLeave: 0 },
        month: { present: 0, late: 0, absent: 0, onLeave: 0 },
      })),
      getDeviceCount().catch(() => 0),
      getLateLogs().catch(() => []),
      getRecentLogs().catch(() => []),
      getLatestEmployees().catch(() => []),
    ])

    return {
      employeeCount: results[0].status === "fulfilled" ? results[0].value : 0,
      pendingLeaveRequests: results[1].status === "fulfilled" ? results[1].value : [],
      attendanceStats:
        results[2].status === "fulfilled"
          ? results[2].value
          : {
              today: { present: 0, late: 0, absent: 0, onLeave: 0 },
              month: { present: 0, late: 0, absent: 0, onLeave: 0 },
            },
      deviceCount: results[3].status === "fulfilled" ? results[3].value : 0,
      lateLogs: results[4].status === "fulfilled" ? results[4].value : [],
      recentLogs: results[5].status === "fulfilled" ? results[5].value : [],
      latestEmployees: results[6].status === "fulfilled" ? results[6].value : [],
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return {
      employeeCount: 0,
      pendingLeaveRequests: [],
      attendanceStats: {
        today: { present: 0, late: 0, absent: 0, onLeave: 0 },
        month: { present: 0, late: 0, absent: 0, onLeave: 0 },
      },
      deviceCount: 0,
      lateLogs: [],
      recentLogs: [],
      latestEmployees: [],
    }
  }
}

export default function DashboardPage() {
  return (
    <div className="p-6">
      <Suspense fallback={<DashboardSkeleton />}>
        <Dashboard />
      </Suspense>
    </div>
  )
}

async function Dashboard() {
  const data = await fetchDashboardData()

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">لوحة التحكم</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              4
            </span>
          </Button>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("ar-SA", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-lg font-medium">{new Date().toLocaleTimeString("ar-SA")}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="الموظفون الحاضرون"
          value={data.attendanceStats?.today?.present || 0}
          icon={<Users className="h-6 w-6" />}
          color="bg-green-500"
          trend={{ value: 5, isPositive: true, label: "عن الأمس" }}
        />
        <StatsCard
          title="الموظفون الغائبون"
          value={data.attendanceStats?.today?.absent || 0}
          icon={<Users className="h-6 w-6" />}
          color="bg-red-500"
          trend={{ value: 2, isPositive: false, label: "عن الأمس" }}
        />
        <StatsCard
          title="الموظفون المتأخرون"
          value={data.attendanceStats?.today?.late || 0}
          icon={<Clock className="h-6 w-6" />}
          color="bg-amber-500"
        />
        <StatsCard
          title="إجمالي الموظفين"
          value={data.employeeCount || 0}
          icon={<Briefcase className="h-6 w-6" />}
          color="bg-blue-500"
        />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>الموظفون المتأخرون اليوم</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!data.lateLogs || data.lateLogs.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">لا يوجد موظفين متأخرين اليوم</div>
              ) : (
                data.lateLogs.map((log: any) => (
                  <div
                    key={log.id || Math.random().toString()}
                    className="flex items-center justify-between gap-4 border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>{log.employee?.name?.charAt(0) || log.name?.charAt(0) || "؟"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{log.employee?.name || log.name || "غير معروف"}</p>
                        <p className="text-sm text-muted-foreground">
                          {log.employee?.department || log.department || "غير محدد"} - تأخر{" "}
                          {log.late_minutes ? `${log.late_minutes} دقيقة` : "غير محدد"}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700">
                      تم التنبيه
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>آخر تسجيلات الحضور</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!data.recentLogs || data.recentLogs.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">لا توجد تسجيلات حضور اليوم</div>
              ) : (
                data.recentLogs.map((log: any) => (
                  <div
                    key={log.id || Math.random().toString()}
                    className="flex items-center justify-between gap-4 border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{log.employee?.name || log.name || "غير معروف"}</p>
                      <p className="text-sm text-muted-foreground">
                        {log.check_in
                          ? new Date(log.check_in).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })
                          : "--:--"}{" "}
                        - {log.check_out ? "خروج" : "دخول"}
                      </p>
                    </div>
                    <Badge variant={!log.check_out ? "success" : "destructive"}>
                      {!log.check_out ? "دخول" : "خروج"}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>طلبات الإجازات المعلقة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!data.pendingLeaveRequests || data.pendingLeaveRequests.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">لا توجد طلبات إجازات معلقة</div>
              ) : (
                data.pendingLeaveRequests.map((request: any) => (
                  <div
                    key={request.id || Math.random().toString()}
                    className="flex items-center justify-between gap-4 border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {request.employee?.name?.charAt(0) || request.name?.charAt(0) || "؟"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{request.employee?.name || request.name || "غير معروف"}</p>
                        <p className="text-sm text-muted-foreground">
                          {request.start_date} - {request.end_date}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-green-600 border-green-600">
                        موافقة
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-600">
                        رفض
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>آخر الموظفين المضافين</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!data.latestEmployees || data.latestEmployees.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">لا يوجد موظفين مضافين حديثاً</div>
              ) : (
                data.latestEmployees.map((employee: any) => (
                  <div
                    key={employee.id || Math.random().toString()}
                    className="flex items-center justify-between gap-4 border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>{employee.name?.charAt(0) || "؟"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{employee.name || "غير معروف"}</p>
                        <p className="text-sm text-muted-foreground">
                          {employee.department || "غير محدد"} - {employee.position || "غير محدد"}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      جديد
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>إجراءات سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link href="/reports">
              <Button className="gap-2">
                <FileDown className="h-4 w-4" />
                تصدير تقرير الحضور اليومي
              </Button>
            </Link>
            <Link href="/employees/add">
              <Button className="gap-2" variant="secondary">
                <UserPlus className="h-4 w-4" />
                إضافة موظف جديد
              </Button>
            </Link>
            <Link href="/devices">
              <Button className="gap-2" variant="outline">
                <RefreshCw className="h-4 w-4" />
                مزامنة بيانات البصمة
              </Button>
            </Link>
            <Link href="/leaves">
              <Button className="gap-2" variant="outline">
                <Calendar className="h-4 w-4" />
                إدارة الإجازات
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

function DashboardSkeleton() {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">لوحة التحكم</h1>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("ar-SA", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-lg font-medium">{new Date().toLocaleTimeString("ar-SA")}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 w-48 animate-pulse rounded bg-gray-200"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(3)].map((_, j) => (
                  <div
                    key={j}
                    className="flex items-center justify-between gap-4 border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200"></div>
                      <div>
                        <div className="h-5 w-32 animate-pulse rounded bg-gray-200"></div>
                        <div className="mt-1 h-4 w-48 animate-pulse rounded bg-gray-200"></div>
                      </div>
                    </div>
                    <div className="h-6 w-16 animate-pulse rounded bg-gray-200"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
