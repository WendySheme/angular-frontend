import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
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

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  status?: 'present' | 'absent' | 'justified';
}

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
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
  
  // Calendar properties
  currentCalendarDate = new Date();
  calendarDays: CalendarDay[] = [];
  monthlyAttendance: { [key: string]: 'present' | 'absent' | 'justified' } = {};
  
  get isRegistered(): boolean {
    return !!this.todayAttendance;
  }
  
  get statusColor(): string {
    return this.getAttendanceStatusColor();
  }
  
  get statusText(): string {
    return this.getAttendanceStatusText();
  }

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
    this.loadMockAttendanceData();
    this.generateCalendar();
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

  onMarkPresent(): void {
    this.markPresent();
  }

  onMarkAbsent(): void {
    this.markAbsent();
  }

  // Calendar Methods
  generateCalendar(): void {
    const year = this.currentCalendarDate.getFullYear();
    const month = this.currentCalendarDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    // Adjust for Monday start (0 = Monday, 6 = Sunday)
    const firstDayOfWeek = (firstDay.getDay() + 6) % 7;
    
    const days: CalendarDay[] = [];
    
    // Add days from previous month
    const prevMonthLastDay = new Date(year, month, 0);
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(prevMonthLastDay.getFullYear(), prevMonthLastDay.getMonth(), prevMonthLastDay.getDate() - i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: this.isToday(date),
        status: this.getAttendanceStatus(date)
      });
    }
    
    // Add days of current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: this.isToday(date),
        status: this.getAttendanceStatus(date)
      });
    }
    
    // Add days from next month to complete the grid
    const totalCells = 42; // 6 rows × 7 days
    const remainingCells = totalCells - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: this.isToday(date),
        status: this.getAttendanceStatus(date)
      });
    }
    
    this.calendarDays = days;
  }

  previousMonth(): void {
    this.currentCalendarDate = new Date(
      this.currentCalendarDate.getFullYear(),
      this.currentCalendarDate.getMonth() - 1,
      1
    );
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentCalendarDate = new Date(
      this.currentCalendarDate.getFullYear(),
      this.currentCalendarDate.getMonth() + 1,
      1
    );
    this.generateCalendar();
  }

  private isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  private getAttendanceStatus(date: Date): 'present' | 'absent' | 'justified' | undefined {
    const dateKey = this.formatDateKey(date);
    return this.monthlyAttendance[dateKey];
  }

  private formatDateKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  // Justification Methods
  openJustificationForm(): void {
    this.notificationService.info('Info', 'Funzionalità di giustificazione in sviluppo');
  }

  trackByJustificationId(index: number, justification: Justification): string {
    return justification.id;
  }

  getJustificationStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'pending':
      case 'in_attesa':
        return 'pending';
      case 'approved':
      case 'approvata':
        return 'approved';
      case 'rejected':
      case 'respinta':
        return 'rejected';
      default:
        return 'pending';
    }
  }

  getJustificationStatusText(status: string): string {
    switch (status?.toLowerCase()) {
      case 'pending':
      case 'in_attesa':
        return 'In Attesa';
      case 'approved':
      case 'approvata':
        return 'Approvata';
      case 'rejected':
      case 'respinta':
        return 'Respinta';
      default:
        return 'In Attesa';
    }
  }

  // Mock data for development - remove when backend is connected
  private loadMockAttendanceData(): void {
    // Mock monthly attendance data
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Generate some mock attendance data for the current month
    for (let day = 1; day <= 25; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateKey = this.formatDateKey(date);
      
      if (day <= new Date().getDate()) {
        // Random attendance status for past days
        const rand = Math.random();
        if (rand > 0.8) {
          this.monthlyAttendance[dateKey] = 'absent';
        } else if (rand > 0.7) {
          this.monthlyAttendance[dateKey] = 'justified';
        } else {
          this.monthlyAttendance[dateKey] = 'present';
        }
      }
    }
  }
}
