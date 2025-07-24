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
  profilePicture?: string;

}
export enum UserRole {
  STUDENT = 'student',
  TUTOR = 'tutor',
  ADMIN = 'admin'
}
