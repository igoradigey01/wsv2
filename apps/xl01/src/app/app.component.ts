import { NxWelcomeComponent } from './nx-welcome.component';
import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { APP_CONFIG } from "@wsv2/environment-url";
import { environment } from './environments/environment';
import {AccountModule} from '@wsv2/account'

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule],
  selector: 'wsv2-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    { provide: APP_CONFIG, useValue: environment}
  ]
})
export class AppComponent {
  title = 'xl01';
}
