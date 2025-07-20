export interface ExportRequest {
  studentIds: string[];
  startDate: Date;
  endDate: Date;
  format: ExportFormat;
  type: ReportType;
}

export enum ExportFormat {
  CSV = 'csv',
  PDF = 'pdf',
  JSON = 'json'
}

export enum ReportType {
  MONTHLY = 'monthly',
  WEEKLY = 'weekly',
  CUSTOM = 'custom',
  STUDENT_SUMMARY = 'student_summary'
}
