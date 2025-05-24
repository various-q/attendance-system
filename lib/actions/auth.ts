"use server"

import { cookies } from "next/headers"
import { getSupabaseServer } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

// نوع بيانات تسجيل الدخول
interface LoginData {
  nationalId: string
  password: string
}

// نوع بيانات التسجيل
interface RegisterData {
  name: string
  nationalId: string
  phone: string
  password: string
}

// نوع بيانات المستخدم
export interface User {
  id: number
  name: string
  national_id: string
  phone: string
  role: "admin" | "hr" | "user"
  created_at: string
}

// تسجيل الدخول
export async function loginUser(data: LoginData) {
  try {
    const supabase = getSupabaseServer()

    // التحقق من وجود عميل Supabase
    if (!supabase) {
      console.error("Supabase client is not available")
      return { success: false, error: "خطأ في الاتصال بقاعدة البيانات" }
    }

    // البحث عن المستخدم بواسطة الهوية الوطنية
    const { data: user, error } = await supabase.from("users").select("*").eq("national_id", data.nationalId).single()

    if (error || !user) {
      console.error("Error finding user:", error)
      return { success: false, error: "الهوية الوطنية أو كلمة المرور غير صحيحة" }
    }

    // التحقق من كلمة المرور (في الواقع يجب استخدام تشفير أفضل)
    if (user.password !== data.password) {
      return { success: false, error: "الهوية الوطنية أو كلمة المرور غير صحيحة" }
    }

    // إنشاء جلسة للمستخدم
    const session = {
      userId: user.id,
      name: user.name,
      nationalId: user.national_id,
      role: user.role,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // تنتهي بعد 24 ساعة
    }

    // تخزين الجلسة في ملفات تعريف الارتباط
    cookies().set("session", JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 ساعة
      path: "/",
    })

    return { success: true, user }
  } catch (error) {
    console.error("Error in loginUser:", error)
    return { success: false, error: "حدث خطأ أثناء تسجيل الدخول" }
  }
}

// تسجيل مستخدم جديد
export async function registerUser(data: RegisterData) {
  try {
    const supabase = getSupabaseServer()

    // التحقق من وجود عميل Supabase
    if (!supabase) {
      console.error("Supabase client is not available")
      return { success: false, error: "خطأ في الاتصال بقاعدة البيانات" }
    }

    // التحقق من عدم وجود مستخدم بنفس الهوية الوطنية
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("national_id", data.nationalId)
      .single()

    if (existingUser) {
      return { success: false, error: "الهوية الوطنية مسجلة بالفعل" }
    }

    // إنشاء مستخدم جديد
    const { data: newUser, error } = await supabase
      .from("users")
      .insert([
        {
          name: data.name,
          national_id: data.nationalId,
          phone: data.phone,
          password: data.password, // في الواقع يجب تشفير كلمة المرور
          role: "user", // المستخدمون الجدد لهم دور "user" افتراضيًا
        },
      ])
      .select()

    if (error) {
      console.error("Error creating user:", error)
      return { success: false, error: "حدث خطأ أثناء إنشاء المستخدم" }
    }

    return { success: true, user: newUser[0] }
  } catch (error) {
    console.error("Error in registerUser:", error)
    return { success: false, error: "حدث خطأ أثناء التسجيل" }
  }
}

// تسجيل الخروج
export async function logoutUser() {
  cookies().delete("session")
  redirect("/")
}

// الحصول على المستخدم الحالي
export async function getCurrentUser(): Promise<User | null> {
  try {
    const sessionCookie = cookies().get("session")

    if (!sessionCookie) {
      return null
    }

    const session = JSON.parse(sessionCookie.value)

    // التحقق من انتهاء صلاحية الجلسة
    if (session.expiresAt < Date.now()) {
      cookies().delete("session")
      return null
    }

    const supabase = getSupabaseServer()

    // التحقق من وجود عميل Supabase
    if (!supabase) {
      console.error("Supabase client is not available")
      return null
    }

    // الحصول على بيانات المستخدم
    const { data: user, error } = await supabase.from("users").select("*").eq("id", session.userId).single()

    if (error || !user) {
      console.error("Error fetching user:", error)
      cookies().delete("session")
      return null
    }

    return user as User
  } catch (error) {
    console.error("Error in getCurrentUser:", error)
    cookies().delete("session")
    return null
  }
}

// التحقق من صلاحية المستخدم
export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/")
  }

  return user
}

// التحقق من صلاحية المسؤول
export async function requireAdmin() {
  const user = await getCurrentUser()

  if (!user || user.role !== "admin") {
    redirect("/")
  }

  return user
}

// إضافة مستخدم موارد بشرية
export async function addHrUser(data: RegisterData) {
  try {
    const supabase = getSupabaseServer()

    // التحقق من وجود عميل Supabase
    if (!supabase) {
      console.error("Supabase client is not available")
      return { success: false, error: "خطأ في الاتصال بقاعدة البيانات" }
    }

    // التحقق من عدم وجود مستخدم بنفس الهوية الوطنية
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("national_id", data.nationalId)
      .single()

    if (existingUser) {
      return { success: false, error: "الهوية الوطنية مسجلة بالفعل" }
    }

    // إنشاء مستخدم موارد بشرية جديد
    const { data: newUser, error } = await supabase
      .from("users")
      .insert([
        {
          name: data.name,
          national_id: data.nationalId,
          phone: data.phone,
          password: data.password,
          role: "hr", // مستخدم موارد بشرية
        },
      ])
      .select()

    if (error) {
      console.error("Error creating HR user:", error)
      return { success: false, error: "حدث خطأ أثناء إنشاء مستخدم الموارد البشرية" }
    }

    return { success: true, user: newUser[0] }
  } catch (error) {
    console.error("Error in addHrUser:", error)
    return { success: false, error: "حدث خطأ أثناء إضافة مستخدم الموارد البشرية" }
  }
}

// الحصول على جميع المستخدمين
export async function getAllUsers() {
  try {
    const supabase = getSupabaseServer()

    // التحقق من وجود عميل Supabase
    if (!supabase) {
      console.error("Supabase client is not available")
      return []
    }

    const { data: users, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching users:", error)
      return []
    }

    return users as User[]
  } catch (error) {
    console.error("Error in getAllUsers:", error)
    return []
  }
}
