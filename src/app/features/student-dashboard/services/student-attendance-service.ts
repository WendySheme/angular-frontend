import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api';
import { WebSocketService } from '../../../core/services/websocket';
import { Attendance } from '../../../shared/models/attendance';
import { AttendanceStats } from '../../../shared/models/attendance';

@Injectable({
  providedIn: 'root'
})
export class StudentAttendanceService {
  private attendanceSubject = new BehaviorSubject<Attendance[]>([]);
  private statsSubject = new BehaviorSubject<AttendanceStats | null>(null);
  private todayAttendanceSubject = new BehaviorSubject<Attendance | null>(null);

  public attendance$ = this.attendanceSubject.asObservable();
  public stats$ = this.statsSubject.asObservable();
  public todayAttendance$ = this.todayAttendanceSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private webSocketService: WebSocketService
  ) {
    this.setupWebSocketListeners();
  }

  loadAttendance(month?: string, year?: string): Observable<Attendance[]> {
    const params = { month, year };
    return this.apiService.get<Attendance[]>('/student/attendance', params).pipe(
      tap(attendance => {
        this.attendanceSubject.next(attendance);
        this.updateTodayAttendance(attendance);
      })
    );
  }

  loadStats(month?: string, year?: string): Observable<AttendanceStats> {
    const params = { month, year };
    return this.apiService.get<AttendanceStats>('/student/attendance/stats', params).pipe(
      tap(stats => this.statsSubject.next(stats))
    );
  }

  markAttendance(status: 'present' | 'absent'): Observable<Attendance> {
    return this.apiService.post<Attendance>('/student/attendance', { status }).pipe(
      tap(attendance => {
        this.todayAttendanceSubject.next(attendance);
        const currentAttendance = this.attendanceSubject.value;
        this.attendanceSubject.next([attendance, ...currentAttendance]);
      })
    );
  }

  getTodayAttendance(): Observable<Attendance | null> {
    return this.apiService.get<Attendance | null>('/student/attendance/today');
  }

  private setupWebSocketListeners(): void {
    this.webSocketService.getMessagesOfType('attendance_updated').subscribe(message => {
      const updatedAttendance: Attendance = message.data;
      const currentAttendance = this.attendanceSubject.value;
      const index = currentAttendance.findIndex(a => a.id === updatedAttendance.id);

      if (index !== -1) {
        currentAttendance[index] = updatedAttendance;
        this.attendanceSubject.next([...currentAttendance]);
      }

      // Update today's attendance if it's today's record
      const today = new Date().toISOString().split('T')[0];
      if (updatedAttendance.date instanceof Date && updatedAttendance.date.toISOString().split('T')[0] === today) {
        this.todayAttendanceSubject.next(updatedAttendance);
      }
    });
  }

  private updateTodayAttendance(attendance: Attendance[]): void {
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = attendance.find(a => a.date instanceof Date && a.date.toISOString().split('T')[0] === today);
    this.todayAttendanceSubject.next(todayRecord || null);
  }
}
