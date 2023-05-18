import { appConfig } from './app/app.config';
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';

//import { APP_CONFIG ,COMPANY_CONFIG,MENY_CONFIG} from "@wsv2/app-config";

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
