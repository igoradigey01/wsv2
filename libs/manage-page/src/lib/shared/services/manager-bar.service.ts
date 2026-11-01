import { Injectable } from '@angular/core';
import { ManagerServiceModule } from './maneger-service.module';
import {TokenService} from '@wsv2/xf-shared';
import { RouteApiService } from '@wsv2/xf-shared';

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
