export enum UserRole {
  STUDENT = 'student',
  TUTOR = 'tutor',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  email: string;
  name: string;
  surname: string;
  role: UserRole;
  studentId?: string;
  tutorId?: string;
  assignedTutorId?: string;
  assignedTutor?: User;
  students?: User[];
  isActive: boolean;
  lastLogin?: Date;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  course?: string;
  year?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: Date;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AttendanceStats {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  excusedDays: number;
  attendanceRate: number;
}