import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { attendanceRecords } from "@/lib/db/schema";
import { eq, and, between } from "drizzle-orm";
import { addDays } from "date-fns";
import { AttendanceService } from "@/lib/services/attendance-service";

// Get attendance records for a specific date
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const employeeId = searchParams.get("employeeId");

    if (!date) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 }
      );
    }

    const targetDate = new Date(date);
    const nextDay = addDays(targetDate, 1);

    const whereClause = employeeId
      ? and(
          eq(attendanceRecords.employeeId, employeeId),
          between(attendanceRecords.timestamp, targetDate, nextDay)
        )
      : between(attendanceRecords.timestamp, targetDate, nextDay);

    const records = await db.query.attendanceRecords.findMany({
      where: whereClause,
      with: {
        employee: true,
      },
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Create a new attendance record
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { employeeId, timestamp, type, deviceId } = body;

    if (!employeeId || !timestamp || !type || !deviceId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const record = await db.insert(attendanceRecords).values({
      employeeId,
      timestamp: new Date(timestamp),
      type,
      deviceId,
      verified: true,
    });

    // Process attendance after creating the record
    const attendanceService = AttendanceService.getInstance();
    await attendanceService.processAttendance(new Date(timestamp));

    return NextResponse.json(record);
  } catch (error) {
    console.error("Error creating attendance record:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update an attendance record
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, timestamp, type, verified } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Record ID is required" },
        { status: 400 }
      );
    }

    const record = await db
      .update(attendanceRecords)
      .set({
        timestamp: timestamp ? new Date(timestamp) : undefined,
        type,
        verified,
      })
      .where(eq(attendanceRecords.id, id));

    return NextResponse.json(record);
  } catch (error) {
    console.error("Error updating attendance record:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete an attendance record
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Record ID is required" },
        { status: 400 }
      );
    }

    await db.delete(attendanceRecords).where(eq(attendanceRecords.id, id));

    return NextResponse.json({ message: "Record deleted successfully" });
  } catch (error) {
    console.error("Error deleting attendance record:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 