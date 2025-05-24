import { db } from "../db";
import { attendanceRecords, employees, shifts, shiftAssignments } from "../db/schema";
import { eq, and, between, gte, lte } from "drizzle-orm";
import { addDays, differenceInDays, format, startOfMonth, endOfMonth } from "date-fns";

export interface AttendanceReport {
  employeeId: string;
  employeeName: string;
  department: string;
  date: Date;
  checkIn: Date | null;
  checkOut: Date | null;
  totalHours: number;
  overtimeHours: number;
  lateMinutes: number;
  earlyLeaveMinutes: number;
  status: "PRESENT" | "ABSENT" | "LATE" | "EARLY_LEAVE" | "ON_LEAVE";
}

export interface DepartmentReport {
  department: string;
  totalEmployees: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  earlyLeaveCount: number;
  onLeaveCount: number;
  averageLateMinutes: number;
  averageEarlyLeaveMinutes: number;
  totalOvertimeHours: number;
}

export class ReportService {
  private static instance: ReportService;

  private constructor() {}

  public static getInstance(): ReportService {
    if (!ReportService.instance) {
      ReportService.instance = new ReportService();
    }
    return ReportService.instance;
  }

  // Generate daily attendance report
  public async generateDailyReport(date: Date): Promise<AttendanceReport[]> {
    const allEmployees = await db.query.employees.findMany();
    const reports: AttendanceReport[] = [];

    for (const employee of allEmployees) {
      const records = await db.query.attendanceRecords.findMany({
        where: and(
          eq(attendanceRecords.employeeId, employee.id),
          between(attendanceRecords.timestamp, date, addDays(date, 1))
        ),
      });

      const checkIn = records.find((r) => r.type === "IN")?.timestamp || null;
      const checkOut = records.findLast((r) => r.type === "OUT")?.timestamp || null;

      const shift = await this.getEmployeeShift(employee.id, date);
      const lateMinutes = checkIn && shift ? this.calculateLateMinutes(checkIn, shift.timeStart) : 0;
      const earlyLeaveMinutes = checkOut && shift
        ? this.calculateEarlyLeaveMinutes(checkOut, shift.timeEnd)
        : 0;
      const totalMinutes = checkIn && checkOut ? this.calculateTotalMinutes(checkIn, checkOut) : 0;
      const overtimeMinutes = shift
        ? this.calculateOvertimeMinutes(totalMinutes, shift)
        : 0;

      const status = this.determineAttendanceStatus(
        checkIn,
        checkOut,
        lateMinutes,
        earlyLeaveMinutes
      );

      reports.push({
        employeeId: employee.id,
        employeeName: employee.name,
        department: employee.department,
        date,
        checkIn,
        checkOut,
        totalHours: totalMinutes / 60,
        overtimeHours: overtimeMinutes / 60,
        lateMinutes,
        earlyLeaveMinutes,
        status,
      });
    }

    return reports;
  }

  // Generate monthly department report
  public async generateMonthlyDepartmentReport(
    department: string,
    month: Date
  ): Promise<DepartmentReport> {
    const startDate = startOfMonth(month);
    const endDate = endOfMonth(month);

    const departmentEmployees = await db.query.employees.findMany({
      where: eq(employees.department, department),
    });

    const dailyReports = await Promise.all(
      Array.from({ length: differenceInDays(endDate, startDate) + 1 }, (_, i) =>
        this.generateDailyReport(addDays(startDate, i))
      )
    );

    const departmentReports = dailyReports.flatMap((reports) =>
      reports.filter((report) => report.department === department)
    );

    const stats = {
      department,
      totalEmployees: departmentEmployees.length,
      presentCount: 0,
      absentCount: 0,
      lateCount: 0,
      earlyLeaveCount: 0,
      onLeaveCount: 0,
      totalLateMinutes: 0,
      totalEarlyLeaveMinutes: 0,
      totalOvertimeHours: 0,
    };

    departmentReports.forEach((report) => {
      switch (report.status) {
        case "PRESENT":
          stats.presentCount++;
          break;
        case "ABSENT":
          stats.absentCount++;
          break;
        case "LATE":
          stats.lateCount++;
          stats.totalLateMinutes += report.lateMinutes;
          break;
        case "EARLY_LEAVE":
          stats.earlyLeaveCount++;
          stats.totalEarlyLeaveMinutes += report.earlyLeaveMinutes;
          break;
        case "ON_LEAVE":
          stats.onLeaveCount++;
          break;
      }
      stats.totalOvertimeHours += report.overtimeHours;
    });

    return {
      department,
      totalEmployees: stats.totalEmployees,
      presentCount: stats.presentCount,
      absentCount: stats.absentCount,
      lateCount: stats.lateCount,
      earlyLeaveCount: stats.earlyLeaveCount,
      onLeaveCount: stats.onLeaveCount,
      averageLateMinutes: stats.lateCount > 0 ? stats.totalLateMinutes / stats.lateCount : 0,
      averageEarlyLeaveMinutes:
        stats.earlyLeaveCount > 0 ? stats.totalEarlyLeaveMinutes / stats.earlyLeaveCount : 0,
      totalOvertimeHours: stats.totalOvertimeHours,
    };
  }

  // Private helper methods
  private async getEmployeeShift(employeeId: string, date: Date): Promise<any> {
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

    return assignment?.shift;
  }

  private calculateLateMinutes(checkIn: Date, shiftStart: string): number {
    const shiftStartTime = new Date(shiftStart);
    return Math.max(0, (checkIn.getTime() - shiftStartTime.getTime()) / (1000 * 60));
  }

  private calculateEarlyLeaveMinutes(checkOut: Date, shiftEnd: string): number {
    const shiftEndTime = new Date(shiftEnd);
    return Math.max(0, (shiftEndTime.getTime() - checkOut.getTime()) / (1000 * 60));
  }

  private calculateTotalMinutes(checkIn: Date, checkOut: Date): number {
    return (checkOut.getTime() - checkIn.getTime()) / (1000 * 60);
  }

  private calculateOvertimeMinutes(totalMinutes: number, shift: any): number {
    const shiftDuration = this.calculateTotalMinutes(
      new Date(shift.timeStart),
      new Date(shift.timeEnd)
    );
    return Math.max(0, totalMinutes - shiftDuration);
  }

  private determineAttendanceStatus(
    checkIn: Date | null,
    checkOut: Date | null,
    lateMinutes: number,
    earlyLeaveMinutes: number
  ): "PRESENT" | "ABSENT" | "LATE" | "EARLY_LEAVE" | "ON_LEAVE" {
    if (!checkIn && !checkOut) return "ABSENT";
    if (lateMinutes > 0) return "LATE";
    if (earlyLeaveMinutes > 0) return "EARLY_LEAVE";
    return "PRESENT";
  }
} 