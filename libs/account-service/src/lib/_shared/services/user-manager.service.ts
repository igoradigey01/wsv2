import { Injectable, signal, computed } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {  Observable } from 'rxjs';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ApiService} from '@wsv2/app-config';


// eslint-disable-next-line @nx/enforce-module-boundaries
import { UserRole } from '@wsv2/app-common';

interface UserManagerStore {
  accessToken: string;
  //  refreshToken:string; хранится в cookies  - httpOnly 17.10.23
  userRole: UserRole;
  opt: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UserManagerService {
  private state = signal<UserManagerStore>({
    accessToken: '',
    userRole: UserRole.default,
    opt: false,
  });

  public Role = computed(() => this.state().userRole);

  public AccessToken = computed(() => this.state().accessToken);


  constructor(
    private http: HttpClient,
    private url: ApiService,
  //  private repozitory: EnvironmentService
  ) {
    // if(this.state().state===Status.empty){
    // this.LoadCatlaogs();
   // }
  }

  public SetAccessToken(accessToken: string | undefined) {
    if (accessToken) {
      const data = new Date();
      const jwtbody = JSON.parse(atob(accessToken.split('.')[1]));
      const exp = jwtbody.exp;
      const role = jwtbody.role;
      if (role === 'Shopper' && this.state().opt)
        this.state.update((d) => ({
          ...d,
          accessToken: accessToken,
          userRole: UserRole.shoperOpt,
        }));
      if (role === 'Shopper')
        this.state.update((d) => ({
          ...d,
          accessToken: accessToken,
          userRole: UserRole.shoper,
        }));
      if (role === 'Manager')
        this.state.update((d) => ({
          ...d,
          accessToken: accessToken,
          userRole: UserRole.manager,
        }));
      if (role === 'Admin')
        this.state.update((d) => ({
          ...d,
          accessToken: accessToken,
          userRole: UserRole.admin,
        }));

      const expiry = JSON.parse(atob(accessToken.split('.')[1])).exp;
      const delta = expiry - data.getTime() / 1000; // delta is sec 14399
      console.log('expiry--' + delta); //is good (in server 240 min or 4ч)
      console.log('exp--' + exp + '' + 'role:' + role);
      setTimeout(() => {
        this.loadRefreshToken(accessToken);
        console.log('-----this.loadRefreshToken(accessToken);---');
      }, 5000);
      
    } else {
      if (this.state().opt)
        this.state.update((d) => ({
          ...d,
          accessToken: '',
          userRole: UserRole.opt,
        }));
      this.state.update((d) => ({
        ...d,
        accessToken: '',
        userRole: UserRole.default,
      }));
    }
  }

  private loadRefreshToken=(accessToken: string)=>{
    this.refreshToken$(accessToken).subscribe({
      next: (d) => { this.SetAccessToken(d.accessToken)
        },
      error: (err: HttpErrorResponse) =>{
        console.error(err);
      }
  })
  
  }

  private refreshToken$= (accessToken: string): Observable<any> => {

    this.url.Controller = 'Account';
    this.url.Action = 'refresh-token';
    this.url.ID=null;

  const  credentials = `{
      "access_token": "${accessToken}"
    }`;
  
    return this.http.post(this.url.AuthUrl, credentials, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });


  }


  private tokenExpired(token: string) {
    const expiry = JSON.parse(atob(token.split('.')[1])).exp;
    return Math.floor(new Date().getTime() / 1000) >= expiry;
  }
}
