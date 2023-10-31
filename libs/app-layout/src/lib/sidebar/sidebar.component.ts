import { Component, Output, EventEmitter, Input ,signal} from '@angular/core';

// eslint-disable-next-line @nx/enforce-module-boundaries
import {IMenyItem} from '@wsv2/app-config'

import { Subscription } from 'rxjs';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { UserManagerService } from '@wsv2/account-service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {UserRole} from '@wsv2/app-common'

@Component({
  selector: 'wsv2-x01-v1-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {

  private _userRole: UserRole = UserRole.default;

  public stateRole=signal(this._userRole);

  @Output()
  _onToggleSideBar = new EventEmitter();

  @Input() public menuItems:IMenyItem[]=[];

  @Input() public set UserRole(role: UserRole) {
    

    console.log("user-role sidebar--"+role)

    this.stateRole.update(() => (role));
    

  }

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

 
  ngOnDestroy() {
    this._subscriptions.forEach((s) => s.unsubscribe());
  }

/*  

  public get IsAdmin(): boolean {
    if (this.stateRole() === UserRole.admin) {
      return true;
    }
    return false;
  }
  public get IsManager(): boolean {
    // return true;
    if (
      this.stateRole() === UserRole.manager) {
      return true;
    }
    return false;
  }
  public get IsShopper(): boolean {

    if (this.stateRole() === UserRole.shoper || this.stateRole() == UserRole.shoperOpt) {
      return true;
    }
    return false;
  }
  public get IsOpt(): boolean {

    if (this.stateRole() === UserRole.shoperOpt || this.stateRole() == UserRole.opt) {
      return true;
    }
    return false;
  }
  */
  public get InvalidLogin(): boolean {
    if(this.stateRole()===UserRole.default ||this.stateRole()===UserRole.opt) return true
    return false;
  }

  public onSideBarVisible(): void {
    this._onToggleSideBar.emit();
  }

  
}
