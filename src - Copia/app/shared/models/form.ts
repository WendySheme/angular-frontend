import { AttendanceStatus } from "./attendance";
import { ExportFormat } from "./export";
import { JustificationType } from "./justification";
import { UserRole } from "./user";

export interface LoginForm {
  email: string;
  password: string;
  role: UserRole;
  remember?: boolean;
}

export interface AttendanceForm {
  date: Date;
  status: AttendanceStatus;
  timeIn?: Date;
  timeOut?: Date;
  notes?: string;
  location?: GeolocationPosition;
}

export interface JustificationForm {
  date: Date;
  type: JustificationType;
  reason: string;
  attachments?: File[];
}

export interface ExportForm {
  format: ExportFormat;
  period: 'current' | 'last' | 'custom';
  startDate?: Date;
  endDate?: Date;
  studentIds?: string[];
}
