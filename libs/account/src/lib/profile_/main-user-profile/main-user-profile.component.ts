import { Component, OnInit } from '@angular/core';
import { StateView } from '../../_shared/_interfaces/state-view';
import { UserProfileDto } from '../../_shared/_interfaces/user-profileDto.model';
import { UserManagerService } from '@x01-v1/xl01/auth-service';
import { ProfileService } from '../../_shared/services/profile.service';

@Component({
  selector: 'x01-v1-main-user-profile',
  templateUrl: './main-user-profile.component.html',
  styleUrls: ['./main-user-profile.component.scss'],
})
export class MainUserProfileComponent implements OnInit {
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
    this.profileServece.GetUser().subscribe({
      next: (data: UserProfileDto) => {
        this.user = data;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  public onChangeViewState(event: StateView) {
    this._flagViewState = event;
  }
}
