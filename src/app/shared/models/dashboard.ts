import { Attendance, AttendanceStats } from "./attendance";
import { Justification } from "./justification";
import { User } from "./user";

export interface StudentDashboardData {
  attendances: Attendance[];
  justifications: Justification[];
  stats: AttendanceStats;
  notifications: Notification[];
}

export interface TutorDashboardData {
  pendingAttendance: Attendance[];
  pendingJustifications: Justification[];
  students: User[];
  studentsStats: StudentStats[];
}

export interface StudentStats {
  student: User;
  totalAttendances: number;
  presentCount: number;
  absentCount: number;
  attendanceRate: number;
  pendingApprovals: number;
}
