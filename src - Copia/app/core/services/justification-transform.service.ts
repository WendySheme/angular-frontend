
import { Injectable } from '@angular/core';
import { Justification, JustificationType } from 'src/app/shared/models/justification';
import { GiustificativoDTO, TipoGiustificazione, StatoApprovazione } from '../models/backend-dtos';
import { BaseTransformService } from './base-transform.service';

@Injectable({
  providedIn: 'root'
})
export class JustificationTransformService {

  constructor(private baseTransform: BaseTransformService) {}

  transformBackend(data: GiustificativoDTO | any): Justification {
    return this.baseTransform.transformData<Justification>(data, {
      fieldMappings: {
        id: (data) => data.id?.toString() ?? '',
        studentId: (data) => data.studentId?.toString() ?? data.student_id?.toString() ?? '',
        date: (data) => data.date ?? data.created_at ?? '',
        attendanceDate: (data) => data.attendanceDate ?? data.attendance_date ?? data.date,
        type: (data) => this.mapJustificationType(data.type ?? data.tipo),
        reason: (data) => data.reason ?? data.motivo ?? '',
        description: (data) => data.description ?? data.descrizione ?? '',
        status: (data) => this.mapStatus(data.status ?? data.stato),

      },
      defaultValues: {
        attachments: [],
        student: undefined
      },
      requiredFields: ['id', 'studentId'],
      validators: {
        id: (value) => !!value && value.length > 0,
        studentId: (value) => !!value && value.length > 0,
        type: (value) => ['medical', 'illness', 'family', 'other'].includes(value),
        status: (value) => ['pending', 'approved', 'rejected'].includes(value)
      }
    });
  }

  transformBackendArray(dataArray: GiustificativoDTO[] | any[]): Justification[] {
    return this.baseTransform.transformArray<Justification>(dataArray, {
      fieldMappings: {
        id: (data) => data.id?.toString() ?? '',
        studentId: (data) => data.studentId?.toString() ?? data.student_id?.toString() ?? '',
        date: (data) => data.date ?? data.created_at ?? '',
        attendanceDate: (data) => data.attendanceDate ?? data.attendance_date ?? data.date,
        type: (data) => this.mapJustificationType(data.type ?? data.tipo),
        reason: (data) => data.reason ?? data.motivo ?? '',
        description: (data) => data.description ?? data.descrizione ?? '',
        status: (data) => this.mapStatus(data.status ?? data.stato),

      },
      defaultValues: {
        attachments: [],
        student: undefined
      },
      requiredFields: ['id', 'studentId']
    });
  }

  private mapJustificationType(type: TipoGiustificazione | string | any): JustificationType {

     if (type === TipoGiustificazione.MEDICO || type === 'MEDICO') {
      return 'medical';
         }

        if (type === TipoGiustificazione.MALATTIA || type === 'MALATTIA') {
           return 'illness';
         }

    if (type === TipoGiustificazione.FAMIGLIA || type === 'FAMIGLIA') {
      return 'family';
                 }

       if (type === TipoGiustificazione.ALTRO || type === 'ALTRO') {
            return 'other';
                 }

                 const typeMap: { [key: string]: JustificationType } = {
      'medical': 'medical',
      'medico': 'medical',
      'illness': 'illness',
      'malattia': 'illness',
      'family': 'family',
      'famiglia': 'family',
      'familiare': 'family',
      'other': 'other',
      'altro': 'other'
    };

    const normalizedType = String(type).toLowerCase();
    return typeMap[normalizedType] || 'other';
  }

  private mapStatus(status: StatoApprovazione | string | any): 'pending' | 'approved' | 'rejected' {
    //enum
    if (status === StatoApprovazione.IN_ATTESA || status === 'IN_ATTESA') {
      return 'pending';
    }
    if (status === StatoApprovazione.APPROVATO || status === 'APPROVATO') {
      return 'approved';
    }
    if (status === StatoApprovazione.RIFIUTATO || status === 'RIFIUTATO') {
      return 'rejected';
    }


    const statusMap: { [key: string]: 'pending' | 'approved' | 'rejected' } = {
      'pending': 'pending',
      'in_attesa': 'pending',
      'attesa': 'pending',
      'approved': 'approved',
      'approvato': 'approved',
      'accettato': 'approved',
      'rejected': 'rejected',
      'rifiutato': 'rejected',
      'respinto': 'rejected'
    };

    const normalizedStatus = String(status).toLowerCase();
    return statusMap[normalizedStatus] || 'pending';
  }
}
