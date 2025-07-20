import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AuthService } from './services/auth';
import { NotificationService } from './services/notification';
import { WebSocketService } from './services/websocket';
import { ApiService } from './services/api';

import { AuthGuard } from './guards/auth-guard';
import { RoleGuard } from './guards/role-guard';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
    NotificationService,
    WebSocketService,
    ApiService,
    AuthGuard,
    RoleGuard
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}