import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PlusIcon, FilterIcon, DownloadIcon, CalendarIcon } from "lucide-react"
import { getPendingLeaveRequests, getApprovedLeaveRequests } from "@/lib/actions/leaves"
import { LeaveRequestsTable } from "@/components/leave-requests-table"
import { AddLeaveRequestDialog } from "@/components/add-leave-request-dialog"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default function LeavesPage() {
  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">الإجازات</h1>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <FilterIcon className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <DownloadIcon className="h-4 w-4" />
            </Button>
          </div>
          <AddLeaveRequestDialog>
            <Button className="w-full sm:w-auto">
              <PlusIcon className="ml-2 h-4 w-4" />
              إضافة طلب إجازة
            </Button>
          </AddLeaveRequestDialog>
        </div>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="mb-4 grid w-full grid-cols-3">
          <TabsTrigger value="pending">الطلبات المعلقة</TabsTrigger>
          <TabsTrigger value="approved">الطلبات الموافق عليها</TabsTrigger>
          <TabsTrigger value="all">جميع الطلبات</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <Suspense fallback={<LeaveRequestsTableSkeleton />}>
            <PendingLeaveRequests />
          </Suspense>
        </TabsContent>
        <TabsContent value="approved">
          <Suspense fallback={<LeaveRequestsTableSkeleton />}>
            <ApprovedLeaveRequests />
          </Suspense>
        </TabsContent>
        <TabsContent value="all">
          <Suspense fallback={<LeaveRequestsTableSkeleton />}>
            <AllLeaveRequests />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

async function PendingLeaveRequests() {
  const leaveRequests = await getPendingLeaveRequests()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarIcon className="ml-2 h-5 w-5" />
          طلبات الإجازات المعلقة ({leaveRequests.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <LeaveRequestsTable requests={leaveRequests} showActions={true} />
      </CardContent>
    </Card>
  )
}

async function ApprovedLeaveRequests() {
  const leaveRequests = await getApprovedLeaveRequests()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarIcon className="ml-2 h-5 w-5" />
          طلبات الإجازات الموافق عليها ({leaveRequests.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <LeaveRequestsTable requests={leaveRequests} showActions={false} />
      </CardContent>
    </Card>
  )
}

async function AllLeaveRequests() {
  const pendingRequests = await getPendingLeaveRequests()
  const approvedRequests = await getApprovedLeaveRequests()
  const allRequests = [...pendingRequests, ...approvedRequests]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarIcon className="ml-2 h-5 w-5" />
          جميع طلبات الإجازات ({allRequests.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <LeaveRequestsTable requests={allRequests} showActions={true} />
      </CardContent>
    </Card>
  )
}

function LeaveRequestsTableSkeleton() {
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
