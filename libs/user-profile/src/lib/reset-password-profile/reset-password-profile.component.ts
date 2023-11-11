import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,  
  EffectRef,
  effect,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

import { StateView } from '@wsv2/app-common';

import { ProfileService } from '../_shared/services/profile.service';
import { ResetPasswordProfileDto } from '../_shared/interfaces/reset-password-profileDto.model';
import { UserManagerService } from '@wsv2/account-service';

import { RouterModule } from '@angular/router';
import { MatchPasswordDirective } from '../_shared/_helpers/must-match.directive';

@Component({
  selector: 'wsv2-reset-password-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    RouterModule,
    MatchPasswordDirective,
    MatButtonModule,
  ],
  templateUrl: './reset-password-profile.component.html',
  styleUrls: ['./reset-password-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordProfileComponent implements OnInit {
  public resetPassDto: ResetPasswordProfileDto = <ResetPasswordProfileDto>{
    confirmPassword: '',
    newPassword: '',
    oldPassword: '',
    email: '',
    phone: '',
  };

  public showSuccess = signal( false);
  private flag=false;

  _errorMgs: string[] = [];

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  onToggleViewState: EventEmitter<StateView> = new EventEmitter();

  efRef: EffectRef = effect(
    () => {
      console.log('resetPassword--' + this.repozitory.Message().error);
      if (!this.repozitory.Message().error&& this.flag===true) {
        this.showSuccess.set( true);
      }
    },
    { allowSignalWrites: true }
  );

  constructor(
    private repozitory: ProfileService,
    private userManager: UserManagerService
  ) {}

  ngOnInit(): void {
    this.resetPassDto.email = this.repozitory.UserProfile().email;
    this.resetPassDto.phone = this.repozitory.UserProfile().phone;
  }

  public submitForm = () => {
    this._errorMgs = [];
       this.flag=true;
    this.repozitory.ResetPassword(this.resetPassDto);
  };

  public onBack() {
    this.onToggleViewState.next(StateView.default);
  }
}
