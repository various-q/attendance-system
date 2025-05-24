"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CalendarDays,
  Home,
  Users,
  Settings,
  LogOut,
  Fingerprint,
  BarChart3,
  Clock,
  FileText,
  UserCog,
  ImageIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { logoutUser, getCurrentUser } from "@/lib/actions/auth"

export function AppSidebar() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await getCurrentUser()
        setUser(userData)
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  // إذا كنا في صفحة تسجيل الدخول، لا نعرض الشريط الجانبي
  if (pathname === "/") {
    return null
  }

  // إذا كان المستخدم غير موجود، لا نعرض الشريط الجانبي
  if (!loading && !user) {
    return null
  }

  // تحديد العناصر التي ستظهر في الشريط الجانبي بناءً على دور المستخدم
  const sidebarItems = [
    {
      title: "لوحة التحكم",
      href: "/dashboard",
      icon: Home,
      roles: ["admin", "hr", "user"],
    },
    {
      title: "الموظفين",
      href: "/employees",
      icon: Users,
      roles: ["admin", "hr"],
    },
    {
      title: "الحضور والانصراف",
      href: "/attendance",
      icon: Clock,
      roles: ["admin", "hr", "user"],
    },
    {
      title: "الإجازات",
      href: "/leaves",
      icon: CalendarDays,
      roles: ["admin", "hr", "user"],
    },
    {
      title: "الاستئذانات",
      href: "/permissions",
      icon: FileText,
      roles: ["admin", "hr", "user"],
    },
    {
      title: "أجهزة البصمة",
      href: "/devices",
      icon: Fingerprint,
      roles: ["admin", "hr"],
    },
    {
      title: "التقارير",
      href: "/reports",
      icon: BarChart3,
      roles: ["admin", "hr"],
    },
    {
      title: "إدارة المستخدمين",
      href: "/admin/users",
      icon: UserCog,
      roles: ["admin"],
    },
    {
      title: "إعدادات النظام",
      href: "/admin/settings",
      icon: ImageIcon,
      roles: ["admin"],
    },
    {
      title: "الإعدادات",
      href: "/settings",
      icon: Settings,
      roles: ["admin", "hr", "user"],
    },
  ]

  // تصفية العناصر بناءً على دور المستخدم
  const filteredItems = user
    ? sidebarItems.filter((item) => item.roles.includes(user.role))
    : sidebarItems.filter((item) => item.roles.includes("user"))

  return (
    <Sidebar className="border-e">
      <SidebarHeader className="flex h-14 items-center border-b px-4 lg:h-[60px] bg-gradient-to-r from-blue-600 to-teal-500">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-white">
          <Fingerprint className="h-6 w-6" />
          <span className="text-xl">نظام الحضور والانصراف</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{user?.name?.charAt(0) || "م"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user?.name || "مستخدم النظام"}</p>
              <p className="text-xs text-muted-foreground">
                {user?.role === "admin" ? "مسؤول النظام" : user?.role === "hr" ? "موارد بشرية" : "مستخدم"}
              </p>
            </div>
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="flex flex-col gap-2 p-4">
            {filteredItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "justify-start",
                  pathname === item.href && "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700",
                )}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="ml-2 h-5 w-5" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <form action={logoutUser}>
          <Button type="submit" variant="outline" className="w-full justify-start">
            <LogOut className="ml-2 h-5 w-5" />
            تسجيل الخروج
          </Button>
        </form>
      </SidebarFooter>
    </Sidebar>
  )
}
