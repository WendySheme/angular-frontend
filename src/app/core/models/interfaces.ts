import { User } from "src/app/shared/models/user";

export interface LoginCredentials {
  email: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  student?: User;
  date: Date;
  timestamp?: Date;
  status: AttendanceStatus;
  timeIn?: Date;
  timeOut?: Date;
  notes?: string;
  approvalStatus: ApprovalStatus;
  approvedById?: string;
  approvedBy?: User;
  approvedAt?: Date;
  rejectionReason?: string;
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
  presentDays: number;
  absentDays: number;
}

export interface StatusStat {
  _id: string;
  count: number;
}

export type JustificationType = 'medical' | 'illness' | 'family' | 'other';

export interface Justification {
  id: string;
  studentId: string;
  student?: User;
  date: string;
  attendanceDate?: string;
  type: JustificationType;
  reason: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
  attachments?: File[];
  submittedAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewNotes?: string;
}

export interface Notification  {
  id: string;
  userId: string;
  type: 'attendance' | 'justification' | 'system' | 'reminder';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  data?: any;
}

export enum NotificationType {
  INFO = 'info',
  WARNING = 'warning',
  REMINDER = 'reminder',
  APPROVAL = 'approval',
  REJECTION = 'rejection'
}


export interface StudentSummary {
  student: User;
  stats: AttendanceStats;
  recentAttendance: Attendance[];
  pendingJustifications: number;
  status: 'good' | 'warning' | 'critical';
}

export interface ApiResponse<T>  {
  success: boolean;
  data?: T;
  message: string;
  errorCode?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface StatusStat {
  _id: string;
  count: number;
}


