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
import { environment } from '../../../../../environment';

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
  isProduction = environment.production;
  lastError: string | null = null;
  errorCount = 0;
  lastErrorTime: Date | null = null;

  demoCredentials = [
    { role: 'STUDENT', email: 'student@demo.com', password: 'demo123' },
    { role: 'TUTOR', email: 'tutor@demo.com', password: 'demo123' }
  ];

  backendTestCredentials = [
    { role: 'ADMIN', email: 'admin@realeites.com', password: 'password123' },
    { role: 'TUTOR', email: 'luca.marini@email.com', password: 'password123' },
    { role: 'TUTORATO', email: 'enrico.giacomini@realeites.com', password: 'password123' }
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
    const credentials = this.demoCredentials.find(cred => cred.role === role.toUpperCase());
    if (credentials) {
      this.loginForm.patchValue({
        email: credentials.email,
        password: credentials.password
      });
      this.selectRole(role);
    }
  }

  fillBackendTestCredentials(email: string): void {
    const credentials = this.backendTestCredentials.find(cred => cred.email === email);
    if (credentials) {
      this.loginForm.patchValue({
        email: credentials.email,
        password: credentials.password
      });
      this.selectedRole = credentials.role.toLowerCase() as 'student' | 'tutor';
    }
  }

  // Development method to test different payload formats
  runPayloadTests(): void {
    if (!environment.production) {
      const testEmail = 'admin@realeites.com';
      const testPassword = 'password123';
      
      console.log('🧪 Running payload format tests...');
      this.authService.testPayloadFormats(testEmail, testPassword);
      
      this.notificationService.info('Debug', 'Check console for payload test results');
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
      email: formValue.email,
      password: formValue.password,
      role: this.selectedRole?.toUpperCase()
    };

    this.authService.login(credentials)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.notificationService.success('Successo', 'Accesso effettuato con successo');
          this.redirectUser(response.user.ruolo || response.user.role || 'student');
        },
        error: (error) => {
          this.handleLoginError(error);
        }
      });
  }

  private handleLoginError(error: any): void {
    this.isLoading = false;
    this.errorCount++;
    this.lastErrorTime = new Date();
    
    console.error('🔥 Login component error:', error);
    
    let errorMessage = 'Errore di connessione al server';
    let errorDetails = '';
    
    if (error.status === 0) {
      errorMessage = 'Impossibile connettersi al server';
      errorDetails = 'Verifica che il backend Spring Boot sia in esecuzione su http://localhost:8080';
    } else if (error.status === 401) {
      errorMessage = 'Credenziali non valide';
      errorDetails = 'Email o password errati';
    } else if (error.status === 500) {
      errorMessage = 'Errore interno del server';
      if (error.error?.message) {
        errorDetails = error.error.message;
      } else {
        errorDetails = 'Possibili cause: database non connesso, utente non esistente, configurazione JWT, o errore nel codice Spring Boot. Controlla i log del backend per dettagli.';
      }
      
      // Log detailed server error info for debugging
      console.group('🔍 Server Error Analysis');
      console.log('Error Code:', error.error?.errorCode || 'N/A');
      console.log('Backend Message:', error.error?.message || 'N/A');
      console.log('Full Response:', error.error);
      console.log('Credentials sent:', { email: this.loginForm.get('email')?.value, role: this.selectedRole });
      console.log('Error count:', this.errorCount);
      console.log('Error time:', this.lastErrorTime);
      console.groupEnd();
    } else if (error.status === 404) {
      errorMessage = 'Endpoint non trovato';
      errorDetails = 'Il server non ha l\'endpoint /api/auth/login. Verifica la configurazione del backend.';
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    }
    
    this.lastError = errorMessage;
    
    // Show user-friendly error
    this.notificationService.error('Errore di accesso', errorMessage);
    
    // Show additional details in development or after multiple errors
    const showDetails = !environment.production || this.errorCount >= 3;
    if (showDetails && errorDetails) {
      console.warn('💡 Additional error details:', errorDetails);
      setTimeout(() => {
        this.notificationService.info(
          this.errorCount >= 3 ? 'Dettagli errore (multipli tentativi)' : 'Dettagli per sviluppatore', 
          errorDetails
        );
      }, 2000);
    }
    
    // Suggest running enhanced test after multiple failures
    if (this.errorCount >= 2 && !environment.production) {
      setTimeout(() => {
        this.notificationService.info('Suggerimento Debug', 'Usa il pulsante "Test Payloads" per diagnosticare il problema');
      }, 4000);
    }
  }

  private redirectUser(role: string): void {
    const normalizedRole = role.toLowerCase();
    let redirectUrl = '/student';
    
    if (normalizedRole === 'admin') {
      redirectUrl = '/admin';
    } else if (normalizedRole === 'tutor' || normalizedRole === 'tutorato') {
      redirectUrl = '/tutor';
    } else {
      redirectUrl = '/student';
    }
    
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

