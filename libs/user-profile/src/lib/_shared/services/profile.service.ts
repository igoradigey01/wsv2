import { Injectable, signal, computed } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ApiService } from '@wsv2/app-config';
import { UserProfileDto } from '../interfaces/user-profileDto.model';
import { UserManagerService } from '@wsv2/account-service';
import { ResetPasswordProfileDto } from '../interfaces/reset-password-profileDto.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, tap, Observable } from 'rxjs';

interface UserProfileState {
  userProfile: UserProfileDto;

  queryUpdate: UserProfileDto | undefined;
  queryDelete: UserProfileDto | undefined;

  state: Status;
}

export interface Message {
  message: string | undefined;
  error: boolean;
}

enum Status {
  empty = 0,
  load = 1,
  modify = 2
}

@Injectable()
export class ProfileService {
  private headers = new HttpHeaders({
    Accept: 'application/json',
    Authorization: 'Bearer ' + this.userManager.AccessToken(),
  });

  private state = signal<UserProfileState>({
    userProfile: <UserProfileDto>{
      address: '',
      email: undefined,
      phone: undefined,
      firstName: '',
      lastName: '',
    },

    queryUpdate: undefined,
    queryDelete: undefined,
    state: Status.empty,
  });
  
  private error_state = signal<Message>({ message: undefined, error: false });

  public UserProfile = computed(() => this.state().userProfile);

  public Message = computed(() => this.error_state());

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
      headers: this.headers,
      withCredentials: true,
    });
  };

  private LoadUser() {
    this.GetUser$()
      .pipe(
        tap((data) => {
          //  this.state.update(() => data);
          this.state.update((state) => ({
            ...state,
            userProfile: data,
            state: Status.load,
          }));
        }),
        takeUntilDestroyed(),
        catchError((err) => {
          console.error(err);
          this.state.update((d) => ({
            ...d,
            queryUpdate: d.userProfile,
            state: Status.modify,
          }));
          this.error_state.update((m) => ({ ...m, error: true }));
          return of(<UserProfileDto>{
            address: '',
            email: undefined,
            phone: undefined,
            firstName: '',
            lastName: '',
          });
        }) //  on any error, just return an empty array
      )
      .subscribe();
  }

  private Update$ = (profileDto: UserProfileDto): Observable<any> => {
    this.url.Controller = 'Profile';
    this.url.Action = 'EditUser';
    this.url.ID = null;

    return this.http.post(this.url.AuthUrl, profileDto, {
      headers: this.headers,
      withCredentials: true,
    });
  };

  public Update = (profileDto: UserProfileDto): void => {
    this.Update$(profileDto).subscribe({
      next: () => {
        this.state.update((state) => ({
          ...state,
          userProfile: profileDto,
          queryDelete:undefined,
          queryUpdate:undefined,
          state: Status.load,
        }));

        this.error_state.update((m) => ({
          ...m,
          error: false,
          message: 'данные успешно сохранены',
        }));
      },
      error: (err: HttpErrorResponse) => {
        //   this._errorMgs=error.error;// error может быть и 400 и 500 -- если err===400 то можно setValidationErrors(this.form, error)

        this.httpError(err);
        this.state.update((state) => ({
          ...state,
          userProfile: profileDto,
          queryDelete:undefined,
          queryUpdate:profileDto,
          state: Status.modify,
        }));
      },
    });
  };

  private ResetPassword$ = (body: ResetPasswordProfileDto) => {
    this.url.Controller = 'Profile';
    this.url.Action = 'ResetPasswordProfile';
    this.url.ID = null;

    return this.http.post(this.url.AuthUrl, body, {
      headers: this.headers,
      withCredentials: true,
    });
  };

  public ResetPassword = (body: ResetPasswordProfileDto) => {
    this.ResetPassword$(body).subscribe({
      next: () => {
        //this.userManager.setInvalidLogin$(true, null);
        this.userManager.SetAccessToken(undefined);
        this.error_state.update((m) => ({
          ...m,
          error: false,
          message: 'данные успешно сохранены',
        }));
      },
      error: (err: HttpErrorResponse) => {
        this.httpError(err);
      },
    });
  };

  public Delete = (id: string): Observable<any> => {
    // id is email-user
    this.url.Controller = 'Profile';
    this.url.Action = 'Delete';
    this.url.ID = null;

    const url = this.url.AuthUrl + '/' + id;
    console.log('url delete profile-' + url);
    return this.http.delete(url, {
      headers: this.headers,
      withCredentials: true,
    });
  };

  private httpError = (err: HttpErrorResponse) => {
    console.error(err);

    if (err.status === 401) {
      this.error_state.update((m) => ({
        ...m,
        error: true,
        message: 'пользователь не авторизован,войдите на сайт',
      }));

      return;
    }
    if (err.status === 400) {
      this.error_state.update((m) => ({
        ...m,
        error: true,
        message: '400 Bad Request',
      }));

      return;
    }
    if (err.status === 404) {

      this.error_state.update((m) => ({ ...m, error: true, message: "404 not Found" }));;
      


      return;
    }
    this.error_state.update((m) => ({
      ...m,
      error: true,
      message:
        'Ошибка соединения с сервером -Сообщиете Администаратору ресурса',
    }));
  };

  public Exit=()=>{
    this.state.update((state) => ({
      ...state,
      userProfile: <UserProfileDto>{
        address: '',
        email: undefined,
        phone: undefined,
        firstName: '',
        lastName: '',
      },
      queryDelete:undefined,
      queryUpdate:undefined,
      state: Status.empty,
    }));

  }
}
