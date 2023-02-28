import { Component, OnInit ,Output, EventEmitter,Input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router  } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserProfileDto } from '../../_shared/_interfaces/user-profileDto.model';
import { UserManagerService } from '@x01-v1/xl01/auth-service';
import { ProfileService } from '../../_shared/services/profile.service';
import {StateView} from '../../_shared/_interfaces/state-view'

@Component({
  selector: 'app-user-profile-delete',
  templateUrl: './user-profile-delete.component.html',
  styleUrls: ['./user-profile-delete.component.scss']
})
export class UserProfileDeleteComponent implements OnInit {

  _errorMgs: string[] = [];

  @Output()
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

  ngOnInit(): void {
  }

  submitForm() {
    this._errorMgs = [];

   

    this.repozitory.Delete(this.User.email).subscribe({
      next: (data) => {
        this.userManager.setInvalidLogin$(true, null);
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
