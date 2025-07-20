export interface AppConfig {
  apiUrl: string;
  websocketUrl: string;
  enableRealTimeUpdates: boolean;
  pollingInterval: number;
  maxFileSize: number;
  supportedFileTypes: string[];
  dateFormat: string;
  timeFormat: string;
  language: string;
}
