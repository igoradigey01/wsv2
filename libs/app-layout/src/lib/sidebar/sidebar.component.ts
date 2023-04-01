import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MenuService } from './../shared/services/menu.service';
import { MenuItem } from '../shared/_interfaces/menu-item.model';
import { Subscription } from 'rxjs';
import { UserManagerService } from '@wsv2/account-service';

@Component({
  selector: 'x01-v1-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Output()
  onToggleSideBar = new EventEmitter();

  @Input() public jsonMenuURL: string = '';

  private _invalidLogin: boolean = false;

  private _isOptovik: boolean = false;
  private _userRole: string | null = null;

  private _subscriptions: Subscription[] = [];

  public MenuItems = (): MenuItem[] => {
    let m = this.menuService.getMenuItems();
  //  console.log(m);

    return m;
  };

  constructor(
    private menuService: MenuService,
    private userManager: UserManagerService
  ) {}

  ngOnInit(): void {
    this.menuService.setMenuFromJSON(this.jsonMenuURL);
    let sub1 = this.userManager.InvalidLogin$.subscribe((d) => {
      this._invalidLogin = d;
      this._userRole = this.userManager.RoleUser;

     // console.log('menu conctructor -- userManager.InvalidLogin$--' + d);
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
    if (this._userRole ===this.userManager.ManagerRole && !this._invalidLogin) {
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
    this.onToggleSideBar.emit();
  }

  
}
