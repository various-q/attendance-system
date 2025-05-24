import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LinkIcon, Clock, Calculator, CalendarDays, PieChart, RefreshCw, ArrowRight } from "lucide-react"

export default function OverviewPage() {
  return (
    <div className="welcome-slide">
      <div className="welcome-border"></div>
      <div className="welcome-pattern"></div>

      <div className="p-16 flex flex-col h-screen relative z-10">
        <h1 className="welcome-title text-5xl font-bold mb-6">نظرة عامة على النظام</h1>

        <div className="system-desc mb-8">
          <p className="text-gray-700 text-xl leading-relaxed">
            نظام الحضور والانصراف المتكامل هو نظام يقوم بالاتصال مع أجهزة البصمة لتسجيل حضور وانصراف الموظفين، وتنظيم
            البيانات وتحليلها وإعداد تقارير شاملة، مع إمكانية التكامل مع أنظمة الموارد البشرية الأخرى.
          </p>
        </div>

        <h2 className="text-3xl font-bold text-gray-700 mb-4">الأهداف الرئيسية للنظام</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="objective-card">
            <div className="rounded-full p-3 bg-blue-100 ml-4">
              <LinkIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">ربط النظام بأجهزة البصمة</h3>
              <p className="text-gray-600">الاتصال الفعال مع مختلف أنواع أجهزة البصمة الموجودة</p>
            </div>
          </div>

          <div className="objective-card">
            <div className="rounded-full p-3 bg-blue-100 ml-4">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">تسجيل وقت الحضور والانصراف بدقة</h3>
              <p className="text-gray-600">متابعة دقيقة لجميع حركات الموظفين</p>
            </div>
          </div>

          <div className="objective-card">
            <div className="rounded-full p-3 bg-blue-100 ml-4">
              <Calculator className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">حساب ساعات العمل والتأخير</h3>
              <p className="text-gray-600">حساب ساعات العمل الإضافية والتأخير بشكل آلي</p>
            </div>
          </div>

          <div className="objective-card">
            <div className="rounded-full p-3 bg-blue-100 ml-4">
              <CalendarDays className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">إدارة الإجازات والاستئذانات</h3>
              <p className="text-gray-600">تنظيم طلبات وسجلات الإجازات والاستئذانات</p>
            </div>
          </div>

          <div className="objective-card">
            <div className="rounded-full p-3 bg-blue-100 ml-4">
              <PieChart className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">إنشاء تقارير مفصلة</h3>
              <p className="text-gray-600">تقارير متنوعة عن حضور وانصراف الموظفين</p>
            </div>
          </div>

          <div className="objective-card">
            <div className="rounded-full p-3 bg-blue-100 ml-4">
              <RefreshCw className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">التكامل مع أنظمة الموارد البشرية</h3>
              <p className="text-gray-600">ربط مع أنظمة الرواتب وشؤون الموظفين المختلفة</p>
            </div>
          </div>
        </div>

        <div className="mt-auto flex justify-between items-center">
          <div className="text-sm text-gray-400">
            <span className="inline-block ml-1">ℹ️</span> نظام الحضور والانصراف المتكامل
          </div>
          <div className="text-sm text-gray-400">2 / 8</div>
        </div>

        <div className="absolute top-4 left-4 flex gap-2">
          <Link href="/">
            <Button variant="outline" className="flex items-center">
              <ArrowRight className="ml-2 h-4 w-4" />
              الرجوع
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="btn-primary-gradient">الدخول إلى النظام</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
