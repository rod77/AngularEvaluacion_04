import { BrowserModule } from '@angular/platform-browser';
import {
  APP_INITIALIZER,
  Injectable,
  InjectionToken,
  NgModule,
} from '@angular/core';
import { AppComponent } from './app.component';
import { DestinoViajeComponent } from './components/destino-viaje/destino-viaje.component';
import { ListaDestinosComponent } from './components/lista-destinos/lista-destinos.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DestinoDetalleComponent } from './components/destino-detalle/destino-detalle.component';
import { FormDestinoViajeComponent } from './components/form-destino-viaje/form-destino-viaje.component';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import {
  DestinosViajesState,
  reducerDestinosViajes,
  initializeDestinosViajesState,
  DestinosViajesEffects,
  InitMyDataAction,
} from './models/destinos-viajes-state.model';
import {
  StoreModule as NgRxStoreModule,
  ActionReducerMap,
  Store,
} from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { LoginComponent } from './components/login/login/login.component';
import { ProtectedComponent } from './components/protected/protected/protected.component';
import { UsuariosLogueadoGuard } from './guards/usuario-logueado/usuarios-logueado.guard';
import { AuthService } from './services/auth.service';
import { VuelosComponent } from './components/vuelos/vuelos/vuelos.component';
import { VuelosMainComponent } from './components/vuelos/vuelos-main/vuelos-main.component';
import { VuelosMasInfoComponent } from './components/vuelos/vuelos-mas-info/vuelos-mas-info.component';
import { VuelosDetalleComponent } from './components/vuelos/vuelos-detalle/vuelos-detalle.component';
import { ReservasModule } from './reservas/reservas.module';
import Dexie from 'dexie';
import { DestinoViaje } from './models/destino-viaje.model';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { from, Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';
//import { NgxMapboxGLModule } from 'ngx-mapbox-gl/lib/ngx-mapbox-gl.module';
//import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EspiameDirective } from './espiame.directive';
import { TrackearClickDirective } from './trackear-click.directive';
//app config
export interface AppConfig {
  apiEndPoint: String;
}

const APP_CONFIG_VALUE: AppConfig = {
  apiEndPoint: 'http://localhost:3000',
};
export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');
// fub aoo config

//init routing
export const childrenRoutesVuelos: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: 'main', component: VuelosMainComponent },
  { path: 'mas-info', component: VuelosMasInfoComponent },
  { path: ':id', component: VuelosDetalleComponent },
];

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: ListaDestinosComponent },
  { path: 'destino', component: DestinoDetalleComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'protected',
    component: ProtectedComponent,
    canActivate: [UsuariosLogueadoGuard],
  },
  {
    path: 'vuelos',
    component: VuelosComponent,
    canActivate: [UsuariosLogueadoGuard],
    children: childrenRoutesVuelos,
  },
];
//end routing

//dixie db init (primer caso dnd se grababa la info)
/*@Injectable({
  providedIn: 'root',
})
export class MyDatabase extends Dexie {
  destinos: Dexie.Table<DestinoViaje, number>;
  constructor() {
    super('MyDatabase');
    this.version(1).stores({
      destinos: '++id,nombre,imagenUrl',
    });
  }
}
export const db = new MyDatabase();*/

//dixie db end

//dixie db init
export class Translation {
  constructor(
    public id: number,
    public lang: string,
    public key: string,
    public value: string
  ) {}
}

@Injectable({
  providedIn: 'root',
})
export class MyDatabase extends Dexie {
  destinos: Dexie.Table<DestinoViaje, number>;
  translations: Dexie.Table<Translation, number>;
  constructor() {
    super('MyDatabase');
    this.version(1).stores({
      destinos: '++id,nombre,imagenUrl',
    });
    this.version(2).stores({
      destinos: '++id,nombre,imagenUrl',
      translations: '++id,lang,key,value',
    });
  }
}
export const db = new MyDatabase();

//dixie db end

//i18n ini
class TranslationLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string): Observable<any> {
    const promise = db.translations
      .where('lang')
      .equals(lang)
      .toArray()
      .then((results) => {
        if (results.length === 0) {
          return this.http
            .get<Translation[]>(
              APP_CONFIG_VALUE.apiEndPoint + '/api/translation?lang=' + lang
            )
            .toPromise()
            .then((apiResults) => {
              db.translations.bulkAdd(apiResults);
              return apiResults;
            });
        }
        return results;
      })
      .then((traducciones) => {
        console.log('traducciones cargadas:');
        console.log(traducciones);
        return traducciones;
      })
      .then((traducciones) => {
        return traducciones.map((t) => ({ [t.key]: t.value }));
      });
    return from(promise).pipe(flatMap((elems) => from(elems)));
  }
}

function HttpLoaderFactory(http: HttpClient) {
  return new TranslationLoader(http);
}
//i18n end
//redux init
export interface AppState {
  destinos: DestinosViajesState;
}
const reducers: ActionReducerMap<AppState> = {
  destinos: reducerDestinosViajes,
};

let reducersInitialState = {
  destinos: initializeDestinosViajesState(),
};
//end redux init

// app init
export function init_app(appLoadService: AppLoadService): () => Promise<any> {
  return () => appLoadService.initializeDestinosViajesState();
}
@Injectable()
class AppLoadService {
  constructor(private store: Store<AppState>, private http: HttpClient) {}
  async initializeDestinosViajesState(): Promise<any> {
    const headers: HttpHeaders = new HttpHeaders({
      'X-API-TOKEN': 'token-seguridad',
    });
    const req = new HttpRequest('GET', APP_CONFIG_VALUE.apiEndPoint + '/my', {
      headers: headers,
    });
    const response: any = await this.http.request(req).toPromise();
    this.store.dispatch(new InitMyDataAction(response.body));
  }
}

//end app init

@NgModule({
  declarations: [
    AppComponent,
    DestinoViajeComponent,
    ListaDestinosComponent,
    DestinoDetalleComponent,
    FormDestinoViajeComponent,
    LoginComponent,
    ProtectedComponent,
    VuelosComponent,
    VuelosMainComponent,
    VuelosMasInfoComponent,
    VuelosDetalleComponent,
    EspiameDirective,
    TrackearClickDirective,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    NgRxStoreModule.forRoot(reducers, {
      initialState: reducersInitialState,
      runtimeChecks: {
        strictStateImmutability: false,
        strictActionImmutability: false,
      },
    }),
    //NgxMapboxGLModule,
    BrowserAnimationsModule,
    EffectsModule.forRoot([DestinosViajesEffects]),
    StoreDevtoolsModule.instrument(),
    ReservasModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    AuthService,
    UsuariosLogueadoGuard,
    { provide: APP_CONFIG, useValue: APP_CONFIG_VALUE },
    AppLoadService,
    {
      provide: APP_INITIALIZER,
      useFactory: init_app,
      deps: [AppLoadService],
      multi: true,
    },
    MyDatabase,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
