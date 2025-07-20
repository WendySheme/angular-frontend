import { Attendance } from "./attendance";
import { User } from "./user";

export interface Justification {
  id: string;
  studentId: string;
  date: string;
  type: 'medical' | 'illness' | 'family' | 'other';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  attachments?: File[];
  submittedAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewNotes?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'attendance' | 'justification' | 'system' | 'reminder';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  data?: any;
}

export interface AttendanceStats {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  justifiedDays: number;
  percentage: number;
}

export interface StudentSummary {
  student: User;
  stats: AttendanceStats;
  recentAttendance: Attendance[];
  pendingJustifications: number;
  status: 'good' | 'warning' | 'critical';
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
