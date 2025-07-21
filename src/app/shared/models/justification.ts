import { Attendance } from "./attendance";
import { User } from "./user";

export type JustificationType = 'medical' | 'illness' | 'family' | 'other';

export interface Justification {
  id: string;
  studentId: string;
  student?: User; // Add student object for template access
  date: string;
  attendanceDate?: string; // Add attendanceDate for template access
  type: JustificationType;
  reason: string;
  description?: string; // Add description for template access
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
