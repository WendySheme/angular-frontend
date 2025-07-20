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
export enum UserRole {
  STUDENT = 'student',
  TUTOR = 'tutor',
  ADMIN = 'admin'
}
