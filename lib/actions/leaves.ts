"use server"

import { db } from "@/lib/db"
import { leaveRequests } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { auth } from "@/lib/auth"

// تحسين معالجة الأخطاء في جلب طلبات الإجازات المعلقة
export async function getPendingLeaveRequests() {
  try {
    const requests = await db.query.leaveRequests.findMany({
      where: eq(leaveRequests.status, "pending"),
      orderBy: (leaveRequests, { desc }) => [desc(leaveRequests.createdAt)],
    })
    return requests
  } catch (error) {
    console.error("Error fetching pending leave requests:", error)
    return []
  }
}

export async function getApprovedLeaveRequests() {
  try {
    const requests = await db.query.leaveRequests.findMany({
      where: eq(leaveRequests.status, "approved"),
      orderBy: (leaveRequests, { desc }) => [desc(leaveRequests.createdAt)],
    })
    return requests
  } catch (error) {
    console.error("Error fetching approved leave requests:", error)
    return []
  }
}

// إضافة دوال أخرى للتعامل مع الإجازات
export async function approveLeaveRequest(id: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    const [request] = await db
      .update(leaveRequests)
      .set({
        status: "approved",
        approvedBy: session.user.id,
        approvedAt: new Date(),
      })
      .where(eq(leaveRequests.id, id))
      .returning()
    return request
  } catch (error) {
    console.error("Error approving leave request:", error)
    throw new Error("Failed to approve leave request")
  }
}

export async function rejectLeaveRequest(id: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    const [request] = await db
      .update(leaveRequests)
      .set({
        status: "rejected",
        approvedBy: session.user.id,
        approvedAt: new Date(),
      })
      .where(eq(leaveRequests.id, id))
      .returning()
    return request
  } catch (error) {
    console.error("Error rejecting leave request:", error)
    throw new Error("Failed to reject leave request")
  }
}

export async function createLeaveRequest(data: {
  type: string
  dateStart: Date
  dateEnd: Date
  reason: string
}) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }

    const [request] = await db
      .insert(leaveRequests)
      .values({
        employeeId: session.user.id,
        type: data.type,
        dateStart: data.dateStart,
        dateEnd: data.dateEnd,
        reason: data.reason,
        status: "pending",
      })
      .returning()
    return request
  } catch (error) {
    console.error("Error creating leave request:", error)
    throw new Error("Failed to create leave request")
  }
}
