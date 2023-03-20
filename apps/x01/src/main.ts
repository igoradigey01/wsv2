import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { environment } from './environments/environment';
import { APP_CONFIG } from "@wsv2/app-config";

bootstrapApplication(AppComponent, {
  
  providers: [ 
    
    provideAnimations(),
    { provide: APP_CONFIG, useValue: environment}, 
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation())],
}).catch((err) => console.error(err));
