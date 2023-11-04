import { Component,Output, EventEmitter,Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

import { HttpErrorResponse } from '@angular/common/http';
import { Router  } from '@angular/router';

import { UserProfileDto } from '../_shared/interfaces/user-profileDto.model';
import { UserManagerService } from '@wsv2/account-service';
import { ProfileService } from '../_shared/services/profile.service';
import {StateView} from '@wsv2/app-common'

@Component({
  selector: 'wsv2-user-profile-delete',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    FormsModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './user-profile-delete.component.html',
  styleUrls: ['./user-profile-delete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileDeleteComponent  {

  _errorMgs: string[] = [];

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  onToggleViewState:EventEmitter<StateView> = new EventEmitter()

  @Input() public User: UserProfileDto = <UserProfileDto>{
    firstName:'',
    lastName:'',
    phone: '',
    address: '',
    email: ''
   
  };
  constructor(
    private repozitory: ProfileService,   
    private userManager: UserManagerService,
    private router: Router
  ) { }


  submitForm() {
    this._errorMgs = [];

   if(this.User.email)
  
    this.repozitory.Delete(this.User.email).subscribe({
      next: () => {
      //  this.userManager.setInvalidLogin$(true, null);
      this.userManager.SetAccessToken( undefined);
        this.router.navigateByUrl('');
      },
      error: (err: HttpErrorResponse) => {
        //   this._errorMgs=error.error;// error может быть и 400 и 500 -- если err===400 то можно setValidationErrors(this.form, error)
        console.error(err);
        if (err.status === 401) {
          this._errorMgs.push('отказ в доступе');
          return;
        }
        if (err.status == 400) {
          this._errorMgs.push(' 400 Bad Request');
          this._errorMgs.push(err.error);
          return;
        }

        this._errorMgs.push(
          'Ошибка соединения с сервером -Сообщиете Администаратору ресурса'
        );
        this._errorMgs.push(err.error);
      },
    });
  }

  public onBack(){

    this.onToggleViewState.next(StateView.default);

  }
}
