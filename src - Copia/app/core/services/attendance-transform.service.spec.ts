import { TestBed } from '@angular/core/testing';
import { AttendanceTransformService } from './attendance-transform.service';
import { BaseTransformService } from './base-transform.service';
import { AttendanceStatus, ApprovalStatus } from '../../shared/models/attendance';
import { Stato, StatoApprovazione } from '../models/backend-dtos';

describe('AttendanceTransformService', () => {
  let service: AttendanceTransformService;
  let baseTransformService: BaseTransformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttendanceTransformService);
    baseTransformService = TestBed.inject(BaseTransformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('transformBackend', () => {
    it('should transform Italian backend data to frontend structure', () => {
      const backendData = {
        id: 123,
        studentId: 456,
        data: '2024-01-15',
        stato: Stato.PRESENTE,
        orarioEntrata: '2024-01-15T08:00:00Z',
        orarioUscita: '2024-01-15T17:00:00Z',
        note: 'Presente in orario',
        statoApprovazione: StatoApprovazione.APPROVATO,
        approvatoIl: '2024-01-15T18:00:00Z',
        latitudine: 45.4642,
        longitudine: 9.1900,
        creatoIl: '2024-01-15T07:00:00Z',
        aggiornatoIl: '2024-01-15T18:00:00Z'
      };

      const result = service.transformBackend(backendData);

      expect(result.id).toBe('123');
      expect(result.studentId).toBe('456');
      expect(result.status).toBe(AttendanceStatus.PRESENT);
      expect(result.notes).toBe('Presente in orario');
      expect(result.approvalStatus).toBe(ApprovalStatus.APPROVED);
      expect(result.latitude).toBe(45.4642);
      expect(result.longitude).toBe(9.1900);
    });

    it('should map Stato enum values correctly', () => {
      const presenteData = {
        id: 1,
        studentId: 100,
        data: '2024-01-15',
        stato: Stato.PRESENTE,
        statoApprovazione: StatoApprovazione.APPROVATO,
        creatoIl: '2024-01-15T07:00:00Z',
        aggiornatoIl: '2024-01-15T18:00:00Z'
      };

      const assenteData = {
        id: 2,
        studentId: 101,
        data: '2024-01-16',
        stato: Stato.ASSENTE,
        statoApprovazione: StatoApprovazione.IN_ATTESA,
        creatoIl: '2024-01-16T07:00:00Z',
        aggiornatoIl: '2024-01-16T18:00:00Z'
      };

      const presenteResult = service.transformBackend(presenteData);
      const assenteResult = service.transformBackend(assenteData);

      expect(presenteResult.status).toBe(AttendanceStatus.PRESENT);
      expect(presenteResult.approvalStatus).toBe(ApprovalStatus.APPROVED);
      
      expect(assenteResult.status).toBe(AttendanceStatus.ABSENT);
      expect(assenteResult.approvalStatus).toBe(ApprovalStatus.PENDING);
    });

    it('should transform backend data to frontend structure', () => {
      const backendData = {
        id: 789,
        studentId: 101,
        data: '2024-01-16',
        stato: Stato.ASSENTE,
        orarioEntrata: '2024-01-16T09:30:00Z',
        note: 'Late due to traffic',
        statoApprovazione: StatoApprovazione.IN_ATTESA,
        latitudine: 40.7128,
        longitudine: -74.0060,
        creatoIl: '2024-01-16T07:00:00Z',
        aggiornatoIl: '2024-01-16T09:30:00Z'
      };

      const result = service.transformBackend(backendData);

      expect(result.id).toBe('789');
      expect(result.studentId).toBe('101');
      expect(result.status).toBe(AttendanceStatus.ABSENT);
      expect(result.notes).toBe('Late due to traffic');
      expect(result.approvalStatus).toBe(ApprovalStatus.PENDING);
    });
  });

  describe('transformBackendArray', () => {
    it('should transform array of backend data', () => {
      const backendArray = [
        {
          id: '1',
          student_id: '100',
          data: '2024-01-15',
          stato: 'presente',
          stato_approvazione: 'approvato',
          creato_il: '2024-01-15T07:00:00Z',
          aggiornato_il: '2024-01-15T18:00:00Z'
        },
        {
          id: '2',
          studentId: '200',
          date: '2024-01-16',
          status: 'absent',
          approvalStatus: 'rejected',
          createdAt: '2024-01-16T07:00:00Z',
          updatedAt: '2024-01-16T18:00:00Z'
        }
      ];

      const result = service.transformBackendArray(backendArray);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[0].status).toBe(AttendanceStatus.PRESENT);
      expect(result[1].id).toBe('2');
      expect(result[1].status).toBe(AttendanceStatus.ABSENT);
    });
  });

  describe('transformAttendanceStats', () => {
    it('should transform Italian stats data', () => {
      const statsData = {
        statistiche_stato: [{ _id: 'presente', count: 20 }],
        statistiche_approvazione: [{ _id: 'approvato', count: 18 }],
        tasso_presenza: 85.5,
        periodo: 'Gennaio 2024',
        giorni_presenti: 17,
        giorni_assenti: 3
      };

      const result = service.transformAttendanceStats(statsData);

      expect(result.attendanceRate).toBe(85.5);
      expect(result.period).toBe('Gennaio 2024');
      expect(result.presentDays).toBe(17);
      expect(result.absentDays).toBe(3);
      expect(result.statusStats).toHaveLength(1);
      expect(result.approvalStats).toHaveLength(1);
    });
  });
});