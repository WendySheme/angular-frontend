import { WebSocketService } from '../../../core/services/websocket';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api';
import { Attendance } from '../../../shared/models/attendance';
import { PaginatedResponse } from '../../../shared/models/justification';

export interface AttendanceApproval {
  attendanceId: string;
  action: 'approve' | 'reject';
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TutorAttendanceService {
  private pendingAttendanceSubject = new BehaviorSubject<Attendance[]>([]);
  private attendanceStatsSubject = new BehaviorSubject<any>(null);

  public pendingAttendance$ = this.pendingAttendanceSubject.asObservable();
  public attendanceStats$ = this.attendanceStatsSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private webSocketService: WebSocketService
  ) {
    this.setupWebSocketListeners();
  }

  loadPendingAttendance(): Observable<Attendance[]> {
    return this.apiService.get<Attendance[]>('/tutor/attendance/pending').pipe(
      tap(attendance => this.pendingAttendanceSubject.next(attendance))
    );
  }

  approveAttendance(attendanceId: string, notes?: string): Observable<Attendance> {
    return this.apiService.patch<Attendance>(`/tutor/attendance/${attendanceId}/approve`, { notes }).pipe(
      tap(updatedAttendance => {
        this.removePendingAttendance(attendanceId);
      })
    );
  }

  rejectAttendance(attendanceId: string, notes?: string): Observable<Attendance> {
    return this.apiService.patch<Attendance>(`/tutor/attendance/${attendanceId}/reject`, { notes }).pipe(
      tap(updatedAttendance => {
        this.removePendingAttendance(attendanceId);
      })
    );
  }

  bulkApproveAttendance(attendanceIds: string[]): Observable<Attendance[]> {
    return this.apiService.post<Attendance[]>('/tutor/attendance/bulk-approve', { attendanceIds }).pipe(
      tap(updatedAttendances => {
        attendanceIds.forEach(id => this.removePendingAttendance(id));
      })
    );
  }

  getStudentAttendance(studentId: string, params?: any): Observable<PaginatedResponse<Attendance>> {
    return this.apiService.getPaginated<Attendance>(`/tutor/students/${studentId}/attendance`, params);
  }

  loadAttendanceStats(): Observable<any> {
    return this.apiService.get<any>('/tutor/attendance/stats').pipe(
      tap(stats => this.attendanceStatsSubject.next(stats))
    );
  }

  private setupWebSocketListeners(): void {
    this.webSocketService.getMessagesOfType('attendance_submitted').subscribe(message => {
      const newAttendance: Attendance = message.data;
      const currentPending = this.pendingAttendanceSubject.value;
      this.pendingAttendanceSubject.next([newAttendance, ...currentPending]);
    });
  }

  private removePendingAttendance(attendanceId: string): void {
    const currentPending = this.pendingAttendanceSubject.value;
    const filtered = currentPending.filter(a => a.id !== attendanceId);
    this.pendingAttendanceSubject.next(filtered);
  }
}
