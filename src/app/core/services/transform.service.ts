import { BaseTransformService } from './base-transform.service';
import { StatusStat } from './../../shared/models/attendance';
import { Injectable } from '@angular/core';
import { UtenteDTO } from '../models/backend-dtos';
import { PresenzaDTO } from '../models/backend-dtos';
import { GiustificativoDTO } from '../models/backend-dtos';
import { MeseDTO } from '../models/backend-dtos';
import { RuoloEnum,Stato,StatoApprovazione,TipoGiustificazione } from '../models/backend-dtos';
import  { Attendance, AttendanceStatus, ApprovalStatus, JustificationType } from '../models/interfaces';
import
 {
  Justification,
  Notification,
  NotificationType,
  StudentSummary,
  ApiResponse,
  PaginatedResponse,
  AppError,
  ValidationError,
} from '../models/interfaces';
import { User } from 'src/app/shared/models/user';




@Injectable({
  providedIn: 'root'
})
export class TransformService {

  constructor( private BaseTransformService: BaseTransformService) {}

  transformBackend(data: UtenteDTO | UtenteDTO): User {
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
        lastLogin: data => data.lastLogin ? this.BaseTransformService.sanitizeDate(data.last




}   ,

