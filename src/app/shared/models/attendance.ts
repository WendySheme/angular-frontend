import { User } from "./user";

export interface Attendance {
  id: string;
  studentId: string;
  student?: User;
  date: Date;
  status: AttendanceStatus;
  timeIn?: Date;
  timeOut?: Date;
  notes?: string;
  approvalStatus: ApprovalStatus;
  approvedById?: string;
  approvedBy?: User;
  approvedAt?: Date;
  rejectionReason?: string;
  latitude?: number;
  longitude?: number;
  createdAt: Date;
  updatedAt: Date;
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
}

export interface StatusStat {
  _id: string;
  count: number;
}
