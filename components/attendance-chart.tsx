"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AttendanceChartProps {
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      backgroundColor: string
    }[]
  }
  title: string
}

export function AttendanceChart({ data, title }: AttendanceChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<any>(null)

  useEffect(() => {
    if (!chartRef.current) return

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // تنظيف الرسم البياني السابق إذا وجد
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // رسم الرسم البياني
    const drawChart = () => {
      if (!ctx) return

      // رسم الأعمدة
      const barWidth = (chartRef.current!.width - 60) / data.labels.length
      const maxValue = Math.max(...data.datasets[0].data) * 1.2
      const height = chartRef.current!.height - 60

      // مسح الرسم البياني
      ctx.clearRect(0, 0, chartRef.current!.width, chartRef.current!.height)

      // رسم المحاور
      ctx.beginPath()
      ctx.strokeStyle = "#e5e7eb"
      ctx.moveTo(30, 30)
      ctx.lineTo(30, height + 30)
      ctx.lineTo(chartRef.current!.width - 30, height + 30)
      ctx.stroke()

      // رسم الأعمدة
      data.datasets.forEach((dataset, datasetIndex) => {
        dataset.data.forEach((value, index) => {
          const x = 30 + index * barWidth + barWidth * 0.1 + (barWidth * 0.8 * datasetIndex) / data.datasets.length
          const barHeight = (value / maxValue) * height
          const y = height + 30 - barHeight

          ctx.fillStyle = dataset.backgroundColor
          ctx.fillRect(x, y, (barWidth * 0.8) / data.datasets.length, barHeight)
        })
      })

      // رسم التسميات
      ctx.fillStyle = "#6b7280"
      ctx.font = "12px Tajawal"
      ctx.textAlign = "center"
      data.labels.forEach((label, index) => {
        const x = 30 + index * barWidth + barWidth / 2
        ctx.fillText(label, x, height + 50)
      })

      // رسم القيم
      ctx.textAlign = "right"
      for (let i = 0; i <= 5; i++) {
        const value = Math.round((maxValue * i) / 5)
        const y = height + 30 - (height * i) / 5
        ctx.fillText(value.toString(), 25, y + 5)
      }

      // رسم المفتاح
      const legendX = chartRef.current!.width - 150
      const legendY = 50
      data.datasets.forEach((dataset, index) => {
        ctx.fillStyle = dataset.backgroundColor
        ctx.fillRect(legendX, legendY + index * 25, 15, 15)
        ctx.fillStyle = "#6b7280"
        ctx.textAlign = "left"
        ctx.fillText(dataset.label, legendX + 25, legendY + index * 25 + 12)
      })
    }

    drawChart()

    // تحديث الرسم البياني عند تغيير حجم النافذة
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.width = chartRef.current.parentElement!.clientWidth
        chartRef.current.height = 300
        drawChart()
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [data])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <canvas ref={chartRef} height={300}></canvas>
        </div>
      </CardContent>
    </Card>
  )
}
