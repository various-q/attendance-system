"use client"

import { useState, useEffect } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useRouter, useSearchParams } from "next/navigation"

export function DatePicker() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dateParam = searchParams.get("date")

  const [date, setDate] = useState<Date | undefined>(dateParam ? new Date(dateParam) : new Date())

  useEffect(() => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd")
      router.push(`/attendance?date=${formattedDate}`)
    }
  }, [date, router])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-right sm:w-[240px]">
          <CalendarIcon className="ml-2 h-4 w-4" />
          {date ? format(date, "dd MMMM yyyy", { locale: ar }) : "اختر تاريخ"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
      </PopoverContent>
    </Popover>
  )
}
