"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { addAttendanceRecord } from "@/lib/actions/attendance"
import { getEmployees } from "@/lib/actions/employees"
import { useEffect } from "react"

export function AddAttendanceDialog({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [employees, setEmployees] = useState<any[]>([])
  const [formData, setFormData] = useState({
    employee_id: "",
    date: new Date().toISOString().split("T")[0],
    check_in: "",
    check_out: "",
    status: "حاضر",
    late_minutes: "0",
    overtime_minutes: "0",
    notes: "",
  })

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const employeeData = await getEmployees()
        setEmployees(employeeData)
      } catch (error) {
        console.error("Error fetching employees:", error)
        toast({
          title: "خطأ",
          description: "فشل في جلب بيانات الموظفين",
          variant: "destructive",
        })
      }
    }

    if (open) {
      fetchEmployees()
    }
  }, [open, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.employee_id) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار الموظف",
        variant: "destructive",
      })
      return
    }

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
      const record = {
        ...formData,
        employee_id: Number.parseInt(formData.employee_id),
        late_minutes: Number.parseInt(formData.late_minutes),
        overtime_minutes: Number.parseInt(formData.overtime_minutes),
      }

      const result = await addAttendanceRecord(record)

      if (result.success) {
        toast({
          title: "تم إضافة السجل بنجاح",
          description: "تم إضافة سجل الحضور بنجاح",
        })
        setOpen(false)
        setFormData({
          employee_id: "",
          date: new Date().toISOString().split("T")[0],
          check_in: "",
          check_out: "",
          status: "حاضر",
          late_minutes: "0",
          overtime_minutes: "0",
          notes: "",
        })
      } else {
        throw new Error(result.error || "فشل في إضافة السجل")
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة السجل",
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
          <DialogTitle>إضافة سجل حضور جديد</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employee_id">الموظف</Label>
              <Select
                name="employee_id"
                value={formData.employee_id}
                onValueChange={(value) => handleSelectChange("employee_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الموظف" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id.toString()}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">التاريخ</Label>
              <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} />
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
          <div className="grid grid-cols-3 gap-4">
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
              {isSubmitting ? "جاري الإضافة..." : "إضافة"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
