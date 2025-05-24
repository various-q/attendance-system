import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { SidebarProvider } from "@/components/sidebar-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AppSidebar } from "@/components/app-sidebar"
import { ErrorBoundary } from "@/components/error-boundary"
import { HelpDialog } from "@/components/help-dialog"
import { Tajawal } from "next/font/google"
import { Inter } from "next/font/google"

// استيراد خط Tajawal للغة العربية
const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-tajawal",
})

// استيراد خط Inter للغة الإنجليزية
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "نظام الحضور والانصراف",
  description: "نظام متكامل لإدارة الحضور والانصراف والإجازات للموظفين",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className={`${tajawal.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <SidebarProvider>
            <div className="flex min-h-screen">
              <AppSidebar />
              <main className="flex-1">
                <ErrorBoundary>{children}</ErrorBoundary>
              </main>
            </div>
            <Toaster />
            <HelpDialog />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
