"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { addHrUser } from "@/lib/actions/auth"
import { Eye, EyeOff } from "lucide-react"

export function AddHrUserDialog({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    nationalId: "",
    phone: "",
    password: "",
  })

  // التحقق من صحة الهوية الوطنية
  const validateNationalId = (id: string) => {
    return /^\d{10}$/.test(id)
  }

  // التحقق من صحة رقم الهاتف
  const validatePhone = (phone: string) => {
    return /^05\d{8}$/.test(phone)
  }

  // التحقق من صحة كلمة المرور
  const validatePassword = (password: string) => {
    return password.length >= 6
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // التحقق من صحة البيانات
    if (!formData.name.trim()) {
      toast({
        title: "خطأ في الاسم",
        description: "يرجى إدخال الاسم",
        variant: "destructive",
      })
      return
    }

    if (!validateNationalId(formData.nationalId)) {
      toast({
        title: "خطأ في الهوية الوطنية",
        description: "يجب أن تتكون الهوية الوطنية من 10 أرقام",
        variant: "destructive",
      })
      return
    }

    if (!validatePhone(formData.phone)) {
      toast({
        title: "خطأ في رقم الهاتف",
        description: "يجب أن يبدأ رقم الهاتف بـ 05 ويتكون من 10 أرقام",
        variant: "destructive",
      })
      return
    }

    if (!validatePassword(formData.password)) {
      toast({
        title: "خطأ في كلمة المرور",
        description: "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const result = await addHrUser(formData)

      if (result.success) {
        toast({
          title: "تمت الإضافة بنجاح",
          description: "تمت إضافة مسؤول الموارد البشرية بنجاح",
        })
        setOpen(false)
        setFormData({
          name: "",
          nationalId: "",
          phone: "",
          password: "",
        })
      } else {
        toast({
          title: "خطأ",
          description: result.error || "حدث خطأ أثناء إضافة مسؤول الموارد البشرية",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة مسؤول الموارد البشرية",
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
          <DialogTitle>إضافة مسؤول موارد بشرية جديد</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">الاسم</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="أدخل الاسم الكامل"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nationalId">الهوية الوطنية</Label>
            <Input
              id="nationalId"
              name="nationalId"
              value={formData.nationalId}
              onChange={handleChange}
              placeholder="أدخل الهوية الوطنية (10 أرقام)"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">رقم الهاتف</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="أدخل رقم الهاتف (05xxxxxxxx)"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="أدخل كلمة المرور (6 أحرف على الأقل)"
                required
              />
              <button
                type="button"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
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
