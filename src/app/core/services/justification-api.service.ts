import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Justification } from '../../shared/models/justification';
import { GiustificativoDTO } from '../models/backend-dtos';
import { JustificationTransformService } from './justification-transform.service';

@Injectable({
  providedIn: 'root'
})
export class JustificationApiService {

  constructor(
    private http: HttpClient, 
    private justificationTransform: JustificationTransformService
  ) { }

  getJustifications(): Observable<Justification[]> {
    return this.http.get<GiustificativoDTO[]>('/api/giustificativi')
      .pipe(map(dtos => this.justificationTransform.transformBackendArray(dtos)));
  }

  getJustification(id: string): Observable<Justification> {
    return this.http.get<GiustificativoDTO>(`/api/giustificativi/${id}`)
      .pipe(map(dto => this.justificationTransform.transformBackend(dto)));
  }
}