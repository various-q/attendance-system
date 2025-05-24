"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Upload, X } from "lucide-react"
import Image from "next/image"

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [siteName, setSiteName] = useState("نظام الحضور والانصراف")
  const [logoPreview, setLogoPreview] = useState<string | null>("/logo.png")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // التحقق من نوع الملف
      if (!file.type.startsWith("image/")) {
        toast({
          title: "خطأ",
          description: "يرجى اختيار ملف صورة صالح",
          variant: "destructive",
        })
        return
      }

      // التحقق من حجم الملف (الحد الأقصى 2 ميجابايت)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "خطأ",
          description: "يجب أن يكون حجم الصورة أقل من 2 ميجابايت",
          variant: "destructive",
        })
        return
      }

      // إنشاء عنوان URL للصورة المحددة
      const reader = new FileReader()
      reader.onload = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveLogo = () => {
    setLogoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsSubmitting(true)

      // هنا يجب إضافة منطق حفظ الإعدادات

      toast({
        title: "تم الحفظ بنجاح",
        description: "تم حفظ إعدادات النظام بنجاح",
      })
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ الإعدادات",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">إعدادات النظام</h1>

      <Card>
        <CardHeader>
          <CardTitle>الإعدادات العامة</CardTitle>
          <CardDescription>تعديل الإعدادات العامة للنظام</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="siteName">اسم النظام</Label>
              <Input
                id="siteName"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="أدخل اسم النظام"
              />
            </div>

            <div className="space-y-2">
              <Label>شعار النظام</Label>
              <div className="flex items-center gap-4">
                {logoPreview ? (
                  <div className="relative h-24 w-24 overflow-hidden rounded-lg border">
                    <Image src={logoPreview || "/placeholder.svg"} alt="شعار النظام" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-lg border border-dashed">
                    <span className="text-sm text-gray-500">لا يوجد شعار</span>
                  </div>
                )}
                <div>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                    id="logo-upload"
                  />
                  <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="ml-2 h-4 w-4" />
                    {logoPreview ? "تغيير الشعار" : "رفع شعار"}
                  </Button>
                  <p className="mt-1 text-xs text-gray-500">يجب أن يكون حجم الصورة أقل من 2 ميجابايت</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "جاري الحفظ..." : "حفظ الإعدادات"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
