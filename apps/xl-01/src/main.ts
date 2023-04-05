import { bootstrapApplication  } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { HttpClient , HttpClientModule} from '@angular/common/http';
import {AppConfigModule} from '@wsv2/app-config'
import { tap } from 'rxjs/operators';
import { environment } from './environments/environment';
//import { APP_CONFIG ,COMPANY_CONFIG,MENY_CONFIG} from "@wsv2/app-config";
import { APP_INITIALIZER, importProvidersFrom, inject} from "@angular/core"
import {MenyItemsService,EnvironmentService,CompanyInformationService} from '@wsv2/app-config'





 bootstrapApplication(AppComponent, {

  
  
  providers: [ 
     importProvidersFrom( HttpClientModule),
    provideAnimations(),
    
   // { provide: APP_CONFIG, useValue: environment}, 05.04.23
     //https://github.com/profanis/codeShotsWithProfanis/blob/44/environmental_variables_app_initializer/src/app/app.module.ts
    {provide: APP_INITIALIZER,
      useFactory: () => {
        const menyItemsService = inject(MenyItemsService);
       
        const http = inject(HttpClient);
         return()=>
           new Promise((resolve)=>{
              // load settings for a local app            
            //console.log("--promise is ok--")
            http
            .get('assets/meny_items_assembly/index-meny-items.json')
            .pipe(
               tap((data: any) => {
                menyItemsService.shopMenyItems = data;
                console.log("--promise is ok--");
                resolve(true);
                 }))            
            .subscribe();
             resolve(true)
             });
        }
      
      ,multi:true},
      {provide: APP_INITIALIZER,
        useFactory: () => {
        
          const environmentService = inject(EnvironmentService);
          
          const http = inject(HttpClient);
           return()=>
             new Promise((resolve)=>{
              //console.log("--promise is ok--")
               resolve(true)
               });
          }
        
        ,multi:true},
        {provide: APP_INITIALIZER,
          useFactory: () => {
          
            const companyInformationService = inject(CompanyInformationService);
            const http = inject(HttpClient);
             return()=>
               new Promise((resolve)=>{
                //console.log("--promise is ok--")
                 resolve(true)
                 });
            }
          
          ,multi:true},
   provideRouter(appRoutes, withEnabledBlockingInitialNavigation())
  ],
}).catch((err) => console.error(err));

