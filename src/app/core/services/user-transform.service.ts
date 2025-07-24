
import { BaseTransformService } from './base-transform.service';
import { Injectable } from '@angular/core';
import { RuoloEnum, UtenteDTO } from '../models/backend-dtos';
import { User, UserRole } from 'src/app/shared/models/user'



@Injectable({
  providedIn: 'root'
})
export class TransformService {

  constructor( private BaseTransformService: BaseTransformService) {}

  transformBackend(data: UtenteDTO): User {
    return this.BaseTransformService.transformData<User>(data, {
      fieldMappings: {
        id:data => data.id?.toString() ?? '',
        name: data => this.BaseTransformService.sanitizeString(data.nome ?? data.name),
        surname: data => this.BaseTransformService.sanitizeString(data.cognome ?? data.surname),
        birthDate: data => data.dataNascita ? this.BaseTransformService.sanitizeDate(data.dataNascita) : undefined,
        address : data => this.BaseTransformService.sanitizeString(data.indirizzo ?? data.address),
        phoneNumber: data => this.BaseTransformService.sanitizeString(data.cellulare ?? data.phoneNumber),
        email: data => this.BaseTransformService.sanitizeString(data.email),
        username: data => this.BaseTransformService.sanitizeString(data.username),
        password: data => this.BaseTransformService.sanitizeString(data.password),
        role:data => this.mapRole(data.ruolo ?? data.role),
        tutor:data => data.tutor ? this.transformBackend(data.tutor) : undefined,
        tutorId: data => data.tutor?.id?.toString() ?? data.id_tutor?.toString(),
        students: data => data.students ? data.students.map((student: any) => this.transformBackend(student)) : [],
      },

      defaultValues : {
        profilePicture: '',
        isActive: true,
        createdAt: new Date,
      },
      requiredFields: ['id','email'],

      validators: {
      id: (value) => !!value && value.length > 0,
      email: (value) => !!value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      role: (value) => Object.values(UserRole).includes(value)
      }
          })
   }


// da aggiundere un metodo che gestisce una lista di utenti + gestione errori


   private mapRole(RuoloEnum: string) : UserRole {
    switch(RuoloEnum?.toLowerCase()) {
      case 'student':
        case 'studente':
        return UserRole.STUDENT;

      case 'tutor':
        return UserRole.TUTOR;


        case 'admin':
        case 'amministratore':
          default:
            return UserRole.ADMIN;


   }







  }
} // last parenthesis
