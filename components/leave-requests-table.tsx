"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { CheckIcon, XIcon } from "lucide-react"
import { approveLeaveRequest, rejectLeaveRequest } from "@/lib/actions/leaves"

interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  type: string
  dateStart: Date
  dateEnd: Date
  reason: string
  status: "pending" | "approved" | "rejected"
  createdAt: Date
}

interface LeaveRequestsTableProps {
  requests: LeaveRequest[]
  showActions?: boolean
}

export function LeaveRequestsTable({ requests, showActions = false }: LeaveRequestsTableProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleApprove = async (id: string) => {
    setLoading(id)
    try {
      await approveLeaveRequest(id)
    } catch (error) {
      console.error("Error approving leave request:", error)
    } finally {
      setLoading(null)
    }
  }

  const handleReject = async (id: string) => {
    setLoading(id)
    try {
      await rejectLeaveRequest(id)
    } catch (error) {
      console.error("Error rejecting leave request:", error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>الموظف</TableHead>
          <TableHead>نوع الإجازة</TableHead>
          <TableHead>تاريخ البداية</TableHead>
          <TableHead>تاريخ النهاية</TableHead>
          <TableHead>السبب</TableHead>
          <TableHead>الحالة</TableHead>
          {showActions && <TableHead>الإجراءات</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id}>
            <TableCell>{request.employeeName}</TableCell>
            <TableCell>{request.type}</TableCell>
            <TableCell>
              {format(request.dateStart, "dd MMM yyyy", { locale: ar })}
            </TableCell>
            <TableCell>
              {format(request.dateEnd, "dd MMM yyyy", { locale: ar })}
            </TableCell>
            <TableCell>{request.reason}</TableCell>
            <TableCell>
              <Badge
                variant={
                  request.status === "approved"
                    ? "default"
                    : request.status === "rejected"
                    ? "destructive"
                    : "secondary"
                }
              >
                {request.status === "approved"
                  ? "موافق عليها"
                  : request.status === "rejected"
                  ? "مرفوضة"
                  : "معلقة"}
              </Badge>
            </TableCell>
            {showActions && request.status === "pending" && (
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleApprove(request.id)}
                    disabled={loading === request.id}
                  >
                    <CheckIcon className="h-4 w-4 text-green-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleReject(request.id)}
                    disabled={loading === request.id}
                  >
                    <XIcon className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
} 