import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from '../../app.module';
import { DestinoViaje } from '../../models/destino-viaje.model';
import { DestinosApiClient } from '../../models/destinos-api-client.model';
import {
  ElegidoFavoritoAction,
  NuevoDestinoAction,
} from '../../models/destinos-viajes-state.model';

@Component({
  selector: 'app-lista-destinos',
  templateUrl: './lista-destinos.component.html',
  styleUrls: ['./lista-destinos.component.css'],
  providers: [DestinosApiClient],
})
export class ListaDestinosComponent implements OnInit {
  @Output() onItemAdded: EventEmitter<DestinoViaje>; //Esta variable es la que guarda el favorito al ir y volver
  updates: string[];
  all; //Variable Testigo
  constructor(
    public destinosApiClient: DestinosApiClient,
    private store: Store<AppState>
  ) {
    this.onItemAdded = new EventEmitter();
    this.updates = [];

    this.store
      .select((state) => state.destinos.favorito)
      .subscribe((d) => {
        if (d != null) {
          this.updates.push('Se ha alegido a ' + d.nombre);
        }
      });
    console.log('alo', this.all);
    store
      .select((state) => state.destinos.items)
      .subscribe((items) => (this.all = items));
  }

  ngOnInit(): void {}

  agregado(d: DestinoViaje) {
    console.log('Agregado:', d.nombre);
    this.destinosApiClient.add(d);
    this.onItemAdded.emit(d);
    //  this.store.dispatch(new NuevoDestinoAction(d));
  }

  elegido(e: DestinoViaje) {
    console.log('Elegido:', e.nombre);
    this.destinosApiClient.elegir(e);
    // this.store.dispatch(new ElegidoFavoritoAction(e));
  }

  getAll() {}
}
