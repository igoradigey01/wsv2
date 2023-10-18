import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

// eslint-disable-next-line @nx/enforce-module-boundaries
import {IMenyItem} from '@wsv2/app-config'

import { Subscription } from 'rxjs';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { UserManagerService } from '@wsv2/account-service';
import {UserRole} from '@wsv2/app-common'

@Component({
  selector: 'wsv2-x01-v1-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Output()
  _onToggleSideBar = new EventEmitter();

  @Input() public menuItems:IMenyItem[]=[];

  private _invalidLogin = false;

  private _isOptovik = false;
 // private _userRole: UserRole;
  private _subscriptions: Subscription[] = [];

  public MenuItems = (): IMenyItem[] => {
    const m = this.menuItems;
  //  console.log(m);

    return m;
  };

  constructor(
  
    private userManager: UserManagerService
  ) {}

  // ngOnInit(): void { 16.10.23
  //   //this.repozitory.setMenuFromJSON(this.jsonMenuURL);
  //   // const sub1 = this.userManager.InvalidLogin$.subscribe((d) => {
  //   //   this._invalidLogin = d;
  //   //   this._userRole = this.userManager.RoleUser;

  //   //  // console.log('menu conctructor -- userManager.InvalidLogin$--' + d);
  //   // });

   
  //   this._subscriptions.push(sub1);
   
  // }

  ngOnDestroy() {
    this._subscriptions.forEach((s) => s.unsubscribe());
  }

  public get IsAdmin(): boolean {
    //  return true;
    if (UserRole.admin === this.userManager.Role() ) {
      return true;
    }
    return false;
  }
  public get IsManager(): boolean {   


    // return true;
    if (UserRole.manager ===this.userManager.Role()) {
      return true;
    }
    return false;
  }
  public get IsShopper(): boolean {
    // return true;
    if (UserRole.shoper === this.userManager.Role()) {
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
    this._onToggleSideBar.emit();
  }

  
}
