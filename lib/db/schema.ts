import { relations } from "drizzle-orm";
import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  boolean,
  json,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// Employees Table
export const employees = pgTable("employees", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  department: text("department").notNull(),
  position: text("position").notNull(),
  dateHire: timestamp("date_hire").notNull(),
  fingerprintId: text("fingerprint_id").unique(),
  statusActive: boolean("status_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Attendance Records Table
export const attendanceRecords = pgTable("attendance_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: uuid("employee_id").references(() => employees.id),
  timestamp: timestamp("timestamp").notNull(),
  type: text("type").notNull(), // "IN" or "OUT"
  deviceId: text("device_id").notNull(),
  verified: boolean("verified").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Shifts Table
export const shifts = pgTable("shifts", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  timeStart: text("time_start").notNull(), // HH:mm format
  timeEnd: text("time_end").notNull(), // HH:mm format
  breakDuration: integer("break_duration").default(0), // in minutes
  workingDays: json("working_days").$type<number[]>(), // [1,2,3,4,5] for Mon-Fri
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Shift Assignments Table
export const shiftAssignments = pgTable("shift_assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: uuid("employee_id").references(() => employees.id),
  shiftId: uuid("shift_id").references(() => shifts.id),
  dateStart: timestamp("date_start").notNull(),
  dateEnd: timestamp("date_end"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Leave Requests Table
export const leaveRequests = pgTable("leave_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: uuid("employee_id").references(() => employees.id).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  dateStart: timestamp("date_start").notNull(),
  dateEnd: timestamp("date_end").notNull(),
  reason: text("reason").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  approvedBy: uuid("approved_by").references(() => employees.id),
  approvedAt: timestamp("approved_at"),
  rejectionReason: text("rejection_reason"),
});

// Device Management Table
export const devices = pgTable("devices", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  type: text("type").notNull(), // "FINGERPRINT", "FACE", "CARD", etc.
  ipAddress: text("ip_address"),
  port: integer("port"),
  protocol: text("protocol"), // "TCP/IP", "RS485", "USB"
  status: text("status").default("ACTIVE"), // "ACTIVE", "INACTIVE", "MAINTENANCE"
  lastSync: timestamp("last_sync"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Users Table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Relations
export const employeesRelations = relations(employees, ({ many }) => ({
  attendanceRecords: many(attendanceRecords),
  shiftAssignments: many(shiftAssignments),
  leaveRequests: many(leaveRequests),
}));

export const attendanceRecordsRelations = relations(attendanceRecords, ({ one }) => ({
  employee: one(employees, {
    fields: [attendanceRecords.employeeId],
    references: [employees.id],
  }),
}));

export const shiftsRelations = relations(shifts, ({ many }) => ({
  assignments: many(shiftAssignments),
}));

export const shiftAssignmentsRelations = relations(shiftAssignments, ({ one }) => ({
  employee: one(employees, {
    fields: [shiftAssignments.employeeId],
    references: [employees.id],
  }),
  shift: one(shifts, {
    fields: [shiftAssignments.shiftId],
    references: [shifts.id],
  }),
}));

export const leaveRequestsRelations = relations(leaveRequests, ({ one }) => ({
  employee: one(employees, {
    fields: [leaveRequests.employeeId],
    references: [employees.id],
  }),
  approver: one(employees, {
    fields: [leaveRequests.approvedBy],
    references: [employees.id],
  }),
})); 