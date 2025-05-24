"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { deleteAttendanceRecord } from "@/lib/actions/attendance"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { EditAttendanceDialog } from "@/components/edit-attendance-dialog"

interface AttendanceRecord {
  id: number
  employee: {
    id: number
    name: string
    department: string
    position: string
  }
  check_in: string
  check_out?: string
  date: string
  status?: string
  late_minutes?: number
  overtime_minutes?: number
}

interface AttendanceTableProps {
  records: AttendanceRecord[]
}

export function AttendanceTable({ records }: AttendanceTableProps) {
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState<number | null>(null)

  const handleDelete = async (id: number) => {
    try {
      setIsDeleting(id)
      const result = await deleteAttendanceRecord(id)

      if (result.success) {
        toast({
          title: "تم حذف السجل بنجاح",
          description: "تم حذف سجل الحضور بنجاح",
        })
      } else {
        throw new Error(result.error || "فشل في حذف السجل")
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف السجل",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  // حساب ساعات العمل
  const calculateWorkHours = (checkIn?: string, checkOut?: string) => {
    if (!checkIn || !checkOut) return "غير مكتمل"

    const checkInTime = new Date(checkIn).getTime()
    const checkOutTime = new Date(checkOut).getTime()

    if (isNaN(checkInTime) || isNaN(checkOutTime)) return "غير صالح"

    const diffMs = checkOutTime - checkInTime
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    return `${diffHrs} ساعة و ${diffMins} دقيقة`
  }

  // تنسيق الوقت
  const formatTime = (timeString?: string) => {
    if (!timeString) return "--:--"
    try {
      return new Date(timeString).toLocaleTimeString("ar-SA", {
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      return "--:--"
    }
  }

  return (
    <div className="responsive-table">
      {records.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">لا توجد سجلات حضور لهذا اليوم</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الموظف</TableHead>
              <TableHead>القسم</TableHead>
              <TableHead>وقت الحضور</TableHead>
              <TableHead>وقت الانصراف</TableHead>
              <TableHead>ساعات العمل</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.employee?.name || "غير معروف"}</TableCell>
                <TableCell>{record.employee?.department || "غير معروف"}</TableCell>
                <TableCell>{formatTime(record.check_in)}</TableCell>
                <TableCell>{formatTime(record.check_out)}</TableCell>
                <TableCell>{calculateWorkHours(record.check_in, record.check_out)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      record.status === "حاضر"
                        ? "success"
                        : record.status === "متأخر"
                          ? "warning"
                          : record.status === "غائب"
                            ? "destructive"
                            : "outline"
                    }
                  >
                    {record.status || "غير محدد"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <EditAttendanceDialog record={record}>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </EditAttendanceDialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>هل أنت متأكد من حذف هذا السجل؟</AlertDialogTitle>
                          <AlertDialogDescription>
                            هذا الإجراء لا يمكن التراجع عنه. سيتم حذف سجل الحضور نهائياً.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>إلغاء</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(record.id)}
                            disabled={isDeleting === record.id}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            {isDeleting === record.id ? "جاري الحذف..." : "حذف"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
