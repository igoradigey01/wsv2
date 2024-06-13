import { Injectable } from '@angular/core';
import { ManagerServiceModule } from './maneger-service.module';
import {TokenService} from 'apps/xf01/src/app/_shared/services/token.service';
import { RouteApiService } from 'apps/xf01/src/app/_shared/services/route-api.service';

@Injectable({ providedIn: ManagerServiceModule })
export class ManagerBarService {

  constructor(
    private token:TokenService ,
    private url: RouteApiService
  ) {}

  get RootImg(): string {
    // return this.http.get(src,{responseType: 'blob'});

    return this.url.WWWroot;
  }


}
