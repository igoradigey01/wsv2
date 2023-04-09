import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppConfigModule } from '@wsv2/app-config'
import { tap } from 'rxjs/operators';
import { environment } from './environments/environment';
//import { APP_CONFIG ,COMPANY_CONFIG,MENY_CONFIG} from "@wsv2/app-config";
import { APP_INITIALIZER, importProvidersFrom, inject } from "@angular/core"
import {
  MenyItemsService, EnvironmentService,
  CompanyInformationService, ICompanyInformation
} from '@wsv2/app-config'





bootstrapApplication(AppComponent, {



  providers: [
    importProvidersFrom(HttpClientModule),
    provideAnimations(),

    // { provide: APP_CONFIG, useValue: environment}, 05.04.23
    //https://github.com/profanis/codeShotsWithProfanis/blob/44/environmental_variables_app_initializer/src/app/app.module.ts
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        const menyItemsService = inject(MenyItemsService);

        const http = inject(HttpClient);
        return () =>
          new Promise((resolve) => {
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

      , multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        const menyItemsService = inject(MenyItemsService);

        const http = inject(HttpClient);
        return () =>
          new Promise((resolve) => {
            // load settings for a local app            
            //console.log("--promise is ok--")
            http
              .get('assets/meny_items_assembly/manager-meny-items.json')
              .pipe(
                tap((data: any) => {
                  menyItemsService.managerMenyItems = data;
                  console.log("--promise is ok--");
                  resolve(true);
                }))
              .subscribe();
            resolve(true)
          });
      }

      , multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        const menyItemsService = inject(MenyItemsService);

        const http = inject(HttpClient);
        return () =>
          new Promise((resolve) => {
            // load settings for a local app            
            //console.log("--promise is ok--")
            http
              .get('assets/meny_items_assembly/admin-meny-items.json')
              .pipe(
                tap((data: any) => {
                  menyItemsService.adminMenyItems = data;
                  console.log("--promise is ok--");
                  resolve(true);
                }))
              .subscribe();
            resolve(true)
          });
      }

      , multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => {

        const environmentService = inject(EnvironmentService);

        const http = inject(HttpClient);
        return () =>
          new Promise((resolve) => {
            // http
            // .get('assets/meny_items_assembly/admin-meny-items.json')
            // .pipe(
            //    tap((data: any) => {
            //     menyItemsService.adminMenyItems = data;
            //     console.log("--promise is ok--");
            //     resolve(true);
            //      }))            
            // .subscribe();
            resolve(true)
          });
      }

      , multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => {

        const companyInformationService = inject(CompanyInformationService);
        const http = inject(HttpClient);
        return () =>
          new Promise((resolve) => {
            http
              .get<ICompanyInformation>('assets/company_information/company_information.json')
              .pipe(
                tap((data: ICompanyInformation) => {

                  companyInformationService.company_guarantees = data.company_guarantees;
                  companyInformationService.company_logo = data.company_logo;
                  companyInformationService.company_activities = data.company_activities;
                  companyInformationService.company_copyright = data.company_copyright;
                  companyInformationService.company_lunch_time = data.company_lunch_time;
                  companyInformationService.company_name = data.company_name;
                  companyInformationService.company_normalize_phone = data.company_normalize_phone;
                  companyInformationService.company_phone = data.company_phone;
                  companyInformationService.company_photo = data.company_photo;
                  companyInformationService.company_time_create = data.company_time_create;
                  companyInformationService.company_work_time = data.company_work_time;
                  companyInformationService.yandex_point = data.yandex_point;

                  /*  for (const key  in  data) {
                    if (companyInformationService.hasOwnProperty(key)) {

                     //  Object.entries(companyInformationService).map(([comp_key, value])=>{
                     //   if(key==comp_key){
                     //     value=data[key as keyof ICompanyInformation];
                     //     console.log(`${comp_key} ${value}`);
                     //   }
                     //  })

                     // Object.entries(companyInformationService).forEach(([comp_key, value]) => {
                     //  // console.log(`${comp_key} ${value}`); // "a 5", "b 7", "c 9"
                     //   if(key==comp_key){
                     //     value=data[key as keyof ICompanyInformation];
                     //     console.log(`${comp_key} ${value}`)

                     //   }
                     // });
                     
                     //https://stackoverflow.com/questions/57086672/element-implicitly-has-an-any-type-because-expression-of-type-string-cant-b
                      // console.log("--promise is ok--" + key +":",companyInformationService[key as keyof ICompanyInformation])
                     }
                    } */

                  resolve(true);
                }))
              .subscribe();
            resolve(true)
          });
      }

      , multi: true
    },
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation())
  ],
}).catch((err) => console.error(err));

