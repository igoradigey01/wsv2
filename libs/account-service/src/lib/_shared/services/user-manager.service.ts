import { Injectable, signal, computed } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {  Observable } from 'rxjs';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ApiService} from '@wsv2/app-config';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { OptManagerService } from '@wsv2/shop-opt';


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

  // BehaviorSubject<boolean>(true);
  private state = signal<UserManagerStore>({
    accessToken: '',
    userRole: UserRole.default,
    opt: false,
  });

  public Role = computed(() => this.state().userRole);

  public AccessToken = computed(() => this.state().accessToken);

  
  // eff=effect(
  //   ()=>{
  //     console.log("opt is- "+this.state().opt)
  //     console.log("UserRole is- "+this.state().userRole)
  //     console.log("accessToken is- "+this.state().accessToken)
  //   }
  // )

  constructor(
    private http: HttpClient,
    private url: ApiService,
    private repositoryOpt: OptManagerService,
  //  private repozitory: EnvironmentService
  ) {
    this.checkFlagOpt();
  }

  private checkFlagOpt(){
    this.repositoryOpt.checkFlag();
    this.state.update((d) => ({
      ...d,
      opt:this.repositoryOpt.flagOpt()
     
    })); 
  }

  public SetRole(role:UserRole){
    this.state.update((d) => ({
      ...d,      
      userRole: role,
    }));
  }

  public SetCustomerOpt(opt:boolean){

    this.state.update((d) => ({
      ...d,      
     opt: opt,
    }));

  }

  public SetAccessToken(accessToken: string | undefined) {

    
   // debugger
    if (accessToken) {
      const data = new Date();
      const jwtbody = JSON.parse(atob(accessToken.split('.')[1]));
     // const exp = jwtbody.exp;
      const role = jwtbody.role.trim();
     switch(role){
      case 'Shopper':
        if ( this.state().opt){
          this.state.update((d) => ({
            ...d,
            accessToken: accessToken,
            userRole: UserRole.shoperOpt,
          }));
        } else
        this.state.update((d) => ({
          ...d,
          accessToken: accessToken,
          userRole: UserRole.shoper,
        }));
        break;
        case 'Manager':
          this.state.update((d) => ({
            ...d,
            accessToken: accessToken,
            userRole: UserRole.manager,
          }));
        break; 
        case 'Admin':
          this.state.update((d) => ({
            ...d,
            accessToken: accessToken,
            userRole: UserRole.admin,
          }));
        break; 
       
     }

      

      const expiry = jwtbody.exp;
      const delta = expiry - data.getTime() / 1000; // delta is sec 14399
     
      setTimeout(() => {
        this.loadRefreshToken(accessToken);
       // console.log('-----this.loadRefreshToken(accessToken);---'+accessToken);
      }, delta*1000);
      
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
       
      }),withCredentials: true,
    });


  }


  private tokenExpired(token: string) {
    const expiry = JSON.parse(atob(token.split('.')[1])).exp;
    return Math.floor(new Date().getTime() / 1000) >= expiry;
  }
}
