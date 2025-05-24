import type React from "react"
import { Card, CardContent } from "@/components/ui/card"

interface StatsCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  color: string
  trend?: {
    value: number
    isPositive: boolean
    label: string
  }
}

export function StatsCard({ title, value, icon, color, trend }: StatsCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className={`h-1 ${color}`}></div>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="mt-2 text-3xl font-bold">{value}</h3>
            {trend && (
              <p className={`mt-1 text-xs ${trend.isPositive ? "text-green-600" : "text-red-600"} flex items-center`}>
                {trend.isPositive ? "↑" : "↓"} {trend.value}% {trend.label}
              </p>
            )}
          </div>
          <div className={`rounded-full p-3 ${color.replace("bg-", "bg-opacity-10 text-")}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}
