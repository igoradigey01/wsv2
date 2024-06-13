import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { RouterModule } from '@angular/router';

//import { HttpClientModule } from '@angular/common/http';
// import { InjectionToken } from '@angular/core';
// import { IEnvironment } from './_shared/interfaces/environment.model';
// import { ICompanyInformation} from './_shared/interfaces/company-information.model';
// import { IMenyItem } from './_shared/interfaces/meny-item.model';


/** relize in APP_INITIALIZER main All apps
//export const APP_CONFIG = new InjectionToken<IEnvironment>('Application config');
//export const COMPANY_CONFIG= new InjectionToken<ICompanyInformation>('Company config');
//export const MENY_CONFIG= new InjectionToken<IMenyItem>('Meny config')
*/

@NgModule({
  imports: [
    CommonModule,
    //HttpClientModule
  ]
})
export class AppConfigModule {}
