import { Component } from '@angular/core';
import { LoginForm } from './components/login-form/login-form';
import { LoginIntro } from './components/login-intro/login-intro';

@Component({
  selector: 'app-login',
  imports: [LoginIntro, LoginForm],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {}
