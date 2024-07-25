import { CommonModule } from "@angular/common";
import { Component, Output, EventEmitter, Signal, signal, Input, computed } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";

import { MatSidenavModule } from "@angular/material/sidenav";
import { Katalog, SubKatalog } from "@wsv2/app-common";
import { EmitData} from "./product-shell.component";


@Component({
  selector: 'wsv2-product-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
   
  ],
  templateUrl: './product-sidenav.component.html',
  styleUrls: ['./product-sidenav.component.scss'],
})
export class ProductSidenavComponent {
  @Output() public SubCatalogChange = new EventEmitter<EmitData>();

  private stateCatalogs: Signal<Katalog[]> = signal<Katalog[]>([]);
  private stateSubCatalogs: Signal<SubKatalog[]> = signal<SubKatalog[]>([]);

  private emitData = <EmitData>{};

  //private idCatalogActive = 0;
  private stateIdCatalogActive = signal(0);

  // public readonly subCatalogsSelect = computed(() =>
  //   this.stateSubCatalogs().filter((f) => f.catalogId === this.idCatalogActive)
  // );
  @Input({ required: true }) set Catalogs(items: Signal<Katalog[]>) {
    this.stateCatalogs = items;
  }

  @Input({ required: true }) set SubCatalogs(items: Signal<SubKatalog[]>) {
    this.stateSubCatalogs = items;
    console.log('Input product-sidebar -SubCatalogs' + JSON.stringify(items));
  }

  @Input({ required: true }) set EmitData(item: EmitData) {
    this.emitData = item;
  }



  public catalogs = computed(() => {
    return this.stateCatalogs();
  });

  public subCatalogs = computed(() => {
    const i = this.stateSubCatalogs().filter(
      (s) => s.catalogId == this.stateIdCatalogActive()
    );
    console.log('computed -SubCatalogs' + JSON.stringify(i));
    return i;
  });

  changeCatalog(item: number) {
    //this.idCatalogActive = item;
    this.stateIdCatalogActive.set(item);
    console.log('change catalog id' + item);
  }
  changeSubCagalog(item: number) {
    this.emitData.catalogId = this.stateIdCatalogActive();
    this.emitData.subCatalogId = item;
    this.SubCatalogChange.emit(this.emitData);
  }

}
