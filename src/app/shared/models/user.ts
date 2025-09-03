export interface User {
  id: number;
  nome: string;
  cognome: string;
  email: string;
  ruolo: string;
  isActive: boolean;
  name?: string;
  surname?: string;
  birthDate?: Date;
  address?: string;
  phoneNumber?: string;
  username?: string;
  role?: string;
  tutor?: User;
  tutorId?: string;
  students?: User[];
  profilePicture?: string;
}
export enum UserRole {
  STUDENT = 'student',
  TUTOR = 'tutor',
  ADMIN = 'admin'
}
