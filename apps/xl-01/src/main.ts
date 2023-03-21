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
// import { importProvidersFrom } from '@angular/core';
// import {RouterModule} from '@angular/router'
// import { Route } from '@angular/router';




bootstrapApplication(AppComponent, {
  
  providers: [ 
   // importProvidersFrom(RouterModule.forRoot(routs)),
    provideAnimations(),
    { provide: APP_CONFIG, useValue: environment}, 
   provideRouter(appRoutes, withEnabledBlockingInitialNavigation())
  ],
}).catch((err) => console.error(err));

