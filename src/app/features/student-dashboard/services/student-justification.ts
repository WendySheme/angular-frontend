import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../core/services/api';
import { Justification } from '../../../shared/models/justification';

@Injectable({
  providedIn: 'root'
})
export class StudentJustificationService {
  private justificationsSubject = new BehaviorSubject<Justification[]>([]);
  public justifications$ = this.justificationsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) {}

  loadJustifications(params: { limit?: number } = {}): Observable<{ data: Justification[] }> {
    return this.apiService.get<{ data: Justification[] }>('/student/justifications', params);
  }

  createJustification(justification: Partial<Justification>): Observable<Justification> {
    return this.apiService.post<Justification>('/student/justifications', justification);
  }

  updateJustification(id: string, justification: Partial<Justification>): Observable<Justification> {
    return this.apiService.put<Justification>(`/student/justifications/${id}`, justification);
  }

  deleteJustification(id: string): Observable<void> {
    return this.apiService.delete<void>(`/student/justifications/${id}`);
  }

  getJustificationById(id: string): Observable<Justification> {
    return this.apiService.get<Justification>(`/student/justifications/${id}`);
  }

  submitJustification(attendanceId: string, justificationData: {
    reason: string;
    description: string;
    attachments?: File[];
  }): Observable<Justification> {
    const formData = new FormData();
    formData.append('attendanceId', attendanceId);
    formData.append('reason', justificationData.reason);
    formData.append('description', justificationData.description);
    
    if (justificationData.attachments) {
      justificationData.attachments.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file);
      });
    }
    
    return this.apiService.post<Justification>('/student/justifications/submit', formData);
  }
}
