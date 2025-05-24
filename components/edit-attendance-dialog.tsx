"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { updateAttendanceRecord } from "@/lib/actions/attendance"

interface AttendanceRecord {
  id: number
  employee: {
    id: number
    name: string
    department: string
    position: string
  }
  employee_id: number
  check_in: string
  check_out?: string
  date: string
  status?: string
  late_minutes?: number
  overtime_minutes?: number
  notes?: string
}

interface EditAttendanceDialogProps {
  children: React.ReactNode
  record: AttendanceRecord
}

export function EditAttendanceDialog({ children, record }: EditAttendanceDialogProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // تحويل التاريخ والوقت إلى الصيغة المناسبة للنموذج
  const formatDateForInput = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toISOString().split("T")[0]
    } catch (error) {
      return new Date().toISOString().split("T")[0]
    }
  }

  const formatTimeForInput = (dateTimeString?: string) => {
    if (!dateTimeString) return ""
    try {
      const date = new Date(dateTimeString)
      return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
    } catch (error) {
      return ""
    }
  }

  const [formData, setFormData] = useState({
    date: formatDateForInput(record.date),
    check_in: formatTimeForInput(record.check_in),
    check_out: formatTimeForInput(record.check_out),
    status: record.status || "حاضر",
    late_minutes: (record.late_minutes || 0).toString(),
    overtime_minutes: (record.overtime_minutes || 0).toString(),
    notes: record.notes || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.check_in) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال وقت الحضور",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // تحويل القيم النصية إلى أرقام
      const updatedRecord = {
        ...formData,
        late_minutes: Number.parseInt(formData.late_minutes),
        overtime_minutes: Number.parseInt(formData.overtime_minutes),
      }

      const result = await updateAttendanceRecord(record.id, updatedRecord)

      if (result.success) {
        toast({
          title: "تم تحديث السجل بنجاح",
          description: "تم تحديث سجل الحضور بنجاح",
        })
        setOpen(false)
      } else {
        throw new Error(result.error || "فشل في تحديث السجل")
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث السجل",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>تعديل سجل حضور</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>الموظف</Label>
            <Input value={record.employee?.name || "غير معروف"} disabled />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">التاريخ</Label>
              <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">الحالة</Label>
              <Select
                name="status"
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="حاضر">حاضر</SelectItem>
                  <SelectItem value="متأخر">متأخر</SelectItem>
                  <SelectItem value="غائب">غائب</SelectItem>
                  <SelectItem value="إجازة">إجازة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="check_in">وقت الحضور</Label>
              <Input id="check_in" name="check_in" type="time" value={formData.check_in} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="check_out">وقت الانصراف</Label>
              <Input id="check_out" name="check_out" type="time" value={formData.check_out} onChange={handleChange} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="late_minutes">دقائق التأخير</Label>
              <Input
                id="late_minutes"
                name="late_minutes"
                type="number"
                min="0"
                value={formData.late_minutes}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="overtime_minutes">دقائق العمل الإضافي</Label>
              <Input
                id="overtime_minutes"
                name="overtime_minutes"
                type="number"
                min="0"
                value={formData.overtime_minutes}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">ملاحظات</Label>
            <Input id="notes" name="notes" value={formData.notes} onChange={handleChange} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              إلغاء
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "جاري التحديث..." : "تحديث"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
