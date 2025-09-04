import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';
import { RoleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/components/home/home-component').then(c => c.HomeComponent)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/components/login/login').then(c => c.LoginComponent)
  },
  {
    path: 'student',
    loadComponent: () => import('./features/student-dashboard/components/student-dashboard/student-dashboard').then(c => c.StudentDashboardComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['student'] }
  },
  {
    path: 'tutor',
    loadComponent: () => import('./features/tutor-dashboard/components/tutor-dashboard/tutor-dashboard').then(c => c.TutorDashboardComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['tutor'] }
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: false,
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
