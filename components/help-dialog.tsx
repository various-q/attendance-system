"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HelpCircle } from "lucide-react"

export function HelpDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleAuthenticate = () => {
    if (password === "9999") {
      setIsAuthenticated(true)
      setError("")
    } else {
      setError("كلمة المرور غير صحيحة")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAuthenticate()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="fixed bottom-4 left-4 z-50">
          <HelpCircle className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>تعليمات النظام</DialogTitle>
        </DialogHeader>

        {!isAuthenticated ? (
          <div className="space-y-4">
            <p>يرجى إدخال كلمة المرور للوصول إلى تعليمات النظام</p>
            <div className="flex gap-2">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="كلمة المرور"
              />
              <Button onClick={handleAuthenticate}>تأكيد</Button>
            </div>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        ) : (
          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general">عام</TabsTrigger>
              <TabsTrigger value="employees">الموظفين</TabsTrigger>
              <TabsTrigger value="attendance">الحضور</TabsTrigger>
              <TabsTrigger value="leaves">الإجازات</TabsTrigger>
              <TabsTrigger value="devices">الأجهزة</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="space-y-4 mt-4">
              <h3 className="text-lg font-semibold">تعليمات عامة</h3>
              <p>نظام الحضور والانصراف هو نظام متكامل لإدارة حضور وانصراف الموظفين. يتيح النظام:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>إدارة بيانات الموظفين</li>
                <li>تسجيل الحضور والانصراف</li>
                <li>إدارة طلبات الإجازات</li>
                <li>التكامل مع أجهزة البصمة</li>
                <li>إنشاء تقارير متنوعة</li>
              </ul>
            </TabsContent>
            <TabsContent value="employees" className="space-y-4 mt-4">
              <h3 className="text-lg font-semibold">إدارة الموظفين</h3>
              <p>يمكنك إدارة بيانات الموظفين من خلال:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>إضافة موظف جديد: انقر على زر "إضافة موظف" في صفحة الموظفين</li>
                <li>تعديل بيانات موظف: انقر على زر "تعديل" بجانب الموظف المطلوب</li>
                <li>عرض تفاصيل موظف: انقر على اسم الموظف لعرض تفاصيله</li>
                <li>حذف موظف: انقر على زر "حذف" بجانب الموظف المطلوب</li>
              </ul>
            </TabsContent>
            <TabsContent value="attendance" className="space-y-4 mt-4">
              <h3 className="text-lg font-semibold">إدارة الحضور والانصراف</h3>
              <p>يمكنك إدارة سجلات الحضور والانصراف من خلال:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>عرض سجلات الحضور: اختر التاريخ المطلوب من منتقي التاريخ</li>
                <li>إضافة سجل حضور يدوي: انقر على زر "إضافة سجل حضور"</li>
                <li>مزامنة سجلات الحضور: انقر على زر "مزامنة" في صفحة الأجهزة</li>
              </ul>
            </TabsContent>
            <TabsContent value="leaves" className="space-y-4 mt-4">
              <h3 className="text-lg font-semibold">إدارة الإجازات</h3>
              <p>يمكنك إدارة طلبات الإجازات من خلال:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>إضافة طلب إجازة: انقر على زر "إضافة طلب إجازة"</li>
                <li>الموافقة على طلب إجازة: انقر على زر "موافقة" بجانب الطلب</li>
                <li>رفض طلب إجازة: انقر على زر "رفض" بجانب الطلب</li>
              </ul>
            </TabsContent>
            <TabsContent value="devices" className="space-y-4 mt-4">
              <h3 className="text-lg font-semibold">إدارة أجهزة البصمة</h3>
              <p>يمكنك إدارة أجهزة البصمة من خلال:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>إضافة جهاز جديد: انقر على زر "إضافة جهاز"</li>
                <li>تعديل بيانات جهاز: انقر على زر "تعديل" بجانب الجهاز</li>
                <li>مزامنة سجلات الحضور: انقر على زر "مزامنة" بجانب الجهاز</li>
                <li>حذف جهاز: انقر على زر "حذف" بجانب الجهاز</li>
              </ul>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}
