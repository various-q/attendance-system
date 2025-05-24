"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash } from "lucide-react"
import Link from "next/link"

interface EmployeeCardProps {
  employee: {
    id: number
    name: string
    department: string
    position: string
    hire_date: string
    fingerprint_id?: string
    active_status?: string
    email?: string
    phone?: string
  }
  onDelete?: (id: number) => void
}

export function EmployeeCard({ employee, onDelete }: EmployeeCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-1 bg-gradient-to-r from-blue-600 to-teal-500"></div>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-lg">{employee.name}</CardTitle>
          </div>
          <Badge variant={employee.active_status === "نشط" ? "success" : "secondary"}>
            {employee.active_status || "نشط"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">القسم:</span>
            <span className="font-medium">{employee.department}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">المنصب:</span>
            <span className="font-medium">{employee.position}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">تاريخ التعيين:</span>
            <span className="font-medium">{new Date(employee.hire_date).toLocaleDateString("ar-SA")}</span>
          </div>
          {employee.fingerprint_id && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">رقم البصمة:</span>
              <span className="font-medium">{employee.fingerprint_id}</span>
            </div>
          )}
        </div>
        <div className="flex justify-between">
          <Link href={`/employees/${employee.id}`}>
            <Button variant="outline" size="sm">
              عرض التفاصيل
            </Button>
          </Link>
          <div className="flex gap-2">
            <Link href={`/employees/edit/${employee.id}`}>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(employee.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
