import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { PlusIcon, SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getEmployees } from "@/lib/actions/employees"
import { EmployeeCard } from "@/components/employee-card"
import Link from "next/link"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default function EmployeesPage() {
  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">الموظفين</h1>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative">
            <SearchIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pr-10" placeholder="بحث عن موظف..." />
          </div>
          <Link href="/employees/add">
            <Button className="w-full sm:w-auto">
              <PlusIcon className="ml-2 h-4 w-4" />
              إضافة موظف
            </Button>
          </Link>
        </div>
      </div>

      <Suspense fallback={<EmployeesGridSkeleton />}>
        <EmployeesGrid />
      </Suspense>
    </div>
  )
}

async function EmployeesGrid() {
  const employees = await getEmployees()

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {employees.length === 0 ? (
        <div className="col-span-full text-center py-10 text-muted-foreground">
          لا يوجد موظفين. قم بإضافة موظف جديد.
        </div>
      ) : (
        employees.map((employee) => <EmployeeCard key={employee.id} employee={employee} />)
      )}
    </div>
  )
}

function EmployeesGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="h-1 bg-gray-200"></div>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200"></div>
              <div className="h-5 w-32 animate-pulse rounded bg-gray-200"></div>
            </div>
            <div className="space-y-3 mb-4">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="flex justify-between">
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <div className="h-8 w-24 animate-pulse rounded bg-gray-200"></div>
              <div className="flex gap-2">
                <div className="h-8 w-8 animate-pulse rounded bg-gray-200"></div>
                <div className="h-8 w-8 animate-pulse rounded bg-gray-200"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
