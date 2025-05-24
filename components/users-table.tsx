"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
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
import type { User } from "@/lib/actions/auth"

interface UsersTableProps {
  users: User[]
}

export function UsersTable({ users }: UsersTableProps) {
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState<number | null>(null)

  const handleDelete = async (id: number) => {
    try {
      setIsDeleting(id)
      // هنا يجب إضافة منطق حذف المستخدم
      toast({
        title: "تم حذف المستخدم بنجاح",
        description: "تم حذف المستخدم بنجاح من قاعدة البيانات",
      })
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف المستخدم",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("ar-SA")
    } catch (error) {
      return dateString
    }
  }

  // ترجمة دور المستخدم
  const translateRole = (role: string) => {
    switch (role) {
      case "admin":
        return "مسؤول النظام"
      case "hr":
        return "موارد بشرية"
      case "user":
        return "مستخدم"
      default:
        return role
    }
  }

  // لون شارة الدور
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "hr":
        return "default"
      case "user":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="responsive-table">
      {users.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">لا يوجد مستخدمين.</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الاسم</TableHead>
              <TableHead>الهوية الوطنية</TableHead>
              <TableHead>رقم الهاتف</TableHead>
              <TableHead>الدور</TableHead>
              <TableHead>تاريخ التسجيل</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.national_id}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(user.role)}>{translateRole(user.role)}</Badge>
                </TableCell>
                <TableCell>{formatDate(user.created_at)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>هل أنت متأكد من حذف هذا المستخدم؟</AlertDialogTitle>
                          <AlertDialogDescription>
                            هذا الإجراء لا يمكن التراجع عنه. سيتم حذف المستخدم نهائياً.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>إلغاء</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(user.id)}
                            disabled={isDeleting === user.id}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            {isDeleting === user.id ? "جاري الحذف..." : "حذف"}
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
