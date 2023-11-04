import { Injectable, signal,computed } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ApiService } from '@wsv2/app-config';
import { UserProfileDto } from '../interfaces/user-profileDto.model';
import { UserManagerService } from '@wsv2/account-service';
import { ResetPasswordProfileDto } from '../interfaces/reset-password-profileDto.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, tap,  Observable } from 'rxjs';

interface UserProfileState {

  userProfile: UserProfileDto;

  queryUpdate: UserProfileDto |undefined;
  queryDelete: UserProfileDto |undefined;

  state: Status;
}

export interface Message {
  message: string | undefined;
  error: boolean;
}

enum Status {
  empty = 0,
  load = 1,
  modify = 2,
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {

  private headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: 'Bearer ' + this.userManager.AccessToken(),
  });

  private state = signal<UserProfileState>({
    userProfile:<UserProfileDto> {address:'',email:undefined,phone:undefined,firstName:'',lastName:''},
   
    queryUpdate: undefined,
    queryDelete: undefined,
    state: Status.empty,
  });
  private error_state =signal<Message>({message:undefined,error:false});

  public UserProfile=computed(()=>this.state().userProfile);

  public  Message =computed(()=>this.error_state());

  constructor(
    private http: HttpClient,
    private userManager: UserManagerService,
    private url: ApiService
  ) {
    this.LoadUser();
  }

  private GetUser$ = (): Observable<UserProfileDto> => {
    //debugger
    this.url.Controller = 'Profile';
    this.url.Action = 'GetUser';
    this.url.ID = null;

   
    //   console.log("Profile getUser tocken"+this.userManager.AccessToken());
    //  console.log("Profile getUser url---" +this.url.Url);

    return this.http.get<UserProfileDto>(this.url.Url, {
      headers: this.headers ,withCredentials: true,
    });
  };

  private LoadUser() {

    this.GetUser$(). pipe(
      tap((data) => {
      //  this.state.update(() => data);
        this.state.update((state) => ({
          ...state,
         userProfile: data,state:Status.load}));
       
      }),
      takeUntilDestroyed(),
      catchError((err ) =>{
         console.error(err);
        this.state.update((d)=>({...d,queryUpdate:d.userProfile,state:Status.modify}));
        this.error_state.update((m)=>({...m,error:true})) ;
       return of(<UserProfileDto> {address:'',email:undefined,phone:undefined,firstName:'',lastName:''})}) //  on any error, just return an empty array
    )
    .subscribe();
  }

  public Update = (credentials: string): Observable<any> => {
    this.url.Controller = 'Profile';
    this.url.Action = 'EditUser';
    this.url.ID = null;
   
    return this.http.post(this.url.AuthUrl, credentials, {headers: this.headers });
  };

  public ResetPassword = (body: ResetPasswordProfileDto) => {
    this.url.Controller = 'Profile';
    this.url.Action = 'ResetPasswordProfile';
    this.url.ID = null;
  

    return this.http.post(this.url.AuthUrl, body, { headers: this.headers  });
  };

  public Delete = (id: string): Observable<any> => {
     // id is email-user
    this.url.Controller = 'Profile';
    this.url.Action = 'Delete';
    this.url.ID = null;
    
    const url = this.url.AuthUrl + '/' + id;
    console.log('url delete profile-' + url);
    return this.http.delete(url, { headers: this.headers  });
  };
}
