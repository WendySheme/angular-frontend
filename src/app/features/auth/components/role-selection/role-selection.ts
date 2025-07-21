import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type UserRole = 'student' | 'tutor';

@Component({
  selector: 'app-role-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './role-selection.html',
  styleUrls: ['./role-selection.scss']
})
export class RoleSelectionComponent {
  @Input() selectedRole: UserRole | null = null;
  @Output() roleSelected = new EventEmitter<UserRole>();

  roles = [
    {
      id: 'student' as UserRole,
      title: 'Studente',
      description: 'Registra presenze e gestisci giustificazioni',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      color: 'blue',
      features: [
        'Registrazione presenze quotidiane',
        'Invio giustificazioni',
        'Visualizzazione calendario',
        'Statistiche personali'
      ]
    },
    {
      id: 'tutor' as UserRole,
      title: 'Tutor',
      description: 'Monitora studenti e approva presenze',
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      color: 'orange',
      features: [
        'Approvazione presenze',
        'Gestione giustificazioni',
        'Report e statistiche',
        'Export dati'
      ]
    }
  ];

  selectRole(role: UserRole): void {
    this.selectedRole = role;
    this.roleSelected.emit(role);
  }

  getRoleCardClasses(role: UserRole): string {
    const baseClasses = 'group cursor-pointer p-6 border-2 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1';

    if (this.selectedRole === role) {
      return role === 'student'
        ? `${baseClasses} border-blue-500 bg-blue-50 shadow-lg -translate-y-1`
        : `${baseClasses} border-orange-500 bg-orange-50 shadow-lg -translate-y-1`;
    }

    return `${baseClasses} border-gray-200 bg-white hover:border-gray-300`;
  }

  getIconClasses(role: UserRole): string {
    const baseClasses = 'w-12 h-12 mx-auto mb-4 transition-colors duration-300';

    if (this.selectedRole === role) {
      return role === 'student'
        ? `${baseClasses} text-blue-600`
        : `${baseClasses} text-orange-600`;
    }

    return `${baseClasses} text-gray-400 group-hover:text-gray-600`;
  }

  getTitleClasses(role: UserRole): string {
    const baseClasses = 'text-xl font-bold mb-2 transition-colors duration-300';

    if (this.selectedRole === role) {
      return role === 'student'
        ? `${baseClasses} text-blue-700`
        : `${baseClasses} text-orange-700`;
    }

    return `${baseClasses} text-gray-800`;
  }

  trackByRole(index: number, role: any): any {
    return role.id;
  }
}
