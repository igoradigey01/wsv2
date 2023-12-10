import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

import { FormsModule } from '@angular/forms';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { SubKatalog, Katalog } from '@wsv2/app-common';
import { EmitData, StateView } from './sub-catalog-shell.component';
import { Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'wsv2-sub-catalog-item',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,

    FormsModule,
  ],
  templateUrl: './sub-catalog-item.component.html',
  styleUrls: ['./sub-catalog-item.component.scss'],
})
export class SubCatalogItemComponent {
  private catalog = <Katalog>{
    id: 0,
    hidden: false,
    decriptSeo: '',
    name: 'none',
    ownerId: 'none',
  };

  private state = signal<SubKatalog>(<SubKatalog>{
    id: 0,
    catalogId: 0,
    GoogleTypeId: '',
    hidden: false,

    decriptSeo: '',
    name: 'none',
    ownerId: 'none',
  });
  private _falg = StateView.edit;

  @Output() public catalogModified = new EventEmitter<EmitData>();

  @Input() set Item(item: SubKatalog) {
    this.state.update(() => item);
  }

  @Input() set Catalog(item: Katalog) {
    this.catalog = item;
  }

  @Input({ required: true }) set flag(stateView: StateView) {
    this._falg = stateView;
  }

  public SubKatalog = computed(() => this.state());

  //--------------------------------
  public save(): void {
   //
    this.catalogModified.emit(<EmitData>{
      catalog: this.catalog,
      subCatalog: this.SubKatalog(),
     
      stateView: this._falg,
    });
  }

  public cancel() {
    // debugger
    this.catalogModified.emit(<EmitData>{
      catalog: this.catalog,
      subCatalog: this.SubKatalog(),
      stateView: StateView.exit,
    });
  }
}
