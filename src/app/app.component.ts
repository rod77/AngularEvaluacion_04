import { Component } from '@angular/core';
import { TranslateCompiler, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular-whishlist-simple';
  time = new Observable((observer) => {
    setInterval(() => observer.next(new Date().toString()), 1000);
  });

  constructor(public translate: TranslateService) {
    console.log('********** get translation');
    translate
      .getTranslation('en')
      .subscribe((x) => console.log('x:' + JSON.stringify(x)));
    translate.setDefaultLang('es');
  }
}
