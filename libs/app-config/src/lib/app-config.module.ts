import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { appConfigRoutes } from './lib.routes';
import { InjectionToken } from '@angular/core';
import { IEnvironment } from './interfaces/environment.model';
export const APP_CONFIG = new InjectionToken<IEnvironment>('Application config');

@NgModule({
  imports: [CommonModule, RouterModule.forChild(appConfigRoutes)],
})
export class AppConfigModule {}
