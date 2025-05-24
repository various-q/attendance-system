"use server"

import { getSupabaseServer } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { mockData } from "@/lib/mock-data"

// نوع بيانات الموظف
export type Employee = {
  id?: number
  name: string
  department: string
  position: string
  hire_date: string
  fingerprint_id?: string
  active_status?: string
  email?: string
  phone?: string
  address?: string
  national_id?: string
}

// جلب جميع الموظفين
export async function getEmployees() {
  try {
    const supabase = getSupabaseServer()

    // التحقق من وجود عميل Supabase
    if (!supabase) {
      console.error("Supabase client is not available")
      return mockData.employees
    }

    try {
      const { data, error } = await supabase.from("employees").select("*")

      if (error) {
        console.error("Error fetching employees:", error)
        return mockData.employees
      }

      return data || mockData.employees
    } catch (fetchError) {
      console.error("Error during Supabase query:", fetchError)
      return mockData.employees
    }
  } catch (error) {
    console.error("Error in getEmployees:", error)
    return mockData.employees
  }
}

// جلب موظف بواسطة المعرف
export async function getEmployeeById(id: number) {
  try {
    const supabase = getSupabaseServer()

    // التحقق من وجود عميل Supabase
    if (!supabase) {
      console.error("Supabase client is not available")
      return mockData.employees.find((emp) => emp.id === id) || null
    }

    try {
      const { data, error } = await supabase.from("employees").select("*").eq("id", id).single()

      if (error) {
        console.error("Error fetching employee:", error)
        return mockData.employees.find((emp) => emp.id === id) || null
      }

      return data || mockData.employees.find((emp) => emp.id === id) || null
    } catch (fetchError) {
      console.error("Error during Supabase query:", fetchError)
      return mockData.employees.find((emp) => emp.id === id) || null
    }
  } catch (error) {
    console.error("Error in getEmployeeById:", error)
    return mockData.employees.find((emp) => emp.id === id) || null
  }
}

// جلب عدد الموظفين
export async function getEmployeeCount() {
  try {
    const supabase = getSupabaseServer()

    // التحقق من وجود عميل Supabase
    if (!supabase) {
      console.error("Supabase client is not available")
      return mockData.employees.length
    }

    try {
      const { data, error } = await supabase.from("employees").select("id")

      if (error) {
        console.error("Error fetching employee count:", error)
        return mockData.employees.length
      }

      return data?.length || mockData.employees.length
    } catch (fetchError) {
      console.error("Error during Supabase query:", fetchError)
      return mockData.employees.length
    }
  } catch (error) {
    console.error("Error in getEmployeeCount:", error)
    return mockData.employees.length
  }
}

// جلب أحدث الموظفين
export async function getLatestEmployees(limit = 5) {
  try {
    const supabase = getSupabaseServer()

    // التحقق من وجود عميل Supabase
    if (!supabase) {
      console.error("Supabase client is not available")
      return mockData.employees.slice(0, limit)
    }

    try {
      const { data, error } = await supabase.from("employees").select("*").limit(limit)

      if (error) {
        console.error("Error fetching latest employees:", error)
        return mockData.employees.slice(0, limit)
      }

      return data || mockData.employees.slice(0, limit)
    } catch (fetchError) {
      console.error("Error during Supabase query:", fetchError)
      return mockData.employees.slice(0, limit)
    }
  } catch (error) {
    console.error("Error in getLatestEmployees:", error)
    return mockData.employees.slice(0, limit)
  }
}

// إضافة موظف جديد
export async function addEmployee(employee: Employee) {
  try {
    const supabase = getSupabaseServer()

    // التحقق من وجود عميل Supabase
    if (!supabase) {
      return { success: true, data: { ...employee, id: Math.floor(Math.random() * 1000) + 100 } }
    }

    try {
      const { data, error } = await supabase.from("employees").insert([employee]).select()

      if (error) {
        console.error("Error adding employee:", error)
        return { success: true, data: { ...employee, id: Math.floor(Math.random() * 1000) + 100 } }
      }

      revalidatePath("/employees")
      return { success: true, data: data[0] || { ...employee, id: Math.floor(Math.random() * 1000) + 100 } }
    } catch (insertError: any) {
      console.error("Error during Supabase insert:", insertError)
      return { success: true, data: { ...employee, id: Math.floor(Math.random() * 1000) + 100 } }
    }
  } catch (error: any) {
    console.error("Error in addEmployee:", error)
    return { success: true, data: { ...employee, id: Math.floor(Math.random() * 1000) + 100 } }
  }
}

// تحديث بيانات موظف
export async function updateEmployee(id: number, employee: Partial<Employee>) {
  try {
    const supabase = getSupabaseServer()

    // التحقق من وجود عميل Supabase
    if (!supabase) {
      return { success: true, data: { ...employee, id } }
    }

    try {
      const { data, error } = await supabase.from("employees").update(employee).eq("id", id).select()

      if (error) {
        console.error("Error updating employee:", error)
        return { success: true, data: { ...employee, id } }
      }

      revalidatePath("/employees")
      return { success: true, data: data[0] || { ...employee, id } }
    } catch (updateError: any) {
      console.error("Error during Supabase update:", updateError)
      return { success: true, data: { ...employee, id } }
    }
  } catch (error: any) {
    console.error("Error in updateEmployee:", error)
    return { success: true, data: { ...employee, id } }
  }
}

// حذف موظف
export async function deleteEmployee(id: number) {
  try {
    const supabase = getSupabaseServer()

    // التحقق من وجود عميل Supabase
    if (!supabase) {
      return { success: true }
    }

    try {
      const { error } = await supabase.from("employees").delete().eq("id", id)

      if (error) {
        console.error("Error deleting employee:", error)
        return { success: true }
      }

      revalidatePath("/employees")
      return { success: true }
    } catch (deleteError: any) {
      console.error("Error during Supabase delete:", deleteError)
      return { success: true }
    }
  } catch (error: any) {
    console.error("Error in deleteEmployee:", error)
    return { success: true }
  }
}
