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
      icon: 'M1428 385q53-4 110 6t111 33t104 56t87 77t58 96t22 111q0 63-26 111t-70 82t-99 49t-113 17q-43 0-81-7q2 18 3 36t2 36q0 51-8 97t-23 95H415q-12-49-21-95t-10-97q0-16 1-32t3-32q-54 0-101-19t-82-54t-56-82t-21-101q0-53 20-99t55-82t81-55t100-20q69 0 126 33t94 93q85-69 176-97t200-29q-42-51-63-111t-21-126q0-42 11-78t29-69t40-64t46-63l406 384zM256 768q0 27 10 50t27 40t41 28t50 10q20 0 38-6q31-85 85-154q-11-41-45-68t-78-28q-27 0-50 10t-40 27t-28 41t-10 50zm1147 384q3-16 4-32t1-32q0-30-5-59t-13-58q-42-21-80-50t-70-65t-53-78t-29-90q-46-23-96-35t-102-13q-91 0-172 36t-142 97t-98 143t-36 172q0 16 1 32t4 32h240q11-38 11-75q0-57-24-108t-68-89l82-98q66 55 101 130t36 163q0 20-1 39t-6 38h515zm210-257q30 0 62-7t58-23t42-41t17-61q0-55-33-101t-82-79t-107-52t-107-19q-20 0-39 3t-39 6l-342-323q-9 21-14 37t-5 40q0 38 11 73t31 65t48 53t63 39q32 14 67 18t70 9q-9 25-20 52t-11 55q0 59 32 106t81 80t107 52t110 18z',
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
