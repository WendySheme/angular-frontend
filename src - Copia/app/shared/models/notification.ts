import { User } from "./user";

export interface Notification {
  id: string;
  recipientId: string;
  recipient?: User;
  senderId: string;
  sender?: User;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  readAt?: Date;
  data?: any;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum NotificationType {
  INFO = 'info',
  WARNING = 'warning',
  REMINDER = 'reminder',
  APPROVAL = 'approval',
  REJECTION = 'rejection'
}
