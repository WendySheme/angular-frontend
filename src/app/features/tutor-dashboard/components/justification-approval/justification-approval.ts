import { WebSocketMessageType } from './../../../../shared/models/websocket';
import { ApiResponse } from './../../../../shared/models/api-response';
import { Justification } from './../../../../shared/models/justification';
import { WebSocketService } from '../../../../core/services/websocket';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from '../../../../core/services/api';


@Injectable({
  providedIn: 'root'
})
export class TutorJustificationService {
  private pendingJustificationsSubject = new BehaviorSubject<Justification[]>([]);
  public pendingJustifications$ = this.pendingJustificationsSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private webSocketService: WebSocketService
  ) {
    this.setupWebSocketListeners();
  }

  private setupWebSocketListeners(): void {
    this.webSocketService.getMessagesOfType(WebSocketMessageType.JUSTIFICATION_CREATED).subscribe(
      message => {
        const newJustification = message.data;
        const currentPending = this.pendingJustificationsSubject.value;
        this.pendingJustificationsSubject.next([newJustification, ...currentPending]);
      }
    );
  }

  getPendingJustifications(): Observable<{pendingJustifications: Justification[], count: number}> {
    return this.apiService.get<{pendingJustifications: Justification[], count: number}>('/justifications/pending')
      .pipe(
        tap(response => {
          this.pendingJustificationsSubject.next(response.pendingJustifications);
        })
      );
  }

  approveJustification(justificationId: string, reviewNotes?: string): Observable<ApiResponse<Justification>> {
    const data = reviewNotes ? { reviewNotes } : {};

    return this.apiService.put<ApiResponse<Justification>>(`/justifications/${justificationId}/approve`, data)
      .pipe(
        tap(response => {
          if (response.data) {
            this.removeFromPending(justificationId);
          }
        })
      );
  }

  rejectJustification(justificationId: string, reviewNotes: string): Observable<ApiResponse<Justification>> {
    return this.apiService.put<ApiResponse<Justification>>(`/justifications/${justificationId}/reject`, { reviewNotes })
      .pipe(
        tap(response => {
          if (response.data) {
            this.removeFromPending(justificationId);
          }
        })
      );
  }

  bulkApproveJustifications(justificationIds: string[]): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>('/justifications/bulk-approve', { justificationIds })
      .pipe(
        tap(() => {
          justificationIds.forEach(id => this.removeFromPending(id));
        })
      );
  }

  private removeFromPending(justificationId: string): void {
    const currentPending = this.pendingJustificationsSubject.value;
    this.pendingJustificationsSubject.next(
      currentPending.filter(j => j.id !== justificationId)
    );
  }
}

// src/app/
