import { Component, signal } from '@angular/core';
import { NgClass } from '@angular/common';

interface RecentResource {
  id: number;
  title: string;
  description: string;
  type: 'Guía' | 'Apuntes' | 'Libro' | 'Ejercicios' | 'Diapositivas';
  subject: string;
  level: string;
  author: string;
  publishedAgo: string;
  downloads: number;
}

@Component({
  selector: 'app-recent-resources',
  standalone: true,
  imports: [NgClass],
  templateUrl: './recent-resources.html',
  styleUrl: './recent-resources.css',
})

// Componente para mostrar los recursos recientes en el panel del estudiante
// Base de datos simulada con recursos de ejemplo para ilustrar la funcionalidad
export class RecentResourcesComponent {
    readonly resources = signal<RecentResource[]>([
    {
      id: 1,
      title: 'Banco de ejercicios de Algebra',
      description: 'Problemas resueltos de ecuaciones, funciones y sistemas lineales para practicar antes de un examen.',
      type: 'Ejercicios',
      subject: 'Matematicas',
      level: 'Secundaria',
      author: 'Rosa Huaman',
      publishedAgo: 'Hace 1 dia',
      downloads: 24,
    },
    {
      id: 2,
      title: 'Guia rapida de Biologia Celular',
      description: 'Resumen visual sobre organelos, membrana celular y funciones principales de la celula.',
      type: 'Guía',
      subject: 'Biologia',
      level: 'Universitario',
      author: 'Jorge Quispe',
      publishedAgo: 'Hace 2 dias',
      downloads: 18,
    },
    {
      id: 3,
      title: 'Apuntes de Historia del Peru Republicano',
      description: 'Material organizado por periodos historicos con fechas clave y conceptos para repasar.',
      type: 'Apuntes',
      subject: 'Historia',
      level: 'Secundaria',
      author: 'Maria Lopez',
      publishedAgo: 'Hace 3 dias',
      downloads: 31,
    },
    {
      id: 4,
      title: 'Introduccion a programacion con Python',
      description: 'Conceptos basicos, variables, condicionales y ejercicios cortos para iniciar desde cero.',
      type: 'Libro',
      subject: 'Computacion',
      level: 'Universitario',
      author: 'Luis Vargas',
      publishedAgo: 'Hace 5 dias',
      downloads: 42,
    },
  ]);

  getTypeBadgeClasses(type: RecentResource['type']): string {
    const classes: Record<RecentResource['type'], string> = {
      Guía: 'bg-blue-100 text-blue-700 border-blue-200',
      Apuntes: 'bg-amber-100 text-amber-700 border-amber-200',
      Libro: 'bg-rose-100 text-rose-700 border-rose-200',
      Ejercicios: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      Diapositivas: 'bg-purple-100 text-purple-700 border-purple-200',
    };

    return classes[type];
  }
}
