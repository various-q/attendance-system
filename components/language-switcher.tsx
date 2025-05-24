"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()

  const toggleLanguage = () => {
    const currentLang = document.documentElement.lang
    const newLang = currentLang === "ar" ? "en" : "ar"
    const newDir = newLang === "ar" ? "rtl" : "ltr"

    // تحديث لغة واتجاه الصفحة
    document.documentElement.lang = newLang
    document.documentElement.dir = newDir

    // تحديث الصفحة
    router.refresh()
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2"
    >
      {document.documentElement.lang === "ar" ? "English" : "العربية"}
    </Button>
  )
} 