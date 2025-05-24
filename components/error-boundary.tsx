"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error, errorInfo)
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <div className="flex items-center justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-red-700 mb-4">حدث خطأ ما</h2>
            <p className="text-gray-700 mb-6">
              نعتذر عن هذا الخطأ. يرجى المحاولة مرة أخرى أو الاتصال بالدعم الفني إذا استمرت المشكلة.
            </p>
            <div className="space-y-4">
              <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700 text-white">
                إعادة تحميل الصفحة
              </Button>
              <Button variant="outline" onClick={() => (window.location.href = "/")} className="mr-4">
                العودة إلى الصفحة الرئيسية
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
