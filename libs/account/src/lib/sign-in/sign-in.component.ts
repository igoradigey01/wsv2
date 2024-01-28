import {
  Component,
  OnInit,
  OnDestroy,
  //ChangeDetectionStrategy,
  signal,
  computed,
  //effect,EffectRef
} from '@angular/core';
import {
  SocialAuthService,

} from '@abacritt/angularx-social-login';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { UserManagerService } from '@wsv2/account-service';
import { AccountService } from '../_shared/services/account.service';

import { Subscription } from 'rxjs';
import { ExternalAuthSocialDto } from '../_shared/_interfaces/ExternalAuthSocialDto.model';

import { VkLoginWidgetService } from '../_shared/services/vk-login-widger.service';
import {Message} from '@wsv2/app-common'

//https://code-maze.com/angular-security-with-asp-net-core-identity/
//https://account.mail.ru/user/2-step-auth/passwords/
//https://help.mail.ru/mail/security/protection/external
//https://docs.microsoft.com/ru-ru/aspnet/core/security/authentication/accconfirm?view=aspnetcore-6.0&tabs=netcore-cli
// external login goole https://www.positronx.io/angular-google-social-login-tutorial-with-example/
//
//https://github.com/abacritt/angularx-social-login




@Component({
  selector: '@wsv2-app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  providers: [],
 // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent implements OnInit, OnDestroy {
  private _subscriptions: Subscription[] = [];

 

  private error_state = signal<Message>({ message: "", error: false });
  //_isUserInvalid = false;
  public Massages=computed(() => this.error_state());
  
  public login = '';
  public password = '';
 
  public rememberme = true;
  public returnUrl = '/';
  //http://jsonip.com/
  public ipAddress = '';
  public nameClient: string;

  public get ClintGoogleUrl() {
    return this.repozitory.ClientUri + 'account/auth-callback-vk';
  }

 /*   efRef:EffectRef=effect(
    ()=>{
    
       console.log("effect -------------"+this.Massages().message +"error-"+this.Massages().error)
    },
    { allowSignalWrites: true }
  )
 */
  constructor(
    private repozitory: AccountService,
    private userManager: UserManagerService,
    private route: ActivatedRoute,
    private socialAuthService: SocialAuthService,
    private repozitoryVK: VkLoginWidgetService,
    private router: Router
  ) {
    this.nameClient = repozitory.ClientId;
    // console.log("VkId"+repozitory.VkId)
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    const subGoogle = this.socialAuthService.authState.subscribe((user) => {
      // this.socialUser = user;
      const credentialsGoogle = <ExternalAuthSocialDto>{
        provider: user.provider,
        idToken: user.idToken,
        idUser: user.id,
        idSpa:this.repozitory.ClientId
      };

      if (user.provider == 'GOOGLE') {
       // debugger
        console.log(JSON.stringify(credentialsGoogle));
        const subApiGoogle = this.repozitory
          .googleLogin(credentialsGoogle)
          .subscribe({
            next: (d) => {
            // this.userManager.setInvalidLogin$(false, d.access_token);
            this.userManager.SetAccessToken(d.access_token)
            
               // console.log("login_in-"+d.access_token)
              this.router.navigate([this.returnUrl]);
            },
            error: (err: HttpErrorResponse) => {
              this.httpError(err);
            },
          });
        this._subscriptions.push(subApiGoogle);
      }
      if (user.provider == 'VK') {
        // https://vk.com/dev/widget_auth (!!!)
        //https://dev.vk.com/api/open-api/getting-started
        const credentialsVK = <ExternalAuthSocialDto>{
          provider: user.provider,
          idToken: user.authToken,
          idUser: user.id,
          idSpa:this.repozitory.ClientId
        };
       

        const subApiVK = this.repozitory.vkLogin(credentialsVK).subscribe({
          next: (d) => {
          
           this.userManager.SetAccessToken(d.access_token)
            
            this.router.navigate([this.returnUrl]);
          },
          error: (err: HttpErrorResponse) => {
            this.httpError(err);
          },
        });
        this._subscriptions.push(subApiVK);
      }
      //  console.log(user)
    });

    

    
    this._subscriptions.push(subGoogle);
   // this._subscriptions.push(subLogin);
  }

  ngOnDestroy() {
    this._subscriptions.forEach((s) => s.unsubscribe());
  }

  signInWithVK(): void {
    /* // три способа афторизации VK
    //socialAuthServic.signIn(VKLoginProvider.PROVIDER_ID) https://api.vk.com/method/users.get
    //https://dev.vk.com/widgets/auth
    //https://dev.vk.com/vk-sdk/vkid/auth/main#По%20кнопке%20One%20Tap%20Sign%20In
    //debugger
    // this.socialAuthService.signIn(VKLoginProvider.PROVIDER_ID); */
    this.repozitoryVK.loadWidgetScript();
  }

  submitForm() {
    // this.error_state.update((m) => ({
    //   ...m,
    //   error: false,
    //   message: undefined,
    // }));

    let credentials: string; //= JSON.stringify(loginForm.value);

    if (this.login.indexOf('@') != -1) {
      credentials = `{
        "email":"${this.login}",
        "phone": "",
        "password":"${this.password}",
        "spaId":"${this.repozitory.ClientId}",
        "remembermy":"${this.rememberme}"
      }`;
    }
    else{

      credentials = `{
        "email":"",
        "phone": "${this.login}",
        "password":"${this.password}",
        "spaId":"${this.repozitory.ClientId}",
        "remembermy":"${this.rememberme}"
      }`;

    }

    const subLogin2 = this.repozitory.login(credentials).subscribe({
      next: (d) => {
        
         this.userManager.SetAccessToken(d.access_token)
       
        this.router.navigate([this.returnUrl]);
      },
      error: (err: HttpErrorResponse) => {
        this.httpError(err);
      },
    });
    this._subscriptions.push(subLogin2);
    // this.router.navigate(['/auth/sing-off']);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFileInput(event: any) {
    const data = event.target.files[0];

    const fr = new FileReader();
    fr.readAsText(data);
    fr.onload = () => {
      //console.log('Input-file cheng ok------' + fr.result);
      const coolVar = fr.result as string;

      const partsArray = coolVar.split(';');
      this.login = partsArray[0].trim();
      this.password = partsArray[1].trim();

      /*  console.log(this._log+"----log----");
      console.log(this._pass+"---pas--"); */
    };
    fr.onerror = function () {
      console.log(fr.error);
    };
  }

  private httpError = (err: HttpErrorResponse) => {
    console.error(err);
// debugger
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
    console.log("this.error_state.massage"+this.error_state().message)
  };
}
