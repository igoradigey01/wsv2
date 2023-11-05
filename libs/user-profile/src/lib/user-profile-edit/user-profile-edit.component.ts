import { Component,  Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';


import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

import { UserProfileDto } from '../_shared/interfaces/user-profileDto.model';
import { UserManagerService } from '@wsv2/account-service';
import { ProfileService } from '../_shared/services/profile.service';
import { StateView } from '@wsv2/app-common';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'wsv2-user-profile-edit',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    FormsModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './user-profile-edit.component.html',
  styleUrls: ['./user-profile-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileEditComponent  {
  
 public errMessage=this.profileServece.Message
 public flag=true;

  @Input() public User: UserProfileDto = <UserProfileDto>{
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    email: '',
  };

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  onToggleViewState: EventEmitter<StateView> = new EventEmitter();
  

  constructor(
    private userManagerService: UserManagerService,
    private router: Router,
    private profileServece: ProfileService
  ) {
    
  }



  submitForm() {
    
   //const profileDto = JSON.stringify(registerForm.value);
    // console.log("profile-edit:"+profileDto)
    this.profileServece.Update(this.User);
    this.flag=false;
  
  
   
  }

  public onBack(){

    this.onToggleViewState.next(StateView.default);

  }
}
