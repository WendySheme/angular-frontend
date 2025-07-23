import { Injectable } from '@angular/core';
import { User, UserRole } from '../models/interfaces';
import { UtenteDTO, RuoloEnum } from '../models/backend-dtos';
import { BaseTransformService } from './base-transform.service';


@Injectable({
  providedIn: 'root'
})
export class UserTranformerService {

  constructor(private baseTransform: BaseTransformService) {}

  transformBackend(data: UtenteDTO | any): User {
    return this.baseTransform.transformData<User>(data, {
      fieldMappings: {
        id: (data) => data.id?.toString() ?? '',
        name: (data) => this.baseTransform.sanitizeString(data.nome ?? data.name),
        surname: (data) => this.baseTransform.sanitizeString(data.cognome ?? data.surname),
        birthDate: (data) => data.dataNascita ? this.baseTransform.sanitizeDate(data.dataNascita) : undefined,
        address: (data) => this.baseTransform.sanitizeString(data.indirizzo ?? data.address),
        phoneNumber: (data) => this.baseTransform.sanitizeString(data.cellulare ?? data.phoneNumber),
        email: (data) => this.baseTransform.sanitizeString(data.email),
        username: (data) => this.baseTransform.sanitizeString(data.username),
        role: (data) => this.mapRole(data.ruolo ?? data.role),
        tutor: (data) => data.tutor ? this.transformBackend(data.tutor) : undefined,
        tutorId: (data) => data.tutor?.id?.toString() ?? data.id_tutor?.toString(),
        students: (data) => data.students ? data.students.map((student: any) => this.transformBackend(student)) : [],
        lastLogin: (data) => data.lastLogin ? this.baseTransform.sanitizeDate(data.lastLogin) : undefined,
        profilePicture: (data) => this.baseTransform.sanitizeString(data.profilePicture ?? data.profile_picture)
      },
      defaultValues: {
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        students: [],
        profilePicture: ''
      },
      requiredFields: ['id', 'email'],
      validators: {
        id: (value) => !!value && value.length > 0,
        email: (value) => !!value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        role: (value) => Object.values(UserRole).includes(value)
      }
    });
  }

  transformBackendArray(dataArray: UtenteDTO[] | any[]): User[] {
    return this.baseTransform.transformArray<User>(dataArray, {
      fieldMappings: {
        id: (data) => data.id?.toString() ?? '',
        name: (data) => this.baseTransform.sanitizeString(data.nome ?? data.name),
        surname: (data) => this.baseTransform.sanitizeString(data.cognome ?? data.surname),
        birthDate: (data) => data.dataNascita ? this.baseTransform.sanitizeDate(data.dataNascita) : undefined,
        address: (data) => this.baseTransform.sanitizeString(data.indirizzo ?? data.address),
        phoneNumber: (data) => this.baseTransform.sanitizeString(data.cellulare ?? data.phoneNumber),
        email: (data) => this.baseTransform.sanitizeString(data.email),
        username: (data) => this.baseTransform.sanitizeString(data.username),
        role: (data) => this.mapRole(data.ruolo ?? data.role),
        tutorId: (data) => data.tutor?.id?.toString() ?? data.id_tutor?.toString(),
        lastLogin: (data) => data.lastLogin ? this.baseTransform.sanitizeDate(data.lastLogin) : undefined,
        profilePicture: (data) => this.baseTransform.sanitizeString(data.profilePicture ?? data.profile_picture)
      },
      defaultValues: {
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        students: [],
        profilePicture: ''
      },
      requiredFields: ['id', 'email']
    });
  }

  private mapRole(role: string): UserRole {
    switch (role?.toLowerCase()) {
      case 'studente':
      case 'student':
        return UserRole.STUDENT;
      case 'tutor':
        return UserRole.TUTOR;
      case 'admin':
      case 'amministratore':
        return UserRole.ADMIN;
      default:
        return UserRole.STUDENT;
    }
  }
}
