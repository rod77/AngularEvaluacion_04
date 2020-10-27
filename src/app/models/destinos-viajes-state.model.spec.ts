import {
  reducerDestinosViajes,
  DestinosViajesState,
  initializeDestinosViajesState,
  InitMyDataAction,
  NuevoDestinoAction,
} from './destinos-viajes-state.model';
import { DestinoViaje } from './destino-viaje.model';

describe('reducerDestinosViajes', () => {
  it('should reduce init data', () => {
    //setup
    const prevState: DestinosViajesState = initializeDestinosViajesState();
    const action: InitMyDataAction = new InitMyDataAction([
      'destino 1',
      'destino 2',
    ]);
    //action
    const newState: DestinosViajesState = reducerDestinosViajes(
      prevState,
      action
    );
    //assert
    expect(newState.items.length).toEqual(2);
    expect(newState.items[0].nombre).toEqual('destino 1');
  });

  it('should reduce new item added', () => {
    //setup
    const prevState: DestinosViajesState = initializeDestinosViajesState();
    const action: NuevoDestinoAction = new NuevoDestinoAction(
      new DestinoViaje('barcelona', 'url')
    );
    //action
    const newState: DestinosViajesState = reducerDestinosViajes(
      prevState,
      action
    );
    //assert
    expect(newState.items.length).toEqual(1);
    expect(newState.items[0].nombre).toEqual('barcelona');
  });
});
