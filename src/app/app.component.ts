import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AuthService } from './core/services/auth';
import { WebSocketService } from './core/services/websocket';
import { NotificationService } from './core/services/notification';
import { HeaderComponent } from './shared/components/header/header';
import { FooterComponent } from './shared/components/footer/footer';
import { NotificationComponent } from './shared/components/notification/notification';
import { LoaderComponent } from './shared/components/loader/loader';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    NotificationComponent,
    LoaderComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent implements OnInit {
  title = 'Registro Elettronico';
  isLoading = false;

  constructor(
    private router: Router,
    public authService: AuthService,
    private webSocketService: WebSocketService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.setupRouteRedirection();
    this.initializeServices();
  }

  private setupRouteRedirection(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // reindirizzamento automatico utenti autenticati
        if (event.url.startsWith('/auth') && this.authService.getCurrentUser()) {
          const user = this.authService.getCurrentUser();
          if (user?.role === 'student') {
            this.router.navigate(['/student']);
          } else if (user?.role === 'tutor') {
            this.router.navigate(['/tutor']);
          }
        }
      });
  }

  private initializeServices(): void {
    // servizio websocket si connette automaticamente quando l'utente è autenticato
    // servizio notifiche si carica automaticamente quando inizializzato
  }
}
