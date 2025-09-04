import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth';
import { NotificationService } from '../../../../core/services/notification';
import { TutorAttendanceService } from '../../services/tutor-attendance';
import { TutorJustificationService } from '../../services/tutor-justification';
import { StudentManagementService } from '../../services/student-management';
import { StatsCardComponent } from '../../../../shared/components/stats-card/stats-card';
import { StatusColorPipe } from '../../../../shared/pipes/status-color-pipe';
import { User } from '../../../../shared/models/user';
import { Attendance } from '../../../../shared/models/attendance';
import { Justification, StudentSummary } from '../../../../shared/models/justification';

@Component({
  selector: 'app-tutor-dashboard',
  standalone: true,
  imports: [CommonModule, StatsCardComponent, StatusColorPipe],
  templateUrl: './tutor-dashboard.html',
  styleUrls: ['./tutor-dashboard.scss']
})
export class TutorDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  currentUser: User | null = null;
  pendingAttendance: Attendance[] = [];
  pendingJustifications: Justification[] = [];
  students: StudentSummary[] = [];
  stats: any = null;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private attendanceService: TutorAttendanceService,
    private justificationService: TutorJustificationService,
    private studentService: StudentManagementService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadDashboardData();
    this.setupSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUserData(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => this.currentUser = user);
  }

  private loadDashboardData(): void {
    this.isLoading = true;

    // carica presenze in sospeso
    this.attendanceService.loadPendingAttendance()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (attendance) => {
          this.pendingAttendance = attendance;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading pending attendance:', error);
          this.isLoading = false;
        }
      });

    // carica giustificazioni in sospeso
    this.justificationService.loadPendingJustifications()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (justifications) => this.pendingJustifications = justifications,
        error: (error) => console.error('Error loading pending justifications:', error)
      });

    // carica studenti
    this.studentService.loadStudents()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (students) => this.students = students,
        error: (error) => console.error('Error loading students:', error)
      });

    // carica statistiche
    this.attendanceService.loadAttendanceStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => this.stats = stats,
        error: (error) => console.error('Error loading stats:', error)
      });
  }

  private setupSubscriptions(): void {
    this.attendanceService.pendingAttendance$
      .pipe(takeUntil(this.destroy$))
      .subscribe(attendance => this.pendingAttendance = attendance);

    this.justificationService.pendingJustifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe(justifications => this.pendingJustifications = justifications);
  }

  approveAttendance(attendanceId: string): void {
    this.attendanceService.approveAttendance(attendanceId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success('Successo', 'Presenza approvata');
        },
        error: (error) => {
          console.error('Error approving attendance:', error);
          this.notificationService.error('Errore', 'Impossibile approvare la presenza');
        }
      });
  }

  rejectAttendance(attendanceId: string): void {
    this.attendanceService.rejectAttendance(attendanceId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.warning('Rifiutata', 'Presenza rifiutata');
        },
        error: (error) => {
          console.error('Error rejecting attendance:', error);
          this.notificationService.error('Errore', 'Impossibile rifiutare la presenza');
        }
      });
  }

  approveJustification(justificationId: string): void {
    this.justificationService.approveJustification(justificationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success('Successo', 'Giustificazione approvata');
        },
        error: (error) => {
          console.error('Error approving justification:', error);
          this.notificationService.error('Errore', 'Impossibile approvare la giustificazione');
        }
      });
  }

  rejectJustification(justificationId: string): void {
    this.justificationService.rejectJustification(justificationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.warning('Rifiutata', 'Giustificazione rifiutata');
        },
        error: (error) => {
          console.error('Error rejecting justification:', error);
          this.notificationService.error('Errore', 'Impossibile rifiutare la giustificazione');
        }
      });
  }

  sendNotification(): void {
    this.notificationService.info('Inviata', 'Notifica inviata agli studenti');
  }

  trackByAttendanceId(index: number, item: Attendance): string {
    return item.id;
  }

  trackByJustificationId(index: number, item: Justification): string {
    return item.id;
  }

  trackByStudentId(index: number, item: StudentSummary): string {
    return item.student?.id?.toString() || index.toString();
  }

  getStudentStatusClass(isActive: boolean | undefined): string {
    return isActive ? 'status-active' : 'status-inactive';
  }

  viewAllStudents(): void {
    this.notificationService.info('Info', 'Visualizzazione di tutti gli studenti');
  }

  exportAttendance(): void {
    this.notificationService.info('Export', 'Esportazione presenze in corso...');
  }

  generateReport(): void {
    this.notificationService.info('Report', 'Generazione report in corso...');
  }

  manageStudents(): void {
    this.notificationService.info('Gestione', 'Apertura gestione studenti...');
  }

  viewStatistics(): void {
    this.notificationService.info('Statistiche', 'Visualizzazione statistiche...');
  }

  logout(): void {
    this.authService.logout();
  }
}
