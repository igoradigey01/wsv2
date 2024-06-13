import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserManagerService } from '@wsv2/account-service';
import {SocialAuthService} from '@abacritt/angularx-social-login'

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-log-off',
  templateUrl: './log-off.component.html',
  styleUrls: ['./log-off.component.scss'],
})
export class LogOffComponent implements OnInit {
  constructor(
    private router: Router,
    private userMangagerService: UserManagerService,
    private socialAuthService: SocialAuthService
  ) {}

  ngOnInit(): void {
    //debugger
    this.userMangagerService.SetAccessToken(undefined);
    this.socialAuthService.signOut();
    this.router.navigate(['']);
  }
}
