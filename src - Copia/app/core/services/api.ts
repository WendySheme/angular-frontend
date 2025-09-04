import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environment';
import { ApiResponse } from '../../shared/models/justification';
import { PaginatedResponse } from '../../shared/models/justification';
import { TransformService } from './user-transform.service';
import { AttendanceTransformService } from './attendance-transform.service';
import { JustificationTransformService } from './justification-transform.service';
import { User } from '../../shared/models/user';
import { Attendance } from '../../shared/models/attendance';
import { Justification } from '../../shared/models/justification';
import { UtenteDTO, PresenzaDTO, GiustificativoDTO } from '../models/backend-dtos';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private userTransform: TransformService,
    private attendanceTransform: AttendanceTransformService,
    private justificationTransform: JustificationTransformService
  ) {}

  get<T>(endpoint: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    return this.http.get<ApiResponse<T>>(`${environment.apiUrl}${endpoint}`, { params: httpParams })
      .pipe(map(response => response.data));
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<ApiResponse<T>>(`${environment.apiUrl}${endpoint}`, data)
      .pipe(map(response => response.data));
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<ApiResponse<T>>(`${environment.apiUrl}${endpoint}`, data)
      .pipe(map(response => response.data));
  }

  patch<T>(endpoint: string, data: any): Observable<T> {
    return this.http.patch<ApiResponse<T>>(`${environment.apiUrl}${endpoint}`, data)
      .pipe(map(response => response.data));
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<ApiResponse<T>>(`${environment.apiUrl}${endpoint}`)
      .pipe(map(response => response.data));
  }

  getPaginated<T>(endpoint: string, params?: any): Observable<PaginatedResponse<T>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    return this.http.get<ApiResponse<PaginatedResponse<T>>>(`${environment.apiUrl}${endpoint}`, { params: httpParams })
      .pipe(map(response => response.data));
  }

  // user api con user transfrom
  getUsers(): Observable<User[]> {
    return this.get<UtenteDTO[]>('/utenti')
      .pipe(map(dtos => this.userTransform.transformBackendArray(dtos)));
  }

  getUser(id: string): Observable<User> {
    return this.get<UtenteDTO>(`/utenti/${id}`)
      .pipe(map(dto => this.userTransform.transformBackend(dto)));
  }

  createUser(user: User): Observable<User> {
    return this.post<UtenteDTO>('/utenti', user)
      .pipe(map(dto => this.userTransform.transformBackend(dto)));
  }

  updateUser(id: string, user: User): Observable<User> {
    return this.put<UtenteDTO>(`/utenti/${id}`, user)
      .pipe(map(dto => this.userTransform.transformBackend(dto)));
  }

  deleteUser(id: string): Observable<void> {
    return this.delete<void>(`/utenti/${id}`);
  }

  // presenza API con transform
  getAttendances(): Observable<Attendance[]> {
    return this.get<PresenzaDTO[]>('/presenze')
      .pipe(map(dtos => this.attendanceTransform.transformBackendArray(dtos)));
  }

  getAttendance(id: string): Observable<Attendance> {
    return this.get<PresenzaDTO>(`/presenze/${id}`)
      .pipe(map(dto => this.attendanceTransform.transformBackend(dto)));
  }

  createAttendance(attendance: Attendance): Observable<Attendance> {
    return this.post<PresenzaDTO>('/presenze', attendance)
      .pipe(map(dto => this.attendanceTransform.transformBackend(dto)));
  }

  updateAttendance(id: string, attendance: Attendance): Observable<Attendance> {
    return this.put<PresenzaDTO>(`/presenze/${id}`, attendance)
      .pipe(map(dto => this.attendanceTransform.transformBackend(dto)));
  }

  // giustificazione API con transform
  getJustifications(): Observable<Justification[]> {
    return this.get<GiustificativoDTO[]>('/giustificativi')
      .pipe(map(dtos => this.justificationTransform.transformBackendArray(dtos)));
  }

  getJustification(id: string): Observable<Justification> {
    return this.get<GiustificativoDTO>(`/giustificativi/${id}`)
      .pipe(map(dto => this.justificationTransform.transformBackend(dto)));
  }

  createJustification(justification: Justification): Observable<Justification> {
    return this.post<GiustificativoDTO>('/giustificativi', justification)
      .pipe(map(dto => this.justificationTransform.transformBackend(dto)));
  }

  updateJustification(id: string, justification: Justification): Observable<Justification> {
    return this.put<GiustificativoDTO>(`/giustificativi/${id}`, justification)
      .pipe(map(dto => this.justificationTransform.transformBackend(dto)));
  }
}
