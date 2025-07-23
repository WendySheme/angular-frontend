import { TestBed } from '@angular/core/testing';
import { UserTranformerService } from './user-tranformer.service';
import { BaseTransformService } from './base-transform.service';
import { UserRole } from '../models/interfaces';

describe('UserTranformerService', () => {
  let service: UserTranformerService;
  let baseTransformService: BaseTransformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserTranformerService);
    baseTransformService = TestBed.inject(BaseTransformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('transformBackend', () => {
    it('should transform Italian backend Utente entity to frontend User model', () => {
      const backendUtente = {
        id: 123,
        nome: 'Mario',
        cognome: 'Rossi',
        dataNascita: '1995-05-15',
        indirizzo: 'Via Roma 123, Milano',
        cellulare: '+39 123 456 7890',
        email: 'mario.rossi@example.com',
        username: 'mario.rossi',
        ruolo: 'STUDENTE',
        tutor: {
          id: 456,
          nome: 'Giuseppe',
          cognome: 'Bianchi',
          email: 'giuseppe.bianchi@tutor.com',
          ruolo: 'TUTOR'
        }
      };

      const result = service.transformBackend(backendUtente);

      expect(result.id).toBe('123');
      expect(result.name).toBe('Mario');
      expect(result.surname).toBe('Rossi');
      expect(result.birthDate).toBeInstanceOf(Date);
      expect(result.address).toBe('Via Roma 123, Milano');
      expect(result.phoneNumber).toBe('+39 123 456 7890');
      expect(result.email).toBe('mario.rossi@example.com');
      expect(result.username).toBe('mario.rossi');
      expect(result.role).toBe(UserRole.STUDENT);
      expect(result.tutor).toBeTruthy();
      expect(result.tutor?.name).toBe('Giuseppe');
      expect(result.tutor?.surname).toBe('Bianchi');
      expect(result.isActive).toBe(true);
      expect(result.students).toEqual([]);
    });

    it('should transform tutor entity with students', () => {
      const backendTutor = {
        id: 789,
        nome: 'Anna',
        cognome: 'Verdi',
        email: 'anna.verdi@tutor.com',
        ruolo: 'TUTOR',
        students: [
          {
            id: 101,
            nome: 'Luca',
            cognome: 'Neri',
            email: 'luca.neri@student.com',
            ruolo: 'STUDENTE'
          },
          {
            id: 102,
            nome: 'Sara',
            cognome: 'Blu',
            email: 'sara.blu@student.com',
            ruolo: 'STUDENTE'
          }
        ]
      };

      const result = service.transformBackend(backendTutor);

      expect(result.role).toBe(UserRole.TUTOR);
      expect(result.students).toHaveLength(2);
      expect(result.students?.[0].name).toBe('Luca');
      expect(result.students?.[1].name).toBe('Sara');
    });

    it('should handle missing optional fields gracefully', () => {
      const minimalBackendData = {
        id: 999,
        nome: 'Test',
        cognome: 'User',
        email: 'test@example.com',
        ruolo: 'STUDENTE'
      };

      const result = service.transformBackend(minimalBackendData);

      expect(result.id).toBe('999');
      expect(result.name).toBe('Test');
      expect(result.surname).toBe('User');
      expect(result.email).toBe('test@example.com');
      expect(result.birthDate).toBeUndefined();
      expect(result.address).toBe('');
      expect(result.phoneNumber).toBe('');
      expect(result.username).toBe('');
      expect(result.tutor).toBeUndefined();
    });

    it('should map Italian role names correctly', () => {
      const roles = [
        { backend: 'STUDENTE', frontend: UserRole.STUDENT },
        { backend: 'TUTOR', frontend: UserRole.TUTOR },
        { backend: 'ADMIN', frontend: UserRole.ADMIN },
        { backend: 'AMMINISTRATORE', frontend: UserRole.ADMIN }
      ];

      roles.forEach(({ backend, frontend }) => {
        const data = {
          id: 1,
          nome: 'Test',
          cognome: 'User',
          email: 'test@example.com',
          ruolo: backend
        };

        const result = service.transformBackend(data);
        expect(result.role).toBe(frontend);
      });
    });
  });

  describe('transformBackendArray', () => {
    it('should transform array of backend entities', () => {
      const backendArray = [
        {
          id: 1,
          nome: 'Mario',
          cognome: 'Rossi',
          email: 'mario@example.com',
          ruolo: 'STUDENTE'
        },
        {
          id: 2,
          nome: 'Anna',
          cognome: 'Bianchi',
          email: 'anna@example.com',
          ruolo: 'TUTOR'
        }
      ];

      const result = service.transformBackendArray(backendArray);

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Mario');
      expect(result[0].role).toBe(UserRole.STUDENT);
      expect(result[1].name).toBe('Anna');
      expect(result[1].role).toBe(UserRole.TUTOR);
    });
  });
});
