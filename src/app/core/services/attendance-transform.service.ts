import { Injectable } from '@angular/core';
import { Attendance, AttendanceStatus, ApprovalStatus, AttendanceStats } from '../../shared/models/attendance';
import { AttendanceDTO, Stato, StatoApprovazione } from '../models/backend-dtos';
import { BaseTransformService } from './base-transform.service';

@Injectable({
  providedIn: 'root'
})
export class AttendanceTransformService {

  constructor(private baseTransform: BaseTransformService) {}

  transformBackend(data: AttendanceDTO | any): Attendance {
    return this.baseTransform.transformData<Attendance>(data, {
      fieldMappings: {
        id: (data) => data.id?.toString() ?? '',
        studentId: (data) => data.studentId?.toString() ?? data.student_id?.toString() ?? '',
        date: (data) => this.baseTransform.sanitizeDate(data.date ?? data.data),
        timestamp: (data) => data.timestamp ? this.baseTransform.sanitizeDate(data.timestamp) : undefined,
        status: (data) => this.mapAttendanceStatus(data.status ?? data.stato),
        timeIn: (data) => data.timeIn ? this.baseTransform.sanitizeDate(data.timeIn ?? data.orario_entrata) : undefined,
        timeOut: (data) => data.timeOut ? this.baseTransform.sanitizeDate(data.timeOut ?? data.orario_uscita) : undefined,
        notes: (data) => this.baseTransform.sanitizeString(data.notes ?? data.note),
        approvalStatus: (data) => this.mapApprovalStatus(data.approvalStatus ?? data.stato_approvazione),
        approvedById: (data) => data.approvedById?.toString() ?? data.approved_by_id?.toString(),
        approvedAt: (data) => data.approvedAt ? this.baseTransform.sanitizeDate(data.approvedAt ?? data.approvato_il) : undefined,
        rejectionReason: (data) => this.baseTransform.sanitizeString(data.rejectionReason ?? data.motivo_rifiuto),
        latitude: (data) => this.baseTransform.sanitizeNumber(data.latitude ?? data.latitudine),
        longitude: (data) => this.baseTransform.sanitizeNumber(data.longitude ?? data.longitudine),
        createdAt: (data) => this.baseTransform.sanitizeDate(data.createdAt ?? data.created_at ?? data.creato_il),
        updatedAt: (data) => this.baseTransform.sanitizeDate(data.updatedAt ?? data.updated_at ?? data.aggiornato_il)
      },
      defaultValues: {
        notes: '',

      },
      requiredFields: ['id', 'studentId', 'date', 'status', 'approvalStatus'],
      validators: {
        id: (value) => !!value && value.length > 0,
        studentId: (value) => !!value && value.length > 0,
        status: (value) => Object.values(AttendanceStatus).includes(value),
        approvalStatus: (value) => Object.values(ApprovalStatus).includes(value)
      }
    });
  }

  transformBackendArray(dataArray: AttendanceDTO[] | any[]): Attendance[] {
    return this.baseTransform.transformArray<Attendance>(dataArray, {
      fieldMappings: {
        id: (data) => data.id?.toString() ?? '',
        studentId: (data) => data.studentId?.toString() ?? data.student_id?.toString() ?? '',
        date: (data) => this.baseTransform.sanitizeDate(data.date ?? data.data),
        timestamp: (data) => data.timestamp ? this.baseTransform.sanitizeDate(data.timestamp) : undefined,
        status: (data) => this.mapAttendanceStatus(data.status ?? data.stato),
        timeIn: (data) => data.timeIn ? this.baseTransform.sanitizeDate(data.timeIn ?? data.orario_entrata) : undefined,
        timeOut: (data) => data.timeOut ? this.baseTransform.sanitizeDate(data.timeOut ?? data.orario_uscita) : undefined,
        notes: (data) => this.baseTransform.sanitizeString(data.notes ?? data.note),
        approvalStatus: (data) => this.mapApprovalStatus(data.approvalStatus ?? data.stato_approvazione),
        approvedById: (data) => data.approvedById?.toString() ?? data.approved_by_id?.toString(),
        approvedAt: (data) => data.approvedAt ? this.baseTransform.sanitizeDate(data.approvedAt ?? data.approvato_il) : undefined,
        rejectionReason: (data) => this.baseTransform.sanitizeString(data.rejectionReason ?? data.motivo_rifiuto),
        latitude: (data) => this.baseTransform.sanitizeNumber(data.latitude ?? data.latitudine),
        longitude: (data) => this.baseTransform.sanitizeNumber(data.longitude ?? data.longitudine),
        createdAt: (data) => this.baseTransform.sanitizeDate(data.createdAt ?? data.created_at ?? data.creato_il),
        updatedAt: (data) => this.baseTransform.sanitizeDate(data.updatedAt ?? data.updated_at ?? data.aggiornato_il)
      },
      defaultValues: {
        notes: '',

      },
      requiredFields: ['id', 'studentId', 'date', 'status', 'approvalStatus']
    });
  }

