import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">الصفحة غير موجودة</h2>
        <p className="text-gray-700 mb-6">عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.</p>
        <Button asChild>
          <Link href="/">العودة إلى الصفحة الرئيسية</Link>
        </Button>
      </div>
    </div>
  )
}
