import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth';
import { NotificationService } from '../../../../core/services/notification';
import { LoaderComponent } from '../../../../shared/components/loader/loader';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LoaderComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  loginForm: FormGroup;
  selectedRole: 'student' | 'tutor' | null = null;
  isLoading = false;
  showPassword = false;

  demoCredentials = [
    { role: 'student', email: 'student@demo.com', password: 'demo123' },
    { role: 'tutor', email: 'tutor@demo.com', password: 'demo123' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.createForm();
  }

  ngOnInit(): void {
    this.checkRouteParams();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  private checkRouteParams(): void {
    this.route.queryParams.subscribe(params => {
      if (params['role'] && ['student', 'tutor'].includes(params['role'])) {
        this.selectRole(params['role']);
      }
    });
  }

  selectRole(role: 'student' | 'tutor'): void {
    this.selectedRole = role;
  }

  fillDemoCredentials(role: 'student' | 'tutor'): void {
    const credentials = this.demoCredentials.find(cred => cred.role === role);
    if (credentials) {
      this.loginForm.patchValue({
        email: credentials.email,
        password: credentials.password
      });
      this.selectRole(role);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid || !this.selectedRole) {
      this.markFormGroupTouched();
      if (!this.selectedRole) {
        this.notificationService.error('Errore', 'Seleziona un ruolo prima di accedere');
      }
      return;
    }

    this.isLoading = true;
    const formValue = this.loginForm.value;
    const credentials = {
      ...formValue,
      role: this.selectedRole
    };

    this.authService.login(credentials)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.notificationService.success('Successo', 'Accesso effettuato con successo');
          this.redirectUser(response.user.role);
        },
        error: (error) => {
          this.isLoading = false;
          const errorMessage = error.error?.message || 'Credenziali non valide';
          this.notificationService.error('Errore di accesso', errorMessage);
        }
      });
  }

  private redirectUser(role: string): void {
    const redirectUrl = role === 'student' ? '/student' : '/tutor';
    this.router.navigate([redirectUrl]);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.touched && field?.errors) {
      if (field.errors['required']) {
        return `${fieldName === 'email' ? 'Email' : 'Password'} è richiesta`;
      }
      if (field.errors['email']) {
        return 'Inserisci un email valida';
      }
      if (field.errors['minlength']) {
        return 'Password deve essere di almeno 6 caratteri';
      }
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field?.touched && field?.errors);
  }
}

