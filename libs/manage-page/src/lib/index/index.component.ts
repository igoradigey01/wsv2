import { Component, OnDestroy,signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AppLayoutModule } from '@wsv2/app-layout';
// eslint-disable-next-line @nx/enforce-module-boundaries
//import { AppHeaderLayoutComponent } from '@wsv2/ui'
//import { MaterialModule } from '../material.module'
import {
  //CompanyInformationService,
  MenyItemsService,
  IMenyItem,
} from '@wsv2/app-config';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { IThemeScss, ThemeScssServices } from '@wsv2/app-common';
import { UserRole } from '@wsv2/app-common';


  interface IMeny{
    parent:IMenyItem[];
    child1:IMenyItem[];
    child2:IMenyItem[];
    childmdmeny:IMenyItem[];
  }

@Component({
  selector: 'wsv2-manager-index',
  standalone: true,
  imports: [
    CommonModule,
    AppLayoutModule,
    //  AppHeaderLayoutComponent ,
    RouterModule,
    //  MaterialModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  providers: [ThemeScssServices],
})
export class IndexComponent implements OnDestroy {
  private _theme_css: IThemeScss = <IThemeScss>{
    primary_color: '#a26c00', //primary50
    primary_lighter_color: '#ffddb3', //primary90
    primary_darker_color: '#452b00', //primary20
    accent_color: '#8a7357', //secondary50
    accent_lighter_color: '#fadebc', //secondary90
    accent_darker_color: '#3e2d16', //secondary20
    tertiary_color: '#697d57', //tertiary50
    tertiary_container_color: '#d4eabc', //tertiary90
    on_tertiary_color: '#ffffff',
    on_tertiary_container_color: '#243516',
  };

  private menuItems: IMeny = {parent:[],child1:[],child2:[],childmdmeny:[]};

  public menu=signal(this.menuItems);

  public roleUser: UserRole = UserRole.manager;

  _flagPanel = true;
  // _flagPanel2: boolean = false;
  _flagSideBarHiden = false;

  constructor(
    //  private repositoryCompanyInformation: CompanyInformationService,
    private repositoryMenyItems: MenyItemsService,
    private repositoryThemeCss: ThemeScssServices,
    private router: Router
  ) {
   if( repositoryMenyItems.managerMenyItems){
    const old_meny=repositoryMenyItems.managerMenyItems;
    const parent:IMenyItem[]=[];
    const child_1:IMenyItem[]=[];
    const child_2:IMenyItem[]=[];
    const childmdmeny:IMenyItem[]=[];
    old_meny.map(item=>{
      if(item.meny){
        if(item.meny==1){
        if(item.name==='тип-товара') {
          parent.push({id:11,meny:2,meny_name:"атр",name:"атр",url:""});
          parent.push({id:11,meny:3,meny_name:"товар",name:"товар",url:""});
          const info=old_meny.find(d=>d.name==='info')
          childmdmeny.push(item);
        if(info) childmdmeny.push(info);
        } 
        parent.push(item);
        }
        if(item.meny==2){
          child_1.push(item);
        }
        if(item.meny==3){
          child_2.push(item);
        }
      }

      //this.menuItems.parent=parent;
      this.menu.update((state)=>({...state,parent:parent,child1:child_1,child2:child_2,childmdmeny:childmdmeny}))
    
    
    })
   }

    repositoryThemeCss.initThemeComponent(this._theme_css);
  }

  ngOnDestroy(): void {
    // debugger
    this.repositoryThemeCss.destroyThemeComponent();
  }

  onClickManager(userRole: UserRole) {
    this.router.navigate(['manager']);
  }
  onClickAdmin(userRole: UserRole) {
    this.router.navigate(['admin']);
  }
  onClickGoAppShop(userRole: UserRole) {
    this.router.navigate(['index']);
  }
  onSideBarVisible() {
    this._flagPanel = !this._flagPanel;
    //  this._flagPanel2 = !this._flagPanel2;
    this._flagSideBarHiden = !this._flagSideBarHiden;
  }
}
