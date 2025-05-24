export const dynamic = "force-dynamic"
export const revalidate = 0

// محاكاة جلب بيانات الاستئذانات
async function getPermissions(status?: string) {
  // هذه بيانات وهمية، يجب استبدالها بجلب البيانات الفعلية من قاعدة البيانات
  const permissions = [
    {
      id: 1,
      employee: {
        id: 1,
        name: "أحمد محمد",
        department: "تقنية المعلومات",
      },
      date: "2023-05-15",
      start_time: "10:00",
      end_time: "12:00",
      reason: "مراجعة طبية",
      status: "pending",
      created_at: "2023-05-14T10:00:00",
    },
    {
      id: 2,
      employee: {
        id: 2,
        name: "سارة علي",
        department: "الموارد البشرية",
      },
      date: "2023-05-16",
      start_time: "13:00",
      end_time: "15:00",
      reason: "مراجعة حكومية",
      status: "approved",
      approved_by: 3,
      approved_at: "2023-05-15T14:00:00",
      created_at: "2023-05-15T10:00:00",
    },
    {
      id: 3,
      employee: {
        id: 3,
        name: "محمد خالد",
        department: "المالية",
      },
      date: "2023-05-17",
      start_time: "09:00",
      end_time: "11:00",
      reason: "ظروف شخصية",
      status: "rejected",
      approved_by: 3,
      approved_at: "2023-05-16T14:00:00",
      rejection_reason: "ضغط العمل",
      created_at: "2023-05-16T10:00:00",
    },
  ]

  if (status) {
    return permissions.filter((permission) => permission.status === status)
  }

  return permissions
}

export default function PermissionsPage() {
  return <div>{/* Permissions page content here */}</div>
}
