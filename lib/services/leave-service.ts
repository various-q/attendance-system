import { db } from "../db";
import { leaveRequests, employees } from "../db/schema";
import { eq, and, between, gte, lte } from "drizzle-orm";
import { addDays, differenceInDays, isWithinInterval } from "date-fns";

export interface LeaveBalance {
  employeeId: string;
  annualLeave: number;
  sickLeave: number;
  emergencyLeave: number;
  otherLeave: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  dateStart: Date;
  dateEnd: Date;
  type: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  approvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface LeaveRequestWithRelations extends LeaveRequest {
  employee?: {
    id: string;
    name: string;
  } | null;
  approver?: {
    id: string;
    name: string;
  } | null;
}

export class LeaveService {
  private static instance: LeaveService;

  private constructor() {}

  public static getInstance(): LeaveService {
    if (!LeaveService.instance) {
      LeaveService.instance = new LeaveService();
    }
    return LeaveService.instance;
  }

  // Create a new leave request
  public async createLeaveRequest(
    employeeId: string,
    startDate: Date,
    endDate: Date,
    type: string,
    reason?: string
  ): Promise<void> {
    await db.insert(leaveRequests).values({
      employeeId,
      dateStart: startDate,
      dateEnd: endDate,
      type,
      status: "PENDING",
    });
  }

  // Approve or reject a leave request
  public async updateLeaveRequestStatus(
    requestId: string,
    status: "APPROVED" | "REJECTED",
    approvedBy: string
  ): Promise<void> {
    await db
      .update(leaveRequests)
      .set({
        status,
        approvedBy,
        updatedAt: new Date(),
      })
      .where(eq(leaveRequests.id, requestId));
  }

  // Get leave requests for an employee
  public async getEmployeeLeaveRequests(
    employeeId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<LeaveRequestWithRelations[]> {
    const whereClause = startDate && endDate
      ? and(
          eq(leaveRequests.employeeId, employeeId),
          between(leaveRequests.dateStart, startDate, endDate)
        )
      : eq(leaveRequests.employeeId, employeeId);

    return await db.query.leaveRequests.findMany({
      where: whereClause,
      with: {
        employee: true,
        approver: true,
      },
    }) as LeaveRequestWithRelations[];
  }

  // Get leave balance for an employee
  public async getLeaveBalance(employeeId: string): Promise<LeaveBalance> {
    const employee = await db.query.employees.findFirst({
      where: eq(employees.id, employeeId),
    });

    if (!employee) {
      throw new Error("Employee not found");
    }

    // Get all approved leave requests for the current year
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31);

    const approvedRequests = await db.query.leaveRequests.findMany({
      where: and(
        eq(leaveRequests.employeeId, employeeId),
        eq(leaveRequests.status, "APPROVED"),
        between(leaveRequests.dateStart, startOfYear, endOfYear)
      ),
    }) as LeaveRequest[];

    // Calculate leave balances
    const balances: LeaveBalance = {
      employeeId,
      annualLeave: 30, // Default annual leave days
      sickLeave: 15, // Default sick leave days
      emergencyLeave: 5, // Default emergency leave days
      otherLeave: 10, // Default other leave days
    };

    // Deduct used leaves
    approvedRequests.forEach((request) => {
      const days = differenceInDays(request.dateEnd, request.dateStart) + 1;
      switch (request.type) {
        case "ANNUAL":
          balances.annualLeave -= days;
          break;
        case "SICK":
          balances.sickLeave -= days;
          break;
        case "EMERGENCY":
          balances.emergencyLeave -= days;
          break;
        default:
          balances.otherLeave -= days;
      }
    });

    return balances;
  }

  // Check if an employee is on leave for a specific date
  public async isEmployeeOnLeave(employeeId: string, date: Date): Promise<boolean> {
    const leaveRequest = await db.query.leaveRequests.findFirst({
      where: and(
        eq(leaveRequests.employeeId, employeeId),
        eq(leaveRequests.status, "APPROVED"),
        lte(leaveRequests.dateStart, date),
        gte(leaveRequests.dateEnd, date)
      ),
    });

    return !!leaveRequest;
  }

  // Get all pending leave requests
  public async getPendingLeaveRequests(): Promise<LeaveRequestWithRelations[]> {
    return await db.query.leaveRequests.findMany({
      where: eq(leaveRequests.status, "PENDING"),
      with: {
        employee: true,
      },
    }) as LeaveRequestWithRelations[];
  }

  // Get leave statistics for a department
  public async getDepartmentLeaveStats(
    department: string,
    startDate: Date,
    endDate: Date
  ): Promise<any> {
    const departmentEmployees = await db.query.employees.findMany({
      where: eq(employees.department, department),
    });

    const employeeIds = departmentEmployees.map((emp) => emp.id);
    const departmentLeaveRequests = await db.query.leaveRequests.findMany({
      where: and(
        eq(leaveRequests.status, "APPROVED"),
        between(leaveRequests.dateStart, startDate, endDate)
      ),
      with: {
        employee: true,
      },
    }) as LeaveRequestWithRelations[];

    const stats = {
      totalRequests: departmentLeaveRequests.length,
      byType: {} as Record<string, number>,
      byEmployee: {} as Record<string, number>,
    };

    departmentLeaveRequests.forEach((request) => {
      // Count by type
      stats.byType[request.type] = (stats.byType[request.type] || 0) + 1;
      // Count by employee
      stats.byEmployee[request.employeeId] = (stats.byEmployee[request.employeeId] || 0) + 1;
    });

    return stats;
  }
} 