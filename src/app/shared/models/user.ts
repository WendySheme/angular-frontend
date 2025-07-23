export interface User {
  id: string;
  name: string;
  surname: string;
  birthDate?: Date;
  address?: string;
  phoneNumber?: string;
  email: string;
  username?: string;
  role: UserRole;
  tutor?: User;
  tutorId?: string;
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
