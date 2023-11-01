import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';

import { ResetPasswordProfileComponent } from '../reset-password-profile/reset-password-profile.component';
import {UserProfileComponent} from '../user-profile/user-profile.component'
import {UserProfileEditComponent} from '../user-profile-edit/user-profile-edit.component'
import {UserProfileDeleteComponent} from '../user-profile-delete/user-profile-delete.component'
import {UserOrderShellComponent} from '@wsv2/user-order'

import { StateView } from '@wsv2/app-common';
import { UserProfileDto } from '../_shared/interfaces/user-profileDto.model';

import { ProfileService } from '../_shared/services/profile.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'wsv2-user-profile-shell',
  standalone: true,
  imports: [
    CommonModule,
     MatTabsModule, 
     MatCardModule,
     ResetPasswordProfileComponent,
     UserProfileComponent,
     UserProfileEditComponent,
     UserProfileDeleteComponent,
     UserOrderShellComponent
    ],
  templateUrl: './user-profile-shell.component.html',
  styleUrls: ['./user-profile-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileShellComponent implements OnInit {
  public _flagViewState: StateView = StateView.default;

  public user: UserProfileDto = <UserProfileDto>{
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    email: '',
  };

  constructor(private profileServece: ProfileService) {}

  ngOnInit(): void {
    /*
    this.profileServece.GetUser().subscribe({
      next: (data: UserProfileDto) => {
        this.user = data;
        console.log("profile ---"+JSON.stringify(data))
      },
      error: (err) => {
       // debugger
        console.error(err);
      },
    });
    */
  }

  public onChangeViewState(event: StateView) {
    this._flagViewState = event;
  }
}
