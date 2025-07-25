import { User } from "./user";

export interface Attendance {
  id: string;
  studentId: string;
  student?: User;
  date: Date;
  timestamp?: Date;
  status: AttendanceStatus;
  timeIn?: Date;
  notes?: string;
  approvalStatus: ApprovalStatus;
  approvedById?: string;
  approvedBy?: User;
  approvedAt?: Date;
  rejectionReason?: string;
}

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
  JUSTIFIED = 'justified'
}

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface AttendanceStats {
  statusStats: StatusStat[];
  approvalStats: StatusStat[];
  attendanceRate: number;
  period: string;
  presentDays: number;
  absentDays: number;
}

export interface StatusStat {
  _id: string;
  count: number;
}
