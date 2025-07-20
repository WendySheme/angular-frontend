import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth';
import { NotificationService } from '../../../../core/services/notification';
import { StudentAttendanceService } from '../../services/student-attendance-service';
import { StudentJustificationService } from '../../services/student-justification';
import { User } from '../../../../shared/models/user';
import { Attendance } from '../../../../shared/models/attendance';
import { AttendanceStats } from '../../../../shared/models/attendance';
import { Justification } from '../../../../shared/models/justification';

@Component({

  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  currentUser: User | null = null;
  currentDate = new Date();
  todayAttendance: Attendance | null = null;
  stats: AttendanceStats | null = null;
  recentJustifications: Justification[] = [];
  isLoading = false;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private attendanceService: StudentAttendanceService,
    private justificationService: StudentJustificationService
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

    // carica presenza di oggi
    this.attendanceService.getTodayAttendance()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (attendance) => {
          this.todayAttendance = attendance;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading today attendance:', error);
          this.notificationService.error('Errore', 'Impossibile caricare i dati di presenza');
          this.isLoading = false;
        }
      });

    // carica statistiche
    this.attendanceService.loadStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => this.stats = stats,
        error: (error) => console.error('Error loading stats:', error)
      });

    // carica giustificazioni recenti
    this.justificationService.loadJustifications({ limit: 5 })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (justifications: { data: Justification[] }) => this.recentJustifications = justifications.data,
        error: (error) => console.error('Error loading justifications:', error)
      });
  }

  private setupSubscriptions(): void {
    // ascolta aggiornamenti in tempo reale
    this.attendanceService.todayAttendance$
      .pipe(takeUntil(this.destroy$))
      .subscribe(attendance => this.todayAttendance = attendance);

    this.attendanceService.stats$
      .pipe(takeUntil(this.destroy$))
      .subscribe(stats => this.stats = stats);
  }

  markPresent(): void {
    if (this.todayAttendance) {
      this.notificationService.warning('Attenzione', 'Presenza già registrata per oggi');
      return;
    }

    this.attendanceService.markAttendance('present')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (attendance) => {
          this.todayAttendance = attendance;
          this.notificationService.success('Successo', 'Presenza registrata con successo');
        },
        error: (error) => {
          console.error('Error marking attendance:', error);
          this.notificationService.error('Errore', 'Impossibile registrare la presenza');
        }
      });
  }

  markAbsent(): void {
    if (this.todayAttendance) {
      this.notificationService.warning('Attenzione', 'Presenza già registrata per oggi');
      return;
    }

    this.attendanceService.markAttendance('absent')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (attendance) => {
          this.todayAttendance = attendance;
          this.notificationService.warning('Registrato', 'Assenza registrata');
        },
        error: (error) => {
          console.error('Error marking attendance:', error);
          this.notificationService.error('Errore', 'Impossibile registrare l\'assenza');
        }
      });
  }

  logout(): void {
    this.authService.logout();
  }

  getAttendanceStatusColor(): string {
    if (!this.todayAttendance) return 'text-yellow-500';

    switch (this.todayAttendance.status) {
      case 'present':
        return 'text-green-500';
      case 'absent':
        return 'text-red-500';
      case 'justified':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  }

  getAttendanceStatusText(): string {
    if (!this.todayAttendance) return 'In attesa di registrazione';

    switch (this.todayAttendance.status) {
      case 'present':
        return 'Presente';
      case 'absent':
        return 'Assente';
      case 'justified':
        return 'Giustificata';
      default:
        return 'Stato sconosciuto';
    }
  }
}
