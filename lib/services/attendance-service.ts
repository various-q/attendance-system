import { db } from "../db";
import { attendanceRecords, employees, shifts, shiftAssignments } from "../db/schema";
import { eq, and, between, gte, lte } from "drizzle-orm";
import { addMinutes, differenceInMinutes, isWithinInterval, parseISO } from "date-fns";

export interface AttendanceSummary {
  employeeId: string;
  date: Date;
  checkIn: Date | null;
  checkOut: Date | null;
  totalHours: number;
  overtimeHours: number;
  lateMinutes: number;
  earlyLeaveMinutes: number;
}

interface Shift {
  timeStart: string;
  timeEnd: string;
}

export class AttendanceService {
  private static instance: AttendanceService;

  private constructor() {}

  public static getInstance(): AttendanceService {
    if (!AttendanceService.instance) {
      AttendanceService.instance = new AttendanceService();
    }
    return AttendanceService.instance;
  }

  // Process attendance records for a specific date
  public async processAttendance(date: Date): Promise<void> {
    const records = await db.query.attendanceRecords.findMany({
      where: between(attendanceRecords.timestamp, date, addMinutes(date, 24 * 60)),
      with: {
        employee: true,
      },
    });

    // Group records by employee
    const employeeRecordsMap = new Map<string, typeof records>();
    records.forEach((record) => {
      const existingRecords = employeeRecordsMap.get(record.employeeId) || [];
      existingRecords.push(record);
      employeeRecordsMap.set(record.employeeId, existingRecords);
    });

    // Process each employee's records
    for (const [employeeId, employeeRecords] of employeeRecordsMap) {
      await this.processEmployeeAttendance(employeeId, employeeRecords, date);
    }
  }

  // Get attendance summary for an employee
  public async getAttendanceSummary(
    employeeId: string,
    startDate: Date,
    endDate: Date
  ): Promise<AttendanceSummary[]> {
    const summaries: AttendanceSummary[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const summary = await this.calculateDailySummary(employeeId, currentDate);
      summaries.push(summary);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return summaries;
  }

  // Private helper methods
  private async processEmployeeAttendance(
    employeeId: string,
    records: any[],
    date: Date
  ): Promise<void> {
    // Get employee's shift for the date
    const shift = await this.getEmployeeShift(employeeId, date);
    if (!shift) return;

    // Sort records by timestamp
    records.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    // Find first check-in and last check-out
    const checkIn = records.find((r) => r.type === "IN");
    const checkOut = records.findLast((r) => r.type === "OUT");

    if (checkIn && checkOut) {
      // Calculate attendance metrics
      const lateMinutes = this.calculateLateMinutes(checkIn.timestamp, shift.timeStart);
      const earlyLeaveMinutes = this.calculateEarlyLeaveMinutes(checkOut.timestamp, shift.timeEnd);
      const totalMinutes = differenceInMinutes(checkOut.timestamp, checkIn.timestamp);
      const overtimeMinutes = this.calculateOvertimeMinutes(totalMinutes, shift);

      // Store attendance summary
      await this.storeAttendanceSummary({
        employeeId,
        date,
        checkIn: checkIn.timestamp,
        checkOut: checkOut.timestamp,
        totalHours: totalMinutes / 60,
        overtimeHours: overtimeMinutes / 60,
        lateMinutes,
        earlyLeaveMinutes,
      });
    }
  }

  private async getEmployeeShift(employeeId: string, date: Date): Promise<Shift | null> {
    const assignment = await db.query.shiftAssignments.findFirst({
      where: and(
        eq(shiftAssignments.employeeId, employeeId),
        lte(shiftAssignments.dateStart, date),
        gte(shiftAssignments.dateEnd, date)
      ),
      with: {
        shift: true,
      },
    });

    return assignment?.shift || null;
  }

  private calculateLateMinutes(checkIn: Date, shiftStart: string): number {
    const shiftStartTime = parseISO(shiftStart);
    return Math.max(0, differenceInMinutes(checkIn, shiftStartTime));
  }

  private calculateEarlyLeaveMinutes(checkOut: Date, shiftEnd: string): number {
    const shiftEndTime = parseISO(shiftEnd);
    return Math.max(0, differenceInMinutes(shiftEndTime, checkOut));
  }

  private calculateOvertimeMinutes(totalMinutes: number, shift: Shift): number {
    const shiftDuration = differenceInMinutes(
      parseISO(shift.timeEnd),
      parseISO(shift.timeStart)
    );
    return Math.max(0, totalMinutes - shiftDuration);
  }

  private async storeAttendanceSummary(summary: AttendanceSummary): Promise<void> {
    // Implement storage logic for attendance summary
    console.log("Storing attendance summary:", summary);
  }

  private async calculateDailySummary(
    employeeId: string,
    date: Date
  ): Promise<AttendanceSummary> {
    const records = await db.query.attendanceRecords.findMany({
      where: and(
        eq(attendanceRecords.employeeId, employeeId),
        between(attendanceRecords.timestamp, date, addMinutes(date, 24 * 60))
      ),
    });

    const checkIn = records.find((r) => r.type === "IN")?.timestamp || null;
    const checkOut = records.findLast((r) => r.type === "OUT")?.timestamp || null;

    const shift = await this.getEmployeeShift(employeeId, date);
    const lateMinutes = checkIn && shift ? this.calculateLateMinutes(checkIn, shift.timeStart) : 0;
    const earlyLeaveMinutes = checkOut && shift
      ? this.calculateEarlyLeaveMinutes(checkOut, shift.timeEnd)
      : 0;
    const totalMinutes = checkIn && checkOut ? differenceInMinutes(checkOut, checkIn) : 0;
    const overtimeMinutes = shift
      ? this.calculateOvertimeMinutes(totalMinutes, shift)
      : 0;

    return {
      employeeId,
      date,
      checkIn,
      checkOut,
      totalHours: totalMinutes / 60,
      overtimeHours: overtimeMinutes / 60,
      lateMinutes,
      earlyLeaveMinutes,
    };
  }
} 