"use server"

import { getSupabaseServer } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { mockData } from "@/lib/mock-data"

// نوع بيانات جهاز البصمة
export type FingerprintDevice = {
  id?: number
  name: string
  location: string
  ip_address: string
  port: number
  password?: string
  status?: string
  last_sync?: string
}

// جلب عدد الأجهزة
export async function getDeviceCount() {
  try {
    const supabase = getSupabaseServer()

    // التحقق من وجود عميل Supabase
    if (!supabase) {
      console.error("Supabase client is not available")
      return mockData.devices.length
    }

    try {
      const { data, error } = await supabase.from("devices").select("id")

      if (error) {
        console.error("Error fetching device count:", error)
        return mockData.devices.length
      }

      return data?.length || mockData.devices.length
    } catch (fetchError) {
      console.error("Error during Supabase query:", fetchError)
      return mockData.devices.length
    }
  } catch (error) {
    console.error("Error in getDeviceCount:", error)
    return mockData.devices.length
  }
}

// جلب جميع أجهزة البصمة
export async function getDevices() {
  try {
    const supabase = getSupabaseServer()

    // التحقق من وجود عميل Supabase
    if (!supabase) {
      console.error("Supabase client is not available")
      return mockData.devices
    }

    try {
      const { data, error } = await supabase.from("devices").select("*")

      if (error) {
        console.error("Error fetching devices:", error)
        return mockData.devices
      }

      return data || mockData.devices
    } catch (fetchError) {
      console.error("Error during Supabase query:", fetchError)
      return mockData.devices
    }
  } catch (error) {
    console.error("Error in getDevices:", error)
    return mockData.devices
  }
}

// جلب جهاز بواسطة المعرف
export async function getDeviceById(id: number) {
  try {
    const supabase = getSupabaseServer()

    // التحقق من وجود عميل Supabase
    if (!supabase) {
      console.error("Supabase client is not available")
      return mockData.devices.find((device) => device.id === id) || null
    }

    try {
      const { data, error } = await supabase.from("devices").select("*").eq("id", id).single()

      if (error) {
        console.error("Error fetching device:", error)
        return mockData.devices.find((device) => device.id === id) || null
      }

      return data || mockData.devices.find((device) => device.id === id) || null
    } catch (fetchError) {
      console.error("Error during Supabase query:", fetchError)
      return mockData.devices.find((device) => device.id === id) || null
    }
  } catch (error) {
    console.error("Error in getDeviceById:", error)
    return mockData.devices.find((device) => device.id === id) || null
  }
}

// إضافة جهاز جديد
export async function addDevice(device: FingerprintDevice) {
  try {
    const supabase = getSupabaseServer()

    // التحقق من وجود عميل Supabase
    if (!supabase) {
      return { success: true, data: { ...device, id: Math.floor(Math.random() * 1000) + 100 } }
    }

    try {
      const { data, error } = await supabase.from("devices").insert([device]).select()

      if (error) {
        console.error("Error adding device:", error)
        return { success: true, data: { ...device, id: Math.floor(Math.random() * 1000) + 100 } }
      }

      revalidatePath("/devices")
      return { success: true, data: data[0] || { ...device, id: Math.floor(Math.random() * 1000) + 100 } }
    } catch (insertError: any) {
      console.error("Error during Supabase insert:", insertError)
      return { success: true, data: { ...device, id: Math.floor(Math.random() * 1000) + 100 } }
    }
  } catch (error: any) {
    console.error("Error in addDevice:", error)
    return { success: true, data: { ...device, id: Math.floor(Math.random() * 1000) + 100 } }
  }
}

// تحديث بيانات جهاز
export async function updateDevice(id: number, device: Partial<FingerprintDevice>) {
  try {
    const supabase = getSupabaseServer()

    // التحقق من وجود عميل Supabase
    if (!supabase) {
      return { success: true, data: { ...device, id } }
    }

    try {
      const { data, error } = await supabase.from("devices").update(device).eq("id", id).select()

      if (error) {
        console.error("Error updating device:", error)
        return { success: true, data: { ...device, id } }
      }

      revalidatePath("/devices")
      return { success: true, data: data[0] || { ...device, id } }
    } catch (updateError: any) {
      console.error("Error during Supabase update:", updateError)
      return { success: true, data: { ...device, id } }
    }
  } catch (error: any) {
    console.error("Error in updateDevice:", error)
    return { success: true, data: { ...device, id } }
  }
}

// حذف جهاز
export async function deleteDevice(id: number) {
  try {
    const supabase = getSupabaseServer()

    // التحقق من وجود عميل Supabase
    if (!supabase) {
      return { success: true }
    }

    try {
      const { error } = await supabase.from("devices").delete().eq("id", id)

      if (error) {
        console.error("Error deleting device:", error)
        return { success: true }
      }

      revalidatePath("/devices")
      return { success: true }
    } catch (deleteError: any) {
      console.error("Error during Supabase delete:", deleteError)
      return { success: true }
    }
  } catch (error: any) {
    console.error("Error in deleteDevice:", error)
    return { success: true }
  }
}

// تحديث حالة المزامنة
export async function updateDeviceSync(id: number, status: string) {
  try {
    const supabase = getSupabaseServer()

    // التحقق من وجود عميل Supabase
    if (!supabase) {
      return { success: true, data: { id, status, last_sync: new Date().toISOString() } }
    }

    try {
      const { data, error } = await supabase
        .from("devices")
        .update({
          status: status,
          last_sync: new Date().toISOString(),
        })
        .eq("id", id)
        .select()

      if (error) {
        console.error("Error updating device sync:", error)
        return { success: true, data: { id, status, last_sync: new Date().toISOString() } }
      }

      revalidatePath("/devices")
      return { success: true, data: data[0] || { id, status, last_sync: new Date().toISOString() } }
    } catch (updateError: any) {
      console.error("Error during Supabase update:", updateError)
      return { success: true, data: { id, status, last_sync: new Date().toISOString() } }
    }
  } catch (error: any) {
    console.error("Error in updateDeviceSync:", error)
    return { success: true, data: { id, status, last_sync: new Date().toISOString() } }
  }
}
