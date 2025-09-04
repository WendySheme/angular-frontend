export interface WebSocketMessage {
  type: WebSocketMessageType;
  data: any;
  timestamp: Date;
}

export enum WebSocketMessageType {
  ATTENDANCE_CREATED = 'attendance_created',
  ATTENDANCE_APPROVED = 'attendance_approved',
  ATTENDANCE_REJECTED = 'attendance_rejected',
  JUSTIFICATION_CREATED = 'justification_created',
  JUSTIFICATION_APPROVED = 'justification_approved',
  JUSTIFICATION_REJECTED = 'justification_rejected',
  NOTIFICATION_SENT = 'notification_sent',
  USER_STATUS_CHANGED = 'user_status_changed'
}
