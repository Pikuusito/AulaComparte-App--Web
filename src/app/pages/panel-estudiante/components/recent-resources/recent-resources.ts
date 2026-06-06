import { Component, signal } from '@angular/core';
import { NgClass } from '@angular/common';

export interface Resource {
  id: number;
  title: string;
  description: string;
  type: string;
  subject: string;
  level: string;
  author: string;
  downloads: number;
}

@Component({
  selector: 'app-recent-resources',
  standalone: true,
  imports: [NgClass],
  templateUrl: './recent-resources.html',
  styleUrl: './recent-resources.css',
})

// Base de datos Simulada de recursos educativos recientes, para mostrar en el panel del estudante.
export class RecentResourcesComponent {
  resources = signal<Resource[]>([
    {
      id: 1,
      title: 'Álgebra Lineal - Guía Completa',
      description:
        'Guía con ejercicios resueltos y teoría fundamental de álgebra lineal.',
      type: 'Guía',
      subject: 'Matemáticas',
      level: 'Universitario',
      author: 'Prof. Carlos Mendoza',
      downloads: 45,
    },
    {
      id: 2,
      title: 'Apuntes de Historia del Perú',
      description:
        'Resumen completo desde las culturas preincaicas hasta la república.',
      type: 'Apuntes',
      subject: 'Historia',
      level: 'Secundaria',
      author: 'María López',
      downloads: 32,
    },
    {
      id: 3,
      title: 'Física Mecánica - Ejercicios',
      description:
        'Problemas resueltos de cinemática, dinámica y energía.',
      type: 'Ejercicios',
      subject: 'Física',
      level: 'Universitario',
      author: 'Prof. Ana Torres',
      downloads: 58,
    },
    {
      id: 4,
      title: 'Biología Celular - Diapositivas',
      description:
        'Presentación completa sobre estructura y función celular.',
      type: 'Diapositivas',
      subject: 'Biología',
      level: 'Universitario',
      author: 'Dr. Jorge Quispe',
      downloads: 27,
    },
    {
      id: 5,
      title: 'Gramática Española',
      description:
        'Libro digital con reglas gramaticales y ejercicios prácticos.',
      type: 'Libro',
      subject: 'Lenguaje',
      level: 'Secundaria',
      author: 'Prof. Rosa Huamán',
      downloads: 41,
    },
    {
      id: 6,
      title: 'Química Orgánica - Separata',
      description:
        'Nomenclatura, reacciones y mecanismos de química orgánica.',
      type: 'Apuntes',
      subject: 'Química',
      level: 'Universitario',
      author: 'Prof. Luis Vargas',
      downloads: 36,
    },
  ]);

  getTypeBadgeClasses(type: string): string {
    const classMap: Record<string, string> = {
      'Guía': 'bg-emerald-100 text-emerald-700',
      'Apuntes': 'bg-sky-100 text-sky-700',
      'Ejercicios': 'bg-amber-100 text-amber-700',
      'Diapositivas': 'bg-purple-100 text-purple-700',
      'Libro': 'bg-rose-100 text-rose-700',
    };
    return classMap[type] ?? 'bg-slate-100 text-slate-700';
  }
}
