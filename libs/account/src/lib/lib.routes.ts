
import { Route } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LogOffComponent } from './log-off/log-off.component';
import { EmailConfirmationComponent } from './email-confirmation/email-confirmation.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordFromMailComponent } from './reset-password_/reset-password-from-mail/reset-password-from-mail.component';


import { AuthCallbackTelegramComponent } from './auth-callback-telegram/auth-callback-telegram.component'
import { AuthCallbackVkComponent } from './auth-callback-vk/auth-callback-vk.component'




export const accountRoutes: Route[] = [
    { path: '', component: SignInComponent },
    { path: 'sing-up', component: SignUpComponent },
    { path: 'sing-off', component: LogOffComponent },
    { path: 'email-confirmation', component: EmailConfirmationComponent },
    { path: 'reset-password', component: ResetPasswordFromMailComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'auth-callback-vk', component: AuthCallbackVkComponent },
  
    { path: 'auth-callback-telegram', component: AuthCallbackTelegramComponent }
];
