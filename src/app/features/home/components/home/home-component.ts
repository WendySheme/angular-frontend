import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {
  features = [
    {
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      title: 'Veloce & Intuitivo',
      description: 'Interfaccia reattiva'
    },
    {
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      title: 'Sicuro & Affidabile',
      description: 'Sistema di autenticazione '
    },
    {
      icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z',
      title: 'Report & Analytics',
      description: 'Statistiche dettagliate e possibilità di esportazione dati per il monitoraggio'
    }
  ];

  studentFeatures = [
    'Registrazione presenze giornaliere',
    'Gestione giustificazioni',
    'Panoramica mensile',
    'Notifiche in tempo reale'
  ];

  tutorFeatures = [
    'Monitoraggio studenti',
    'Approvazione presenze',
    'Export dati e notifiche',
    'Dashboard amministrativa'
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // reindirizza se già autenticato
    if (this.authService.getCurrentUser()) {
      const user = this.authService.getCurrentUser();
      if (user?.role === 'student') {
        this.router.navigate(['/student']);
      } else if (user?.role === 'tutor') {
        this.router.navigate(['/tutor']);
      }
    }
  }

  navigateToLogin(role?: 'student' | 'tutor'): void {
    if (role) {
      this.router.navigate(['/auth/login'], { queryParams: { role } });
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  scrollToFeatures(): void {
    const element = document.getElementById('features');
    element?.scrollIntoView({ behavior: 'smooth' });
  }
}
