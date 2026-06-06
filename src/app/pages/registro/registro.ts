import { Component } from '@angular/core';
import { RegistroForm } from './components/registro-form/registro-form';
import { RegistroIntro } from './components/registro-intro/registro-intro';

@Component({
  selector: 'app-registro',
  imports: [RegistroIntro, RegistroForm],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {}
