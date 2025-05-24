import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"
import { mockData } from "@/lib/mock-data"

// متغير للتحكم في استخدام البيانات الوهمية
const USE_MOCK_DATA = process.env.NODE_ENV === "development" ? true : false;

// دالة إنشاء عميل Supabase للاستخدام في جانب الخادم
export function createServerSupabaseClient() {
  try {
    // إذا كنا نستخدم البيانات الوهمية، نرجع عميل وهمي مباشرة
    if (USE_MOCK_DATA) {
      console.log("Using mock data instead of Supabase")
      return createMockClient()
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    // التحقق من وجود متغيرات البيئة
    if (!supabaseUrl || !supabaseKey) {
      console.warn("Supabase credentials missing. Using mock client.")
      return createMockClient()
    }

    // إنشاء عميل Supabase مع خيارات إضافية
    return createClient<Database>(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
      global: {
        headers: {
          "Content-Type": "application/json",
        },
      },
    })
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    return createMockClient()
  }
}

// إنشاء عميل وهمي يستخدم البيانات الوهمية
function createMockClient() {
  return {
    from: (table: string) => ({
      select: (query?: string) => {
        let data: any[] = []

        // تحديد البيانات بناءً على اسم الجدول
        switch (table) {
          case "employees":
            data = [...mockData.employees]
            break
          case "attendance":
            data = [...mockData.attendance]
            break
          case "leave_requests":
            data = [...mockData.leaves]
            break
          case "devices":
            data = [...mockData.devices]
            break
          default:
            data = []
        }

        return {
          data,
          error: null,
          count: data.length,
          order: () => ({ data, error: null, limit: () => ({ data, error: null }) }),
          limit: (n: number) => ({ data: data.slice(0, n), error: null }),
          single: () => ({ data: data[0] || null, error: null }),
          eq: (column: string, value: any) => {
            const filteredData = data.filter((item) => item[column] === value)
            return {
              data: filteredData,
              error: null,
              select: () => ({ data: filteredData, error: null }),
              single: () => ({ data: filteredData[0] || null, error: null }),
              order: () => ({ data: filteredData, error: null }),
            }
          },
          in: (column: string, values: any[]) => {
            const filteredData = data.filter((item) => values.includes(item[column]))
            return {
              data: filteredData,
              error: null,
              order: () => ({ data: filteredData, error: null }),
            }
          },
          like: (column: string, pattern: string) => {
            const filteredData = data.filter((item) => {
              if (typeof item[column] === "string") {
                return item[column].includes(pattern.replace(/%/g, ""))
              }
              return false
            })
            return { data: filteredData, error: null }
          },
        }
      },
      insert: (items: any[]) => {
        const newItems = items.map((item, index) => ({
          ...item,
          id: Math.floor(Math.random() * 1000) + 100,
          created_at: new Date().toISOString(),
        }))
        return { data: newItems, error: null, select: () => ({ data: newItems, error: null }) }
      },
      update: (item: any) => {
        return {
          data: [{ ...item, id: 1 }],
          error: null,
          eq: () => ({
            data: [{ ...item, id: 1 }],
            error: null,
            select: () => ({ data: [{ ...item, id: 1 }], error: null }),
          }),
        }
      },
      delete: () => {
        return {
          data: null,
          error: null,
          eq: () => ({ data: null, error: null }),
        }
      },
    }),
    rpc: () => ({ data: null, error: null }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    },
  } as any
}

// للتوافق مع الكود الحالي، نصدر دالة getSupabaseServer
export function getSupabaseServer() {
  return createServerSupabaseClient()
}
