import { Attendance, AttendanceStats } from "./attendance";
import { StudentStats } from "./dashboard";
import { AppError } from "./error";
import { Justification } from "./justification";
import { User } from "./user";

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: AppError | null;
  notifications: Notification[];
  theme: 'light' | 'dark';
}

export interface StudentState extends AppState {
  attendances: Attendance[];
  justifications: Justification[];
  stats: AttendanceStats | null;
  currentMonth: Date;
}

export interface TutorState extends AppState {
  students: User[];
  pendingAttendance: Attendance[];
  pendingJustifications: Justification[];
  studentsStats: StudentStats[];
}
