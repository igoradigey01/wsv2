import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { IMenyItem } from '@wsv2/app-config';

import { UserManagerService } from '@wsv2/account-service';
import {} from '@wsv2/app-common';

// ChangeDetectionStrategy https://habr.com/ru/company/infopulse/blog/358860/
// logi_form https://github.com/VladiRR/svvs/blob/master/libs/frontend/client/ui/login-form/src/lib/login-form-ui/login-form-ui.component.ts
//sample https://code-maze.com/angular-material-navigation/

@Component({
  selector: 'x01-v1-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit,OnDestroy {
  private _invalidLogin: boolean = true;
  private _isOptovik: boolean = false;
  private _userRole: string | null = null;

  private _subscriptions: Subscription[] = [];
  // private subscription: Subscription|undefined ;
  @Input() public is_shop:boolean=true;
  @Input() public company_name_1: string | undefined;
  @Input() public company_name_2: string | undefined;; //First Site
  @Input() public srcLogo: string = '';
  @Input() public company_phone: string = '';
  @Input() public company_normalize_phone: string = '';
  @Input() public menuItems: IMenyItem[] = [];
  @Output()
  onToggleSideBar = new EventEmitter();

  public MenuItems = (): IMenyItem[] => {
    return this.menuItems;
  };

  constructor(
    // private repozitory:CompanyInformationService,
    private userManager: UserManagerService
  ) {}

  ngOnInit(): void {
    //this.repozitory.setMenuFromJSON(this.jsonMenuURL);
    let sub1 = this.userManager.InvalidLogin$.subscribe((d) => {
      this._invalidLogin = d;
      this._userRole = this.userManager.RoleUser;

      console.log('menu conctructor -- userManager.InvalidLogin$--' + d);
    });

    let sub2 = this.userManager.InvalidOptShopper$.subscribe((d) => {
      this._isOptovik = d;
    });
    this._subscriptions.push(sub1);
    this._subscriptions.push(sub2);
  }

  ngOnDestroy() {
    this._subscriptions.forEach((s) => s.unsubscribe());
  }

  public get IsAdmin(): boolean {
    //  return true;
    if (this._userRole === this.userManager.AdmiRole && !this._invalidLogin) {
      return true;
    }
    return false;
  }
  public get IsManager(): boolean {
    // return true;
    if (
      this._userRole === this.userManager.ManagerRole &&
      !this._invalidLogin
    ) {
      return true;
    }
    return false;
  }
  public get IsShopper(): boolean {
    // return true;
    if (this._userRole === this.userManager.ShoperRole && !this._invalidLogin) {
      return true;
    }
    return false;
  }
  public get IsShopperOpt(): boolean {
    return this._isOptovik;
  }

  public get InvalidLogin(): boolean {
    return this._invalidLogin;
  }
  public onSideBarVisible(): void {
    //  this.login.emit(this.loginForm.value)
    this.onToggleSideBar.emit();
  }
}
