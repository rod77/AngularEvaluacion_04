import {
  Component,
  OnInit,
  Input,
  HostBinding,
  EventEmitter,
  Output,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { DestinosApiClient } from 'src/app/models/destinos-api-client.model';
import { AppState } from '../../app.module';

import { DestinoViaje } from '../../models/destino-viaje.model';
import {
  VoteDownAction,
  VoteUpAction,
} from '../../models/destinos-viajes-state.model';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-destino-viaje',
  templateUrl: './destino-viaje.component.html',
  styleUrls: ['./destino-viaje.component.css'],
  providers: [DestinosApiClient],
  animations: [
    trigger('esFavorito', [
      state(
        'estadoFavorito',
        style({
          backgroundColor: 'PaleTurquoise',
        })
      ),
      state('estadoNofavorito', style({ backgroundColor: 'WhiteSmoke' })),
      transition('estadoNofavorito => estadoFavorito', [animate('3s')]),
      transition('estadoFavorito => estadoNofavorito', [animate('1s')]),
    ]),
  ],
})
export class DestinoViajeComponent implements OnInit {
  @Input() destino: DestinoViaje;
  @Input() position: number;
  @HostBinding('attr.class') cssClass = 'col-md-4';

  @Output() onClicked: EventEmitter<DestinoViaje>;

  agregar(titulo: HTMLInputElement) {
    console.log(titulo.value);
  }
  constructor(private store: Store<AppState>) {
    this.onClicked = new EventEmitter();
  }

  ir(): boolean {
    this.onClicked.emit(this.destino);
    return false;
  }

  voteUp() {
    this.store.dispatch(new VoteUpAction(this.destino));
    console.log('Aumente: ', this.destino.votes);
    //console.log('ACAAAAA:', this.destino.isSelected());
    return false;
  }

  voteDown() {
    this.store.dispatch(new VoteDownAction(this.destino));
    console.log('Disminui: ', this.destino.votes);
    return false;
  }

  ngOnInit(): void {}
}
