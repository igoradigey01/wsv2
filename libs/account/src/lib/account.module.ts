import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
//import { accountRoutes } from './lib.routes';
import { HttpClientModule , HttpClientJsonpModule} from '@angular/common/http';
import {MaterialModule} from './material.module'
import {AccountServiceModule } from '@wsv2/account-service';

import { SignInComponent } from './sign-in/sign-in.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LogOffComponent } from './log-off/log-off.component';
import { UserProfileComponent } from './profile_/user-profile/user-profile.component';

import { ManagerServiceModule } from './_shared/services/maneger-service.module';
import { UserProfileEditComponent } from './profile_/user-profile-edit/user-profile-edit.component';
import { UserProfileDeleteComponent } from './profile_/user-profile-delete/user-profile-delete.component';
import { EmailConfirmationComponent } from './email-confirmation/email-confirmation.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordFromMailComponent } from './reset-password_/reset-password-from-mail/reset-password-from-mail.component';
import {ResetPasswordProfileComponent} from './reset-password_/reset-password-profile/reset-password-profile.component'

import { MatchPasswordDirective } from './_shared/_helpers/must-match.directive';
import {MainUserProfileComponent} from './profile_/main-user-profile/main-user-profile.component'
import {UserOrdersMainComponent} from './user-orders_/user-orders-main/user-orders-main.component'
import {UserOrdersTableComponent} from './user-orders_/user-orders-table/user-orders-table.component'
import {UserOrdersItemComponent} from './user-orders_/user-orders-item/user-orders-item.component'
import {TelegramLoginWidgetComponent} from './telegram-login-widget/telegram-login-widget.component'
import {AuthCallbackTelegramComponent} from './auth-callback-telegram/auth-callback-telegram.component'
import {AuthCallbackVkComponent} from './auth-callback-vk/auth-callback-vk.component'
import {accountRoutes} from './lib.routes'


import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { 
  GoogleLoginProvider ,
  VKLoginProvider

} from '@abacritt/angularx-social-login';





@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(accountRoutes),
    CommonModule,   
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    MaterialModule,
    ManagerServiceModule,    
    AccountServiceModule,
    SocialLoginModule
  ],  
  declarations: [
    SignInComponent,
    SignUpComponent,
    LogOffComponent,
    UserProfileComponent,
    UserProfileEditComponent,
    UserProfileDeleteComponent,
    EmailConfirmationComponent,
    ForgotPasswordComponent,
    ResetPasswordFromMailComponent,
    ResetPasswordProfileComponent,
    MatchPasswordDirective,
    MainUserProfileComponent,
    UserOrdersMainComponent,
    UserOrdersTableComponent,
    UserOrdersItemComponent,
    TelegramLoginWidgetComponent,
    AuthCallbackTelegramComponent,
    AuthCallbackVkComponent,
   
    
    
  ],
  exports: [
    SignInComponent,
    SignUpComponent,
    LogOffComponent,
    UserProfileComponent,
    UserProfileEditComponent,
    UserProfileDeleteComponent,
    EmailConfirmationComponent,
    ForgotPasswordComponent,
    ResetPasswordFromMailComponent,
    ResetPasswordProfileComponent
    
  ],
  providers:[
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('344759916833-h3r1fju9hj53jd86d142tn44vta9vnsa.apps.googleusercontent.com'),
          },
          {
            id: VKLoginProvider.PROVIDER_ID,
            provider: new VKLoginProvider('51431968'),
          },
        ],
      } as SocialAuthServiceConfig,
    },
   
  ]
})
export class AccountModule {}
