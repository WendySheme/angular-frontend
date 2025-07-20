import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Attendance } from '../../../../shared/models/attendance';

@Component({
  selector: 'app-attendance-registration',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attendance-registration.component.html',
  styleUrls: ['./attendance-registration.component.scss']
})
export class AttendanceRegistrationComponent {
  @Input() todayAttendance: Attendance | null = null;
  @Output() markPresent = new EventEmitter<void>();
  @Output() markAbsent = new EventEmitter<void>();

  get statusColor(): string {
    if (!this.todayAttendance) return 'bg-yellow-500';

    switch (this.todayAttendance.status) {
      case 'present':
        return 'bg-green-500';
      case 'absent':
        return 'bg-red-500';
      case 'justified':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  }

  get statusText(): string {
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

  get isRegistered(): boolean {
    return !!this.todayAttendance;
  }

  onMarkPresent(): void {
    this.markPresent.emit();
  }

  onMarkAbsent(): void {
    this.markAbsent.emit();
  }
}
