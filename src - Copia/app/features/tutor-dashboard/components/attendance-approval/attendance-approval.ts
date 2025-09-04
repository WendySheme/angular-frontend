
import { ApiResponse } from './../../../../shared/models/api-response';
import { User } from './../../../../shared/models/user';
import { Attendance } from './../../../../shared/models/attendance';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from '../../../../core/services/api';
import { WebSocketService } from '../../../../core/services/websocket';
import { WebSocketMessageType } from '../../../../shared/models/websocket';

@Injectable({
  providedIn: 'root'
})
export class TutorAttendanceService {
  private pendingAttendancesSubject = new BehaviorSubject<Attendance[]>([]);
  public pendingAttendances$ = this.pendingAttendancesSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private webSocketService: WebSocketService
  ) {
    this.setupWebSocketListeners();
  }

  private setupWebSocketListeners(): void {
    this.webSocketService.getMessagesOfType(WebSocketMessageType.ATTENDANCE_CREATED).subscribe(
      message => {
        const newAttendance = message.data;
        const currentPending = this.pendingAttendancesSubject.value;
        this.pendingAttendancesSubject.next([newAttendance, ...currentPending]);
      }
    );
  }

  getPendingApprovals(): Observable<{pendingAttendances: Attendance[], count: number}> {
    return this.apiService.get<{pendingAttendances: Attendance[], count: number}>('/attendance/pending')
      .pipe(
        tap(response => {
          this.pendingAttendancesSubject.next(response.pendingAttendances);
        })
      );
  }

  getStudentAttendances(studentId: string, startDate: Date, endDate: Date): Observable<{student: User, attendances: Attendance[]}> {
    const params = new URLSearchParams({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    });

    return this.apiService.get<{student: User, attendances: Attendance[]}>(`/attendance/student/${studentId}?${params}`);
  }

  approveAttendance(attendanceId: string): Observable<ApiResponse<Attendance>> {
    return this.apiService.put<ApiResponse<Attendance>>(`/attendance/${attendanceId}/approve`, {})
      .pipe(
        tap(response => {
          if (response.data) {
            this.removeFromPending(attendanceId);
          }
        })
      );
  }

  rejectAttendance(attendanceId: string, reason: string): Observable<ApiResponse<Attendance>> {
    return this.apiService.put<ApiResponse<Attendance>>(`/attendance/${attendanceId}/reject`, { reason })
      .pipe(
        tap(response => {
          if (response.data) {
            this.removeFromPending(attendanceId);
          }
        })
      );
  }

  bulkApproveAttendances(attendanceIds: string[]): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>('/attendance/bulk-approve', { attendanceIds })
      .pipe(
        tap(() => {
          attendanceIds.forEach(id => this.removeFromPending(id));
        })
      );
  }

  private removeFromPending(attendanceId: string): void {
    const currentPending = this.pendingAttendancesSubject.value;
    this.pendingAttendancesSubject.next(
      currentPending.filter(a => a.id !== attendanceId)
    );
  }
}
