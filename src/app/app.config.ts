import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./features/home/home-routing').then(m => m.HomeRoutingModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth-routing.module').then(m => m.AuthRoutingModule)
  },
  {
    path: 'student',
    loadComponent: () => import('./features/student-dashboard/components/student-dashboard/student-dashboard').then(m => m.StudentDashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'tutor',
    loadComponent: () => import('./features/tutor-dashboard/components/tutor-dashboard/tutor-dashboard').then(m => m.TutorDashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/tutor-dashboard/components/tutor-dashboard/tutor-dashboard').then(m => m.TutorDashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient()
  ]
};
