import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  mensajeError: string;
  constructor(public authService: AuthService) {
    this.mensajeError = '';
  }

  ngOnInit(): void {}

  login(username: string, password: string): boolean {
    console.log('primero:', this.authService.getUser());
    this.mensajeError = '';
    if (!this.authService.login(username, password)) {
      this.mensajeError = 'Login incorrecto';
      setTimeout(
        function () {
          this.mensajeError = '';
        }.bind(this),
        2500
      );
    }
    console.log('luego:', this.authService.getUser());
    return false;
  }

  logout(): boolean {
    this.authService.logout();
    return false;
  }
}
