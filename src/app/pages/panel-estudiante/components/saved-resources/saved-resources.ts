import { Component, signal, computed } from '@angular/core';
import { NgClass } from '@angular/common';

export type ResourceType = 'Guía' | 'Apuntes' | 'Libro' | 'Ejercicios' | 'Diapositivas';

export interface Resource {
  id: number;
  title: string;
  description: string;
  type: ResourceType;
  subject: string;
  level: string;
  author: string;
  savedAgo: string;
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
  resources = signal<Resource[]>([
    {
      id: 1,
      title: 'Álgebra Lineal - Guía Completa',
      description: 'Guía con ejercicios resueltos y teoría fundamental de álgebra lineal.',
      type: 'Guía',
      subject: 'Matemáticas',
      level: 'Universitario',
      author: 'Carlos Mendoza',
      savedAgo: 'Guardado hace 1 dia',
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
      savedAgo: 'Guardado ayer',
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
      savedAgo: 'Guardado hace 2 dias',
      downloads: 58,
      isSaved: true,
    },
    {
      id: 4,
      title: 'Biología Celular - Diapositivas',
      description: 'Presentación completa sobre estructura y función celular.',
      type: 'Diapositivas',
      subject: 'Biología',
      level: 'Universitario',
      author: 'Jorge Quispe',
      savedAgo: 'Guardado hace 3 dias',
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
      savedAgo: 'Guardado hace 4 dias',
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
      savedAgo: 'Guardado hace 5 dias',
      downloads: 36,
      isSaved: true,
    },
  ]);


  savedResources = computed(() => this.resources().filter(r => r.isSaved));

  getTypeBadgeClasses(type: ResourceType): string {
    const classMap: Record<ResourceType, string> = {
      Guía: 'bg-blue-100 text-blue-700 border-blue-200',
      Apuntes: 'bg-amber-100 text-amber-700 border-amber-200',
      Libro: 'bg-rose-100 text-rose-700 border-rose-200',
      Ejercicios: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      Diapositivas: 'bg-purple-100 text-purple-700 border-purple-200',
    };

    return classMap[type];
  }

  toggleSave(resourceId: number): void {
    this.resources.update(resources => 
      resources.map(r => r.id === resourceId ? { ...r, isSaved: !r.isSaved } : r)
    );
  }
}
