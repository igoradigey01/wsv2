import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  SocialAuthService,
  VKLoginProvider,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, NgForm } from '@angular/forms';
import { UserManagerService } from '@x01-v1/xl01/auth-service';
import { AccountService } from '../_shared/services/account.service';
import { Subscription } from 'rxjs';
import { ExternalAuthSocialDto } from '../_shared/_interfaces/ExternalAuthSocialDto.model';

//https://code-maze.com/angular-security-with-asp-net-core-identity/
//https://account.mail.ru/user/2-step-auth/passwords/
//https://help.mail.ru/mail/security/protection/external
//https://docs.microsoft.com/ru-ru/aspnet/core/security/authentication/accconfirm?view=aspnetcore-6.0&tabs=netcore-cli
// external login goole https://www.positronx.io/angular-google-social-login-tutorial-with-example/
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent implements OnInit, OnDestroy {
  private _subscriptions: Subscription[] = [];

  socialUser!: SocialUser;
  isLoggedin?: boolean;

  _errorMgs: string[] = [];
  _isUserInvalid = false;

  // parser file on load
  public password: string = '';
  public email: string = '';
  public rememberme: boolean = true;
  public returnUrl: string = '/';

  public get ClintGoogleUrl(){
    return this.repozitory.RootClientUrl+'account/auth-callback-vk'
  }

  constructor(
    private repozitory: AccountService,
    private userManager: UserManagerService,
    private route: ActivatedRoute,
    private socialAuthService: SocialAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    let subGoogle =   this.socialAuthService.authState.subscribe((user) => {
      // this.socialUser = user;
      let credentials=<ExternalAuthSocialDto>{provider:user.provider,idToken:user.idToken,idUser:user.id};
    
    if(user.provider=="GOOGLE"){
      let subApiGoogle=    this.repozitory.googleLogin(credentials).subscribe({
        next: (d) => {
          this.userManager.setInvalidLogin$(false, d.access_token);
          //  console.log("login_in-"+d.access_token)
          this.router.navigate([this.returnUrl]);
         
        },
        error: (err: HttpErrorResponse) => {
          let body: string;
          this.userManager.setInvalidLogin$(true, null);
          console.error(err);
          if (err.status === 401) {
            this._errorMgs.push('пользователь не авторизован,войдите на сайт');
            this._errorMgs.push(err.error);
            return;
          }
          if (err.status == 400) {
            this._errorMgs.push(' 400 Bad Request');
            this._errorMgs.push(err.error);
  
            return;
  
            //  body = 'Не верный логин или пароль';
          }
  
          body =
            'Ошибка соединения с сервером -Сообщиете Администаратору Pесурса';
  
          this._errorMgs.push(body);
        },
      });
     this._subscriptions.push(subApiGoogle);
    }
        if(user.provider=="VK"){

          let subApiVK=    this.repozitory.vkLogin(credentials).subscribe({
            next: (d) => {
              this.userManager.setInvalidLogin$(false, d.access_token);
              //  console.log("login_in-"+d.access_token)
              this.router.navigate([this.returnUrl]);
             
            },
            error: (err: HttpErrorResponse) => {
              let body: string;
              this.userManager.setInvalidLogin$(true, null);
              console.error(err);
              if (err.status === 401) {
                this._errorMgs.push('пользователь не авторизован,войдите на сайт');
                this._errorMgs.push(err.error);
                return;
              }
              if (err.status == 400) {
                this._errorMgs.push(' 400 Bad Request');
                this._errorMgs.push(err.error);
      
                return;
      
                //  body = 'Не верный логин или пароль';
              }
      
              body =
                'Ошибка соединения с сервером -Сообщиете Администаратору Pесурса';
      
              this._errorMgs.push(body);
            },
          });
         this._subscriptions.push(subApiVK);

        }
  //  console.log(user)
    });

    let subLogin = this.userManager.InvalidLogin$.subscribe((d) => {
      this._isUserInvalid = d;
      if (!d) {
        this.router.navigate([this.returnUrl]);;
      }
    });
    this._subscriptions.push(subGoogle);
    this._subscriptions.push(subLogin);
  }

  ngOnDestroy() {
    this._subscriptions.forEach((s) => s.unsubscribe());
  }


 
  signInWithVK(): void {
    this.socialAuthService.signIn(VKLoginProvider.PROVIDER_ID);
  }


  submitForm(loginForm: NgForm) {
    this._errorMgs = [];

    const credentials = JSON.stringify(loginForm.value);

    let subLogin2 = this.repozitory.login(credentials).subscribe({
      next: (d) => {
        this.userManager.setInvalidLogin$(false, d.access_token);
        //  console.log("login_in-"+d.access_token)
        this.router.navigate([this.returnUrl]);
       
      },
      error: (err: HttpErrorResponse) => {
        let body: string;
        this.userManager.setInvalidLogin$(true, null);
        console.error(err);
        if (err.status === 401) {
          this._errorMgs.push('пользователь не авторизован,войдите на сайт');
          this._errorMgs.push(err.error);
          return;
        }
        if (err.status == 400) {
          this._errorMgs.push(' 400 Bad Request');
          this._errorMgs.push(err.error);

          return;

          //  body = 'Не верный логин или пароль';
        }

        body =
          'Ошибка соединения с сервером -Сообщиете Администаратору Pесурса';

        this._errorMgs.push(body);
      },
    });
    this._subscriptions.push(subLogin2);
    // this.router.navigate(['/auth/sing-off']);
  }

  onFileInput(event: any) {
    let data = event.target.files[0];

    let fr = new FileReader();
    fr.readAsText(data);
    fr.onload = () => {
      console.log('Input-file cheng ok------' + fr.result);
      let coolVar = fr.result as string;

      var partsArray = coolVar.split(';');
      this.email = partsArray[0].trim();
      this.password = partsArray[1].trim();

      /*  console.log(this._log+"----log----");
      console.log(this._pass+"---pas--"); */
    };
    fr.onerror = function () {
      console.log(fr.error);
    };
  }

  private validateExternalAuth(externalAuth: ExternalAuthSocialDto) {
    this.repozitory.googleLogin( externalAuth)
      .subscribe({
        next: (d:any) => {
           // localStorage.setItem("token", d.token);
            this.userManager.setInvalidLogin$(false, d.access_token);

           // this.repozitory.sendAuthStateChangeNotification(d.isAuthSuccessful);
            this.router.navigate([this.returnUrl]);
      },
        error: (err: HttpErrorResponse) => {
          this._errorMgs.push( err.message);
         
          this.socialAuthService.signOut();
        }
      });
  }
}
