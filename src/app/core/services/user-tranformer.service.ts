import { Injectable } from '@angular/core';
import { User, UserRole } from '../models/interfaces';
import { BaseTransformService } from './base-transform.service';

@Injectable({
  providedIn: 'root'
})
export class UserTranformerService {

  constructor(private baseTransform: BaseTransformService) {}

  transformBackend(data: any): User {
    return this.baseTransform.transformData<User>(data, {
      fieldMappings: {
        id: (data) => data.id?.toString() ?? '',
        email: (data) => this.baseTransform.sanitizeString(data.email),
        name: (data) => this.baseTransform.sanitizeString(data.nome ?? data.name),
        surname: (data) => this.baseTransform.sanitizeString(data.cognome ?? data.surname),
        role: (data) => this.mapRole(data.ruolo ?? data.role),
        tutorId: (data) => data.tutor?.id?.toString() ?? data.tutor_id?.toString(),
        assignedTutor: (data) => data.tutor ? this.transformBackend(data.tutor) : undefined,
        studentId: (data) => data.studentId?.toString() ?? data.student_id?.toString(),
        students: (data) => this.baseTransform.sanitizeArray(data.students),
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

  transformBackendArray(dataArray: any[]): User[] {
    return this.baseTransform.transformArray<User>(dataArray, {
      fieldMappings: {
        id: (data) => data.id?.toString() ?? '',
        email: (data) => this.baseTransform.sanitizeString(data.email),
        name: (data) => this.baseTransform.sanitizeString(data.nome ?? data.name),
        surname: (data) => this.baseTransform.sanitizeString(data.cognome ?? data.surname),
        role: (data) => this.mapRole(data.ruolo ?? data.role),
        tutorId: (data) => data.tutor?.id?.toString() ?? data.tutor_id?.toString(),
        studentId: (data) => data.studentId?.toString() ?? data.student_id?.toString(),
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
      case 'studente': return UserRole.STUDENT;
      case 'tutor': return UserRole.TUTOR;
      case 'admin': return UserRole.ADMIN;
      default: return UserRole.STUDENT;
    }
  }
}
