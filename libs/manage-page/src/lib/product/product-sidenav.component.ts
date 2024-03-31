import { Component, Signal, signal, computed } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { SubKatalog, Katalog } from '@wsv2/app-common';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { EmitData } from './product-shell.component';

@Component({
  selector: 'wsv2-product-sidenav',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MatButtonModule],
  templateUrl: './product-sidenav.component.html',
  styleUrls: ['./product-sidenav.component.scss'],
})
export class ProductSidenavComponent {
  @Output() public SubCatalogChange = new EventEmitter<EmitData>();

  private stateCatalogs: Signal<Katalog[]> = signal<Katalog[]>([]);
  private stateSubCatalogs: Signal<SubKatalog[]> = signal<SubKatalog[]>([]);

  private emitData = <EmitData>{};

  public idCatalogActive = 0;

  // public readonly subCatalogsSelect = computed(() =>
  //   this.stateSubCatalogs().filter((f) => f.catalogId === this.idCatalogActive)
  // );

  @Input({ required: true }) set Catalogs(items: Signal<Katalog[]>) {
    this.stateCatalogs = items;
  }

  @Input({ required: true }) set SubCatalogs(items: Signal<SubKatalog[]>) {
    this.stateSubCatalogs = items;
    //console.log( "Input product-sidebar"+  JSON.stringify(items))
  }

  @Input({ required: true }) set EmitData(item: EmitData) {
    this.emitData = item;
  }

  public catalogs = computed(() => {
    return this.stateCatalogs();
  });
  public subCatalogs = computed(() => {
    return this.stateSubCatalogs();
  });

  changeCagalog(item: number) {
    this.idCatalogActive = item;
   // console.log(JSON.stringify(this.subCatalogsSelect))
  }
  changeSubCagalog(item:number){
    this.emitData.catalogId=this.idCatalogActive;
    this.emitData.subCatalogId=item;
    this.SubCatalogChange.emit(this.emitData);

  }
}
