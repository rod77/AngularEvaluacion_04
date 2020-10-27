import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  forwardRef,
  Inject,
} from '@angular/core';
import { DestinoViaje } from '../../models/destino-viaje.model';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  ValidatorFn,
} from '@angular/forms';
import { fromEvent } from 'rxjs';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import {
  map,
  filter,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs/operators';
import { AppConfig, APP_CONFIG } from 'src/app/app.module';

@Component({
  selector: 'app-form-destino-viaje',
  templateUrl: './form-destino-viaje.component.html',
  styleUrls: ['./form-destino-viaje.component.css'],
})
export class FormDestinoViajeComponent implements OnInit {
  @Output() onItemAdded: EventEmitter<DestinoViaje>;
  fg: FormGroup;
  minLongitud = 5;
  searchResults: string[];

  constructor(
    fb: FormBuilder,
    @Inject(forwardRef(() => APP_CONFIG)) private config: AppConfig
  ) {
    //inicializar
    this.onItemAdded = new EventEmitter();
    //vinculacion con tag html
    this.fg = fb.group({
      nombre: [
        '',
        Validators.compose([
          Validators.required,
          this.nombreValidator,
          this.nombreValidatorParametrizable(this.minLongitud),
        ]),
      ],
      url: [''],
    });

    //observador de tipeo
    this.fg.valueChanges.subscribe((form: any) => {
      console.log('cambio el formulario: ', form);
    });
  }

  ngOnInit(): void {
    let elemNombre = <HTMLInputElement>document.getElementById('nombre');
    fromEvent(elemNombre, 'input') //cada vez que toca una tecla
      .pipe(
        map((e: KeyboardEvent) => (e.target as HTMLInputElement).value), // va a estar atento al evento de tecleo, pero trae la palabra entera
        filter((text) => text.length > 2), //que si toda la cadena tiene una longitud menor a 2, entonces no continua
        debounceTime(200), //por si me teclea muy rapido, si espera menos de 200 no continua, caso contrario voy a buscar
        distinctUntilChanged(), //Si lo que llega es distincto continuo, sime llega lo mismo no. Ejemplo cuando me borra la ultima letra, me vuevle a llegar lo mismo.
        switchMap((text: string) =>
          ajax(this.config.apiEndPoint + '/ciudades?q=' + text)
        )
      )
      .subscribe(
        (ajaxResponse) => (this.searchResults = ajaxResponse.response)
      );
  }

  guardar(nombre: string, url: string): boolean {
    const d = new DestinoViaje(nombre, url);
    this.onItemAdded.emit(d);
    return false;
  }

  nombreValidator(control: FormControl): { [s: string]: boolean } {
    const l = control.value.toString().trim().length;
    if (l > 0 && l < 5) {
      return { invalidNombre: true };
    } else {
      return null;
    }
  }

  nombreValidatorParametrizable(minLong: number): ValidatorFn {
    return (control: FormControl): { [s: string]: boolean } | null => {
      const l = control.value.toString().trim().length;
      if (l > 0 && l < minLong) {
        return { minLongNombre: true };
      } else {
        return null;
      }
    };
  }
}
