import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule} from '@angular/router';
//import { accountRoutes } from './lib.routes';
import { provideHttpClient, withInterceptorsFromDi, withJsonpSupport } from '@angular/common/http';
import {MaterialModule} from './material.module'
import {AccountServiceModule } from '@wsv2/account-service';


import { SignInComponent } from './sign-in/sign-in.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LogOffComponent } from './log-off/log-off.component';


import { ManagerServiceModule } from './_shared/services/maneger-service.module';

import { EmailConfirmationComponent } from './email-confirmation/email-confirmation.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordFromMailComponent } from './reset-password_/reset-password-from-mail/reset-password-from-mail.component';


import { MatchPasswordDirective } from './_shared/_helpers/must-match.directive';

import {UserOrdersMainComponent} from './user-orders_/user-orders-main/user-orders-main.component'
import {UserOrdersTableComponent} from './user-orders_/user-orders-table/user-orders-table.component'
import {UserOrdersItemComponent} from './user-orders_/user-orders-item/user-orders-item.component'
import {TelegramLoginWidgetComponent} from './telegram-login-widget/telegram-login-widget.component'
import {AuthCallbackTelegramComponent} from './auth-callback-telegram/auth-callback-telegram.component'
import {AuthCallbackVkComponent} from './auth-callback-vk/auth-callback-vk.component'
import {VkLoginWidgetComponent} from './vk-login-widget/vk-login-widget.component'

import {accountRoutes} from './lib.routes'


import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { 
  GoogleLoginProvider 

} from '@abacritt/angularx-social-login';



const vkLoginOptions = {
 // scope: 'offline', // Profile fields to return, see: https://vk.com/dev/objects/user
  version: '5.131', // https://vk.com/dev/versions
}; // https://vk.com/dev/users.get


@NgModule({ declarations: [
        SignInComponent,
        SignUpComponent,
        LogOffComponent,
        EmailConfirmationComponent,
        ForgotPasswordComponent,
        ResetPasswordFromMailComponent,
        MatchPasswordDirective,
        UserOrdersMainComponent,
        UserOrdersTableComponent,
        UserOrdersItemComponent,
        TelegramLoginWidgetComponent,
        AuthCallbackTelegramComponent,
        AuthCallbackVkComponent,
        VkLoginWidgetComponent,
    ],
    exports: [
        SignInComponent,
        SignUpComponent,
        LogOffComponent,
        EmailConfirmationComponent,
        ForgotPasswordComponent,
        ResetPasswordFromMailComponent,
    ], imports: [CommonModule,
        RouterModule.forChild(accountRoutes),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        ManagerServiceModule,
        AccountServiceModule,
        SocialLoginModule], providers: [
        {
            provide: 'SocialAuthServiceConfig',
            useValue: {
                autoLogin: false,
                providers: [
                    {
                        id: GoogleLoginProvider.PROVIDER_ID,
                        provider: new GoogleLoginProvider('344759916833-h3r1fju9hj53jd86d142tn44vta9vnsa.apps.googleusercontent.com'),
                    },
                    //   {  not work in hosh !!! (server validete not !!!)02.04.23
                    //     id: VKLoginProvider.PROVIDER_ID,
                    //  // provider: new VKLoginProvider('51431968'),
                    //  // global var create in appComponets
                    //  provider: new VKLoginProvider((<any>window).vkId,vkLoginOptions),
                    //   },
                ],
            } as SocialAuthServiceConfig,
        },
        provideHttpClient(withInterceptorsFromDi(), withJsonpSupport()),
    ] })
export class AccountModule {

  

}
