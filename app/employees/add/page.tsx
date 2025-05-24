"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { addEmployee } from "@/lib/actions/employees"
import { ArrowRight } from "lucide-react"

export default function AddEmployeePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    position: "",
    hire_date: new Date().toISOString().split("T")[0],
    fingerprint_id: "",
    active_status: "نشط",
    email: "",
    phone: "",
    address: "",
    national_id: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.department || !formData.position || !formData.hire_date) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const result = await addEmployee(formData)

      if (result.success) {
        toast({
          title: "تم إضافة الموظف بنجاح",
          description: "تمت إضافة الموظف بنجاح إلى قاعدة البيانات",
        })
        router.push("/employees")
      } else {
        throw new Error(result.error || "فشل في إضافة الموظف")
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة الموظف",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" onClick={() => router.back()} className="ml-2">
          <ArrowRight className="h-4 w-4 ml-2" />
          رجوع
        </Button>
        <h1 className="text-2xl font-bold">إضافة موظف جديد</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>معلومات الموظف</CardTitle>
          <CardDescription>أدخل معلومات الموظف الجديد</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  اسم الموظف <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="أدخل اسم الموظف"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">
                  القسم <span className="text-red-500">*</span>
                </Label>
                <Select
                  name="department"
                  value={formData.department}
                  onValueChange={(value) => handleSelectChange("department", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر القسم" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="تقنية المعلومات">تقنية المعلومات</SelectItem>
                    <SelectItem value="الموارد البشرية">الموارد البشرية</SelectItem>
                    <SelectItem value="المالية">المالية</SelectItem>
                    <SelectItem value="المبيعات">المبيعات</SelectItem>
                    <SelectItem value="التسويق">التسويق</SelectItem>
                    <SelectItem value="خدمة العملاء">خدمة العملاء</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">
                  المنصب <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="أدخل المنصب الوظيفي"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hire_date">
                  تاريخ التعيين <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="hire_date"
                  name="hire_date"
                  type="date"
                  value={formData.hire_date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fingerprint_id">رقم البصمة</Label>
                <Input
                  id="fingerprint_id"
                  name="fingerprint_id"
                  value={formData.fingerprint_id}
                  onChange={handleChange}
                  placeholder="أدخل رقم البصمة"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="active_status">الحالة</Label>
                <Select
                  name="active_status"
                  value={formData.active_status}
                  onValueChange={(value) => handleSelectChange("active_status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="نشط">نشط</SelectItem>
                    <SelectItem value="غير نشط">غير نشط</SelectItem>
                    <SelectItem value="إجازة">إجازة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="أدخل البريد الإلكتروني"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="أدخل رقم الهاتف"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="national_id">رقم الهوية</Label>
                <Input
                  id="national_id"
                  name="national_id"
                  value={formData.national_id}
                  onChange={handleChange}
                  placeholder="أدخل رقم الهوية"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">العنوان</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="أدخل العنوان"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.push("/employees")}>
                إلغاء
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "جاري الإضافة..." : "إضافة الموظف"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
