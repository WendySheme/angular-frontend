import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api';
import { WebSocketService } from '../../../core/services/websocket';
import { User } from '../../../shared/models/user';
import { StudentSummary } from '../../../shared/models/justification';
import { AttendanceStats } from '../../../shared/models/attendance';
import { PaginatedResponse } from '../../../shared/models/justification';


export interface ExportRequest {
  format: 'csv' | 'excel' | 'pdf';
  period: 'current' | 'last' | 'custom';
  startDate?: string;
  endDate?: string;
  studentIds?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class StudentManagementService {
  private studentsSubject = new BehaviorSubject<StudentSummary[]>([]);
  private managementStatsSubject = new BehaviorSubject<any>(null);

  public students$ = this.studentsSubject.asObservable();
  public managementStats$ = this.managementStatsSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private webSocketService: WebSocketService
  ) {
    this.setupWebSocketListeners();
  }

  loadStudents(): Observable<StudentSummary[]> {
    return this.apiService.get<StudentSummary[]>('/tutor/students').pipe(
      tap(students => this.studentsSubject.next(students))
    );
  }

  getStudentDetail(studentId: string): Observable<StudentSummary> {
    return this.apiService.get<StudentSummary>(`/tutor/students/${studentId}`);
  }

  getStudentStats(studentId: string, period?: string): Observable<AttendanceStats> {
    const params = period ? { period } : {};
    return this.apiService.get<AttendanceStats>(`/tutor/students/${studentId}/stats`, params);
  }

  exportData(request: ExportRequest): Observable<Blob> {
    return this.apiService.post<Blob>('/tutor/export', request);
  }

  sendNotificationToStudents(message: string, studentIds?: string[]): Observable<void> {
    return this.apiService.post<void>('/tutor/notifications/send', {
      message,
      studentIds
    });
  }

  loadManagementStats(): Observable<any> {
    return this.apiService.get<any>('/tutor/management/stats').pipe(
      tap(stats => this.managementStatsSubject.next(stats))
    );
  }

  updateStudentNotes(studentId: string, notes: string): Observable<void> {
    return this.apiService.patch<void>(`/tutor/students/${studentId}/notes`, { notes });
  }

  getAttendanceReport(params?: any): Observable<PaginatedResponse<any>> {
    return this.apiService.getPaginated<any>('/tutor/reports/attendance', params);
  }

  private setupWebSocketListeners(): void {
    this.webSocketService.getMessagesOfType('student_status_changed').subscribe(message => {
      const updatedStudent: StudentSummary = message.data;
      const currentStudents = this.studentsSubject.value;
      const index = currentStudents.findIndex(s => s.student.id === updatedStudent.student.id);

      if (index !== -1) {
        currentStudents[index] = updatedStudent;
        this.studentsSubject.next([...currentStudents]);
      }
    });
  }
}
