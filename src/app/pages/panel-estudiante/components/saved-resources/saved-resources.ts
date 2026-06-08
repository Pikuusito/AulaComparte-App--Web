import { Component, signal, computed } from '@angular/core';
import { NgClass } from '@angular/common';

export interface Resource {
  id: number;
  title: string;
  description: string;
  type: string;
  subject: string;
  level: string;
  author: string;
  authorInitials: string;
  downloads: number;
  isSaved: boolean;
}

@Component({
  selector: 'app-saved-resources',
  standalone: true,
  imports: [NgClass],
  templateUrl: './saved-resources.html',
  styleUrl: './saved-resources.css',
})
export class SavedResourcesComponent {
  
  
  // Base de datos simulada de todos los recursos
  resources = signal<Resource[]>([
    {
      id: 1,
      title: 'Álgebra Lineal - Guía Completa',
      description: 'Guía con ejercicios resueltos y teoría fundamental de álgebra lineal.',
      type: 'Guía',
      subject: 'Matemáticas',
      level: 'Universitario',
      author: 'Carlos Mendoza',
      authorInitials: 'CM',
      downloads: 45,
      isSaved: true,
    },
    {
      id: 2,
      title: 'Apuntes de Historia del Perú',
      description: 'Resumen completo desde las culturas preincaicas hasta la república.',
      type: 'Apuntes',
      subject: 'Historia',
      level: 'Secundaria',
      author: 'María López',
      authorInitials: 'ML',
      downloads: 32,
      isSaved: true,
    },
    {
      id: 3,
      title: 'Física Mecánica - Ejercicios',
      description: 'Problemas resueltos de cinemática, dinámica y energía.',
      type: 'Ejercicios',
      subject: 'Física',
      level: 'Universitario',
      author: 'Ana Torres',
      authorInitials: 'AT',
      downloads: 58,
      isSaved: true, // Este no aparecerá porque no está guardado
    },
    {
      id: 4,
      title: 'Biología Celular - Diapositivas',
      description: 'Presentación completa sobre estructura y función celular.',
      type: 'Diapositivas',
      subject: 'Biología',
      level: 'Universitario',
      author: 'Jorge Quispe',
      authorInitials: 'JQ',
      downloads: 27,
      isSaved: true,
    },
    {
      id: 5,
      title: 'Gramática Española',
      description: 'Libro digital con reglas gramaticales y ejercicios prácticos.',
      type: 'Libro',
      subject: 'Lenguaje',
      level: 'Secundaria',
      author: 'Rosa Huamán',
      authorInitials: 'RH',
      downloads: 41,
      isSaved: true,
    },
    {
      id: 6,
      title: 'Programación en Python',
      description: 'Conceptos básicos, estructuras de datos y algoritmos.',
      type: 'Apuntes',
      subject: 'Computación',
      level: 'Universitario',
      author: 'Luis Vargas',
      authorInitials: 'LV',
      downloads: 36,
      isSaved: true, // No aparecerá
    },
  ]);


  // Señal computada: solo expone los recursos que tienen isSaved === true
  savedResources = computed(() => this.resources().filter(r => r.isSaved));

  getTypeBadgeClasses(type: string): string {
    const classMap: Record<string, string> = {
      'Guía': 'bg-blue-100 text-blue-700 border-blue-200',
      'Apuntes': 'bg-amber-100 text-amber-700 border-amber-200',
      'Ejercicios': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'Diapositivas': 'bg-purple-100 text-purple-700 border-purple-200',
      'Libro': 'bg-rose-100 text-rose-700 border-rose-200',
    };
    return classMap[type] ?? 'bg-slate-100 text-slate-700 border-slate-200';
  }

  toggleSave(resourceId: number): void {
    // Al modificar isSaved, la señal computada (savedResources) se actualizará automáticamente
    // y el recurso desaparecerá visualmente de la lista.
    this.resources.update(resources => 
      resources.map(r => r.id === resourceId ? { ...r, isSaved: !r.isSaved } : r)
    );
  }
}
