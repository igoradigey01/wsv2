import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

import { FormsModule } from '@angular/forms';

import { Katalog } from '@wsv2/app-common';
import { EmitData } from '../catalog-shell/catalog-shell.component';
import { StateView } from '@wsv2/app-common';

import { Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'wsv2-catalog-item',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,

    FormsModule,
  ],
  templateUrl: './catalog-item.component.html',
  styleUrls: ['./catalog-item.component.scss'],
})
export class CatalogItemComponent {

  private state = signal<Katalog>(<Katalog>{
    id: 0,
    hidden: false,
    decriptSEO: '',
    name: 'none',
    ownerId: 'none',
  });
  private _falg = StateView.edit;

  @Output() public catalogModified = new EventEmitter<EmitData>();

  @Input() set Item(item: Katalog) {
    this.state.update(() => item);
  }

  @Input({ required: true }) set flag(stateView: StateView) {
    this._falg = stateView;
  }

  public Katalog = computed(() => this.state());

  //--------------------------------
  public save(): void {
    debugger
    this.catalogModified.emit(<EmitData>{
      catalog: this.Katalog(),
      stateView: this._falg,
    });
  }

  public cancel() {
    // debugger
    this.catalogModified.emit(<EmitData>{
      catalog: this.Katalog(),
      stateView: StateView.exit,
    });
  }
}
