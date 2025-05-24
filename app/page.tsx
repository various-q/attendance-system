"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import { loginUser, registerUser } from "@/lib/actions/auth"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBars, faBell, faUserCircle, faHome, faUsers, faClock, faCalendarAlt, faChartPie, faFingerprint, faCog, faUserCheck, faUserTimes, faUserClock, faUmbrellaBeach, faTachometerAlt, faUserShield, faMobileAlt, faCalendarCheck, faFileExport, faCogs, faInfoCircle
} from "@fortawesome/free-solid-svg-icons"
import "@/app/globals.css"

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 font-[Tajawal]">
      <div className="slide w-[1280px] min-h-[720px] bg-gradient-to-br from-white to-gray-50 shadow-2xl relative overflow-hidden">
        <div className="slide-border absolute top-0 bottom-0 right-0 w-3 bg-gradient-to-b from-[#1d78b5] to-[#34b5a6]" />
        <div className="slide-pattern absolute bottom-0 left-0 w-[500px] h-[500px]" style={{backgroundImage: "radial-gradient(circle at 20% 80%, rgba(52, 181, 166, 0.05) 0%, rgba(52, 181, 166, 0) 60%)"}} />
        <div className="slide-content p-16 flex flex-col h-full relative z-10">
          <h1 className="title text-5xl font-bold mb-8 bg-gradient-to-r from-[#1d78b5] to-[#34b5a6] bg-clip-text text-transparent">واجهة المستخدم والميزات الرئيسية</h1>
          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* لوحة التحكم */}
            <div className="col-span-2 interface-preview h-96 border border-gray-200 rounded-lg overflow-hidden shadow-md">
              <div className="header-bar bg-gradient-to-r from-[#1d78b5] to-[#34b5a6] text-white p-3 flex items-center justify-between">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faBars} className="ml-3" />
                  <span className="font-bold">لوحة التحكم</span>
          </div>
                <div className="flex items-center">
                  <span className="ml-3">09:45 صباحاً</span>
                  <FontAwesomeIcon icon={faBell} className="ml-3" />
                  <FontAwesomeIcon icon={faUserCircle} />
                </div>
              </div>
              <div className="flex h-full">
                <div className="sidebar bg-gray-50 border-l border-gray-200 p-4 w-[220px]">
                  <div className="menu-item active bg-blue-100 text-[#1d78b5] font-bold flex items-center rounded-md mb-2 p-2">
                    <FontAwesomeIcon icon={faHome} className="menu-icon ml-2 w-5" />
                    <span>الرئيسية</span>
                  </div>
                  <div className="menu-item flex items-center rounded-md mb-2 p-2">
                    <FontAwesomeIcon icon={faUsers} className="menu-icon ml-2 w-5" />
                    <span>الموظفين</span>
                  </div>
                  <div className="menu-item flex items-center rounded-md mb-2 p-2">
                    <FontAwesomeIcon icon={faClock} className="menu-icon ml-2 w-5" />
                    <span>الحضور والانصراف</span>
                  </div>
                  <div className="menu-item flex items-center rounded-md mb-2 p-2">
                    <FontAwesomeIcon icon={faCalendarAlt} className="menu-icon ml-2 w-5" />
                    <span>الإجازات</span>
                  </div>
                  <div className="menu-item flex items-center rounded-md mb-2 p-2">
                    <FontAwesomeIcon icon={faChartPie} className="menu-icon ml-2 w-5" />
                    <span>التقارير</span>
                  </div>
                  <div className="menu-item flex items-center rounded-md mb-2 p-2">
                    <FontAwesomeIcon icon={faFingerprint} className="menu-icon ml-2 w-5" />
                    <span>أجهزة البصمة</span>
                  </div>
                  <div className="menu-item flex items-center rounded-md mb-2 p-2">
                    <FontAwesomeIcon icon={faCog} className="menu-icon ml-2 w-5" />
                    <span>الإعدادات</span>
                  </div>
                </div>
                <div className="main-content flex-grow p-4 bg-white">
                  <h2 className="text-xl font-bold mb-4">ملخص اليوم</h2>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="stat-card bg-green-50 border-r-4 border-green-500 flex items-center rounded-lg p-3 mb-2">
                      <div className="p-2 bg-green-100 rounded-full ml-3">
                        <FontAwesomeIcon icon={faUserCheck} className="text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">الحاضرون</div>
                        <div className="text-xl font-bold">45</div>
                      </div>
                    </div>
                    <div className="stat-card bg-red-50 border-r-4 border-red-500 flex items-center rounded-lg p-3 mb-2">
                      <div className="p-2 bg-red-100 rounded-full ml-3">
                        <FontAwesomeIcon icon={faUserTimes} className="text-red-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">الغائبون</div>
                        <div className="text-xl font-bold">5</div>
                      </div>
                    </div>
                    <div className="stat-card bg-yellow-50 border-r-4 border-yellow-500 flex items-center rounded-lg p-3 mb-2">
                      <div className="p-2 bg-yellow-100 rounded-full ml-3">
                        <FontAwesomeIcon icon={faUserClock} className="text-yellow-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">المتأخرون</div>
                        <div className="text-xl font-bold">3</div>
                      </div>
                    </div>
                    <div className="stat-card bg-blue-50 border-r-4 border-blue-500 flex items-center rounded-lg p-3 mb-2">
                      <div className="p-2 bg-blue-100 rounded-full ml-3">
                        <FontAwesomeIcon icon={faUmbrellaBeach} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">في إجازة</div>
                        <div className="text-xl font-bold">2</div>
                      </div>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold mb-3">آخر تسجيلات الحضور</h2>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center border-b pb-2 mb-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center ml-2">ف</div>
                        <span>فاطمة أحمد</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 ml-2">08:01</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">دخول</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2 mb-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center ml-2">ع</div>
                        <span>عمر حسن</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 ml-2">08:05</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">دخول</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* الميزات الرئيسية */}
            <div className="space-y-4">
              <div className="feature-card p-6 rounded-xl bg-white shadow-md">
                <div className="feature-icon h-15 w-15 flex items-center justify-center rounded-full mb-4 bg-gradient-to-br from-[#1d78b5] to-[#34b5a6] text-white text-2xl">
                  <FontAwesomeIcon icon={faTachometerAlt} />
                </div>
                <h3 className="text-xl font-bold mb-2">لوحة تحكم متكاملة</h3>
                <ul className="text-gray-700 space-y-2">
                  <li className="flex items-start"><FontAwesomeIcon icon={faUserCheck} className="text-green-500 mt-1 ml-2" /><span>عرض إحصائيات الحضور والغياب</span></li>
                  <li className="flex items-start"><FontAwesomeIcon icon={faUserClock} className="text-green-500 mt-1 ml-2" /><span>متابعة الموظفين المتأخرين</span></li>
                  <li className="flex items-start"><FontAwesomeIcon icon={faFingerprint} className="text-green-500 mt-1 ml-2" /><span>عرض سجلات البصمة مباشرة</span></li>
                </ul>
              </div>
              <div className="feature-card p-6 rounded-xl bg-white shadow-md">
                <div className="feature-icon h-15 w-15 flex items-center justify-center rounded-full mb-4 bg-gradient-to-br from-[#1d78b5] to-[#34b5a6] text-white text-2xl">
                  <FontAwesomeIcon icon={faUserShield} />
                </div>
                <h3 className="text-xl font-bold mb-2">واجهات متعددة المستويات</h3>
                <ul className="text-gray-700 space-y-2">
                  <li className="flex items-start"><FontAwesomeIcon icon={faUserCircle} className="text-green-500 mt-1 ml-2" /><span>واجهة خاصة بالمدراء</span></li>
                  <li className="flex items-start"><FontAwesomeIcon icon={faUsers} className="text-green-500 mt-1 ml-2" /><span>بوابة للموظفين لمتابعة سجلاتهم</span></li>
                  <li className="flex items-start"><FontAwesomeIcon icon={faCog} className="text-green-500 mt-1 ml-2" /><span>صلاحيات مختلفة لكل مستوى</span></li>
                </ul>
                  </div>
              <div className="feature-card p-6 rounded-xl bg-white shadow-md">
                <div className="feature-icon h-15 w-15 flex items-center justify-center rounded-full mb-4 bg-gradient-to-br from-[#1d78b5] to-[#34b5a6] text-white text-2xl">
                  <FontAwesomeIcon icon={faMobileAlt} />
                </div>
                <h3 className="text-xl font-bold mb-2">واجهة متجاوبة</h3>
                <ul className="text-gray-700 space-y-2">
                  <li className="flex items-start"><FontAwesomeIcon icon={faMobileAlt} className="text-green-500 mt-1 ml-2" /><span>تعمل على جميع الأجهزة</span></li>
                  <li className="flex items-start"><FontAwesomeIcon icon={faBell} className="text-green-500 mt-1 ml-2" /><span>تطبيق للهواتف الذكية</span></li>
                  <li className="flex items-start"><FontAwesomeIcon icon={faBell} className="text-green-500 mt-1 ml-2" /><span>إشعارات فورية للمدراء</span></li>
                </ul>
              </div>
            </div>
          </div>
          {/* ميزات إضافية */}
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="bg-blue-50 rounded-lg p-4 flex items-center">
              <div className="p-3 bg-blue-500 text-white rounded-full ml-3">
                <FontAwesomeIcon icon={faCalendarCheck} />
              </div>
              <div>
                <h4 className="font-bold text-blue-800">طلبات الإجازة</h4>
                <p className="text-sm text-blue-600">إدارة وموافقة من واجهة واحدة</p>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 flex items-center">
              <div className="p-3 bg-green-500 text-white rounded-full ml-3">
                <FontAwesomeIcon icon={faFileExport} />
              </div>
              <div>
                <h4 className="font-bold text-green-800">تصدير التقارير</h4>
                <p className="text-sm text-green-600">PDF, Excel, CSV</p>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 flex items-center">
              <div className="p-3 bg-purple-500 text-white rounded-full ml-3">
                <FontAwesomeIcon icon={faBell} />
              </div>
              <div>
                <h4 className="font-bold text-purple-800">تنبيهات آلية</h4>
                <p className="text-sm text-purple-600">للغياب والتأخير المتكرر</p>
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 flex items-center">
              <div className="p-3 bg-yellow-500 text-white rounded-full ml-3">
                <FontAwesomeIcon icon={faCogs} />
              </div>
              <div>
                <h4 className="font-bold text-yellow-800">إعدادات مرنة</h4>
                <p className="text-sm text-yellow-600">قابلة للتخصيص حسب الحاجة</p>
              </div>
            </div>
          </div>
          <div className="mt-auto flex justify-between items-center pt-8">
            <div className="text-sm text-gray-400">
              <FontAwesomeIcon icon={faInfoCircle} /> نظام الحضور والانصراف المتكامل
            </div>
            <div className="text-sm text-gray-400">4 / 8</div>
          </div>
        </div>
      </div>
    </div>
  )
}
