"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
        <h2 className="text-2xl font-bold text-red-700 mb-4">حدث خطأ ما</h2>
        <p className="text-gray-700 mb-6">
          نعتذر عن هذا الخطأ. يرجى المحاولة مرة أخرى أو الاتصال بالدعم الفني إذا استمرت المشكلة.
        </p>
        <div className="space-y-4">
          <Button onClick={reset} className="bg-red-600 hover:bg-red-700 text-white">
            إعادة المحاولة
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")} className="mr-4">
            العودة إلى الصفحة الرئيسية
          </Button>
        </div>
        {error && (
          <div className="mt-4 p-4 bg-gray-100 rounded text-left text-sm overflow-auto max-h-40">
            <pre>{error.message}</pre>
            {error.stack && <pre className="text-xs text-gray-500 mt-2">{error.stack}</pre>}
          </div>
        )}
      </div>
    </div>
  )
}
