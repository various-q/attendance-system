import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { requireAdmin, getAllUsers } from "@/lib/actions/auth"
import { UsersTable } from "@/components/users-table"
import { AddHrUserDialog } from "@/components/add-hr-user-dialog"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AdminUsersPage() {
  // التحقق من صلاحية المسؤول
  await requireAdmin()

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">إدارة المستخدمين</h1>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <AddHrUserDialog>
            <Button className="w-full sm:w-auto">
              <PlusIcon className="ml-2 h-4 w-4" />
              إضافة مسؤول موارد بشرية
            </Button>
          </AddHrUserDialog>
        </div>
      </div>

      <Suspense fallback={<UsersTableSkeleton />}>
        <UsersList />
      </Suspense>
    </div>
  )
}

async function UsersList() {
  const users = await getAllUsers()

  return (
    <Card>
      <CardHeader>
        <CardTitle>قائمة المستخدمين</CardTitle>
      </CardHeader>
      <CardContent>
        <UsersTable users={users} />
      </CardContent>
    </Card>
  )
}

function UsersTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 w-48 animate-pulse rounded bg-gray-200"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-10 w-full animate-pulse rounded bg-gray-200"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 w-full animate-pulse rounded bg-gray-200"></div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
