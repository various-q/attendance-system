import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Database connection string
const connectionString = process.env.DATABASE_URL || "postgres://user:password@localhost:5432/attendance_db";

// Create postgres client
const client = postgres(connectionString);

// Create drizzle instance
export const db = drizzle(client, { schema });

// Export types
export type Employee = typeof schema.employees.$inferSelect;
export type NewEmployee = typeof schema.employees.$inferInsert;

export type AttendanceRecord = typeof schema.attendanceRecords.$inferSelect;
export type NewAttendanceRecord = typeof schema.attendanceRecords.$inferInsert;

export type Shift = typeof schema.shifts.$inferSelect;
export type NewShift = typeof schema.shifts.$inferInsert;

export type ShiftAssignment = typeof schema.shiftAssignments.$inferSelect;
export type NewShiftAssignment = typeof schema.shiftAssignments.$inferInsert;

export type LeaveRequest = typeof schema.leaveRequests.$inferSelect;
export type NewLeaveRequest = typeof schema.leaveRequests.$inferInsert;

export type Device = typeof schema.devices.$inferSelect;
export type NewDevice = typeof schema.devices.$inferInsert; 