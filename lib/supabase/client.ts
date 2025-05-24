import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// تحسين التعامل مع متغيرات البيئة
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// التحقق من وجود متغيرات البيئة
if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.NODE_ENV === "development") {
    console.warn("⚠️ متغيرات البيئة الخاصة بـ Supabase غير موجودة. تأكد من إعداد ملف .env.local")
  }
}

// استخدام نمط Singleton لتجنب إنشاء عدة نسخ من العميل
let supabaseClient: ReturnType<typeof createClientInstance> | null = null

function createClientInstance() {
  return supabaseUrl && supabaseAnonKey ? createClient<Database>(supabaseUrl, supabaseAnonKey) : null
}

// دالة للحصول على عميل Supabase
export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClientInstance()
  }

  if (!supabaseClient) {
    throw new Error("عميل Supabase غير متاح. تأكد من إعداد متغيرات البيئة بشكل صحيح.")
  }

  return supabaseClient
}
