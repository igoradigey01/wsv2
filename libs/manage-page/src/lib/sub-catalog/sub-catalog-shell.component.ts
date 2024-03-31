import { Component, computed} from '@angular/core';
import { CommonModule } from '@angular/common';
//import { StateView } from '@wsv2/app-common';
import { SubKatalog, Katalog, IButton } from '@wsv2/app-common';
import { KatlogService, SubKatalogService } from '@wsv2/shop-content';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { KatalogComponent } from '@wsv2/ui';
import { SubCatalogItemComponent } from './sub-catalog-item.component';
import { SubCatalogListComponent } from './sub-catalog-list.component';

export enum StateView {
  default = 0, // catalogVeiw
  // catalogVeiw=1,
  subCatalogView = 2,
  itemView = 3,
  edit = 4,
  create = 5,
  wait = 6, // ожидание
  delete = 7,
  exit = 8,
}

export interface EmitData {
  catalog: Katalog;
  subCatalog: SubKatalog;
  stateView: StateView;
}

@Component({
  selector: 'wsv2-sub-catalog-shell',
  standalone: true,
  imports: [
    CommonModule,
    SubCatalogItemComponent,
    SubCatalogListComponent,
    KatalogComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './sub-catalog-shell.component.html',
  styleUrls: ['./sub-catalog-shell.component.scss'],
})
export class SubCatalogShellComponent {
  private idCatalogAktive=-1;
  //private state_Catalog=signal(this.idCatalogAktive); 
  public flag = StateView.default;

  public catalogs = this.repositoryCatalog.Katalogs;

  public subCatalogs = computed(() => this.repositorySubCatalog.SubCatalogs().filter(s=>s.catalogId===this.idCatalogAktive));

  public message = this.repositorySubCatalog.Message;

  public item = <SubKatalog>{
    id: 0,
    name: 'none',
    ownerId: 'none',
    catalogId: 0,
    GoogleTypeId: '',
    decriptSeo: '',
    hidden: false,
  };
  public parent = <Katalog>{
    id: 0,
    name: 'none',
    ownerId: 'none',
    hidden: true,
    decriptSeo: '',
  };

  constructor(
    private repositoryCatalog: KatlogService,
    private repositorySubCatalog: SubKatalogService
  ) {
    repositorySubCatalog.ClearMessage();
  }

  public onCatalogChange(event: IButton) {
    //debugger

  //  this.repositorySubCatalog.SubCatalogs              //SubKatalogsSet(event.id!);
  this.idCatalogAktive= event.id!;

    this.parent = this.catalogs().find((c) => c.id == event.id) as Katalog ;

    // console.log( "catalogs ---"+ JSON.stringify( this.catalogs()));
    // console.log( "this.parent ---"+ JSON.stringify( this.parent));

    this.flag = StateView.subCatalogView;
  }

  public onSubCatalogChange(event: EmitData) {
    this.item = event.subCatalog;
    this.flag = event.stateView;
  }

  public catalogModified(event: EmitData) {
    // debugger
    if (event.stateView === StateView.create) {
      //  debugger

      this.repositorySubCatalog.Create(event.subCatalog);
      this.flag = StateView.default;
    }
    if (event.stateView === StateView.edit) {
      this.repositorySubCatalog.Update(event.subCatalog);
      this.flag = StateView.default;
    }
    if (event.stateView === StateView.exit) {
      this.flag = StateView.default;
    }
    if (event.stateView === StateView.delete) {
      this.repositorySubCatalog.Delete(event.subCatalog);
      this.flag = StateView.default;
    }
  }

  public backToCatalog() {
    this.flag = StateView.default;
  }
}
