import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leaveRequests } from "@/lib/db/schema";
import { eq, and, between } from "drizzle-orm";
import { LeaveService } from "@/lib/services/leave-service";
import { endOfMonth, startOfMonth } from "date-fns";

// Get leave requests, balance, or department statistics
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get("employeeId");
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const department = searchParams.get("department");
    const month = searchParams.get("month");

    const leaveService = LeaveService.getInstance();

    // Get employee leave requests
    if (employeeId && !department) {
      const requests = await leaveService.getEmployeeLeaveRequests(
        employeeId,
        startDate ? new Date(startDate) : undefined,
        endDate ? new Date(endDate) : undefined
      );
      return NextResponse.json(requests);
    }

    // Get pending leave requests
    if (status === "PENDING") {
      const requests = await leaveService.getPendingLeaveRequests();
      return NextResponse.json(requests);
    }

    // Get leave balance
    if (employeeId && !startDate && !endDate && !status) {
      const balance = await leaveService.getLeaveBalance(employeeId);
      return NextResponse.json(balance);
    }

    // Get department leave statistics
    if (department && month) {
      const monthDate = new Date(month);
      const stats = await leaveService.getDepartmentLeaveStats(
        department,
        startOfMonth(monthDate),
        endOfMonth(monthDate)
      );
      return NextResponse.json(stats);
    }

    return NextResponse.json(
      { error: "Invalid request parameters" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error processing leave request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Create a new leave request
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { employeeId, startDate, endDate, type, reason } = body;

    if (!employeeId || !startDate || !endDate || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const leaveService = LeaveService.getInstance();
    await leaveService.createLeaveRequest(
      employeeId,
      new Date(startDate),
      new Date(endDate),
      type,
      reason
    );

    return NextResponse.json({ message: "Leave request created successfully" });
  } catch (error) {
    console.error("Error creating leave request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update leave request status
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { requestId, status, approvedBy } = body;

    if (!requestId || !status || !approvedBy) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (status !== "APPROVED" && status !== "REJECTED") {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const leaveService = LeaveService.getInstance();
    await leaveService.updateLeaveRequestStatus(requestId, status, approvedBy);

    return NextResponse.json({ message: "Leave request updated successfully" });
  } catch (error) {
    console.error("Error updating leave request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 