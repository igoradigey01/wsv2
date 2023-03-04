import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InjectionToken } from '@angular/core';
import { IEnvironment } from './_shared/interfaces/environment.model';
export const APP_CONFIG = new InjectionToken<IEnvironment>('Application config');


@NgModule({
  imports: [CommonModule],
})
export class EnvironmentUrlModule {}