  transformAttendanceStats(data: any): AttendanceStats {
    return this.baseTransform.transformData<AttendanceStats>(data, {
      fieldMappings: {
        statusStats: (data) => this.baseTransform.sanitizeArray(data.statusStats ?? data.statistiche_stato),
        approvalStats: (data) => this.baseTransform.sanitizeArray(data.approvalStats ?? data.statistiche_approvazione),
        attendanceRate: (data) => this.baseTransform.sanitizeNumber(data.attendanceRate ?? data.tasso_presenza, 0),
        period: (data) => this.baseTransform.sanitizeString(data.period ?? data.periodo),
        presentDays: (data) => this.baseTransform.sanitizeNumber(data.presentDays ?? data.giorni_presenti, 0),
        absentDays: (data) => this.baseTransform.sanitizeNumber(data.absentDays ?? data.giorni_assenti, 0)
      },
      defaultValues: {
        statusStats: [],
        approvalStats: [],
        attendanceRate: 0,
        period: '',
        presentDays: 0,
        absentDays: 0
      },
      requiredFields: ['period'],
      validators: {
        attendanceRate: (value) => typeof value === 'number' && value >= 0 && value <= 100,
        presentDays: (value) => typeof value === 'number' && value >= 0,
        absentDays: (value) => typeof value === 'number' && value >= 0
      }
    });
  }

  private mapAttendanceStatus(status: Stato | string | any): AttendanceStatus {
    // Handle backend Stato enum values
    if (status === Stato.PRESENTE || status === 'PRESENTE') {
      return AttendanceStatus.PRESENT;
    }
    if (status === Stato.ASSENTE || status === 'ASSENTE') {
      return AttendanceStatus.ABSENT;
    }

    // Handle other possible values for backwards compatibility
    const statusMap: { [key: string]: AttendanceStatus } = {
      'present': AttendanceStatus.PRESENT,
      'presente': AttendanceStatus.PRESENT,
      'absent': AttendanceStatus.ABSENT,
      'assente': AttendanceStatus.ABSENT,
      'late': AttendanceStatus.LATE,
      'ritardo': AttendanceStatus.LATE,
      'in_ritardo': AttendanceStatus.LATE,
      'justified': AttendanceStatus.JUSTIFIED,
      'giustificato': AttendanceStatus.JUSTIFIED
    };

    const normalizedStatus = String(status).toLowerCase();
    return statusMap[normalizedStatus] || AttendanceStatus.ABSENT;
  }

  private mapApprovalStatus(status: StatoApprovazione | string | any): ApprovalStatus {
    // Handle backend StatoApprovazione enum values
    if (status === StatoApprovazione.IN_ATTESA || status === 'IN_ATTESA') {
      return ApprovalStatus.PENDING;
    }
    if (status === StatoApprovazione.APPROVATO || status === 'APPROVATO') {
      return ApprovalStatus.APPROVED;
    }
    if (status === StatoApprovazione.RIFIUTATO || status === 'RIFIUTATO') {
      return ApprovalStatus.REJECTED;
    }

    // Handle other possible values for backwards compatibility
    const statusMap: { [key: string]: ApprovalStatus } = {
      'pending': ApprovalStatus.PENDING,
      'in_attesa': ApprovalStatus.PENDING,
      'attesa': ApprovalStatus.PENDING,
      'approved': ApprovalStatus.APPROVED,
      'approvato': ApprovalStatus.APPROVED,
      'accettato': ApprovalStatus.APPROVED,
      'rejected': ApprovalStatus.REJECTED,
      'rifiutato': ApprovalStatus.REJECTED,
      'respinto': ApprovalStatus.REJECTED
    };

    const normalizedStatus = String(status).toLowerCase();
    return statusMap[normalizedStatus] || ApprovalStatus.PENDING;
  }
}
