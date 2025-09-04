import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api';
import { WebSocketService } from '../../../core/services/websocket';
import { Justification } from '../../../shared/models/justification';
import { PaginatedResponse } from '../../../shared/models/justification';
import { EntityId } from '../../../shared/types/entity';

export interface JustificationApproval {
  justificationId: EntityId;
  action: 'approve' | 'reject';
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TutorJustificationService {
  private pendingJustificationsSubject = new BehaviorSubject<Justification[]>([]);
  private justificationStatsSubject = new BehaviorSubject<any>(null);

  public pendingJustifications$ = this.pendingJustificationsSubject.asObservable();
  public justificationStats$ = this.justificationStatsSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private webSocketService: WebSocketService
  ) {
    this.setupWebSocketListeners();
  }

  loadPendingJustifications(): Observable<Justification[]> {
    return this.apiService.get<Justification[]>('/tutor/justifications/pending').pipe(
      tap(justifications => this.pendingJustificationsSubject.next(justifications))
    );
  }

  approveJustification(justificationId: EntityId, notes?: string): Observable<Justification> {
    return this.apiService.patch<Justification>(`/tutor/justifications/${justificationId}/approve`, { notes }).pipe(
      tap(updatedJustification => {
        this.removePendingJustification(justificationId);
      })
    );
  }

  rejectJustification(justificationId: EntityId, notes?: string): Observable<Justification> {
    return this.apiService.patch<Justification>(`/tutor/justifications/${justificationId}/reject`, { notes }).pipe(
      tap(updatedJustification => {
        this.removePendingJustification(justificationId);
      })
    );
  }

  bulkApproveJustifications(justificationIds: EntityId[]): Observable<Justification[]> {
    return this.apiService.post<Justification[]>('/tutor/justifications/bulk-approve', { justificationIds }).pipe(
      tap(updatedJustifications => {
        justificationIds.forEach(id => this.removePendingJustification(id));
      })
    );
  }

  getStudentJustifications(studentId: EntityId, params?: any): Observable<PaginatedResponse<Justification>> {
    return this.apiService.getPaginated<Justification>(`/tutor/students/${studentId}/justifications`, params);
  }

  loadJustificationStats(): Observable<any> {
    return this.apiService.get<any>('/tutor/justifications/stats').pipe(
      tap(stats => this.justificationStatsSubject.next(stats))
    );
  }

  private setupWebSocketListeners(): void {
    this.webSocketService.getMessagesOfType('justification_submitted').subscribe(message => {
      const newJustification: Justification = message.data;
      const currentPending = this.pendingJustificationsSubject.value;
      this.pendingJustificationsSubject.next([newJustification, ...currentPending]);
    });
  }

  private removePendingJustification(justificationId: EntityId): void {
    const currentPending = this.pendingJustificationsSubject.value;
    const filtered = currentPending.filter(j => j.id !== justificationId);
    this.pendingJustificationsSubject.next(filtered);
  }
}
