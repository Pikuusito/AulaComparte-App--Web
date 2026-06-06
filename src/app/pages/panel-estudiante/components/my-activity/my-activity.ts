import { Component, signal } from '@angular/core';
import { NgClass } from '@angular/common';

export interface SavedItem {
  title: string;
  subject: string;
  color: string;
}

export interface RequestItem {
  title: string;
  status: string;
  dotColor: string;
  textColor: string;
}

@Component({
  selector: 'app-my-activity',
  standalone: true,
  imports: [NgClass],
  templateUrl: './my-activity.html',
  styleUrl: './my-activity.css',
})
export class MyActivityComponent {
  savedItems = signal<SavedItem[]>([
    { title: 'Álgebra Lineal - Guía Completa', subject: 'Matemáticas', color: 'bg-main-500' },
    { title: 'Física Mecánica - Ejercicios', subject: 'Física', color: 'bg-amber-400' },
    { title: 'Gramática Española', subject: 'Lenguaje', color: 'bg-rose-400' },
  ]);

  requestItems = signal<RequestItem[]>([
    { title: 'Cálculo Diferencial - Libro', status: 'Pendiente', dotColor: 'bg-amber-400', textColor: 'text-amber-600' },
    { title: 'Anatomía Humana - Guía', status: 'En revisión', dotColor: 'bg-amber-400', textColor: 'text-amber-600' },
    { title: 'Programación en Python', status: 'Aprobada', dotColor: 'bg-main-500', textColor: 'text-main-600' },
  ]);
}
