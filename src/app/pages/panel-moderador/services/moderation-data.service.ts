import { Injectable, computed, signal } from '@angular/core';

export type ModerationResourceType =
  | 'Libro'
  | 'Apuntes'
  | 'Guía'
  | 'Ejercicios'
  | 'Diapositivas'
  | 'Examen';
export type ModerationResourceFormat =
  | 'PDF'
  | 'Imagen'
  | 'Documento'
  | 'Enlace'
  | 'Material físico';
export type ModerationStatus = 'Pendiente' | 'En revisión' | 'Aprobado' | 'Rechazado' | 'Reportado';
export type ModerationRisk = 'Bajo' | 'Medio' | 'Alto';

export interface ModerationResource {
  id: number;
  title: string;
  description: string;
  type: ModerationResourceType;
  format: ModerationResourceFormat;
  subject: string;
  level: string;
  author: string;
  submittedAgo: string;
  status: ModerationStatus;
  risk: ModerationRisk;
  permissionDeclared: boolean;
  sourceNote: string;
}

export interface ModerationStats {
  pending: number;
  approvedToday: number;
  rejected: number;
  reports: number;
}

// Base de datos simulada con recursos enviados por los usuarios para moderación
@Injectable({ providedIn: 'root' })
export class ModerationDataService {
  private readonly resourcesState = signal<ModerationResource[]>([
    {
      id: 1,
      title: 'Guía de práctica de Álgebra para secundaria',
      description:
        'Ejercicios resueltos y problemas propuestos sobre ecuaciones, funciones y factorización.',
      type: 'Guía',
      format: 'PDF',
      subject: 'Matemáticas',
      level: 'Secundaria',
      author: 'Rosa Huamán',
      submittedAgo: 'Hace 18 min',
      status: 'Pendiente',
      risk: 'Bajo',
      permissionDeclared: true,
      sourceNote: 'Material propio elaborado para reforzamiento escolar.',
    },
    {
      id: 2,
      title: 'Resumen visual de Biología celular',
      description:
        'Mapa de conceptos sobre organelos, membrana celular y procesos básicos de la célula.',
      type: 'Apuntes',
      format: 'Imagen',
      subject: 'Biología',
      level: 'Universitario',
      author: 'Jorge Quispe',
      submittedAgo: 'Hace 42 min',
      status: 'En revisión',
      risk: 'Medio',
      permissionDeclared: true,
      sourceNote: 'Apunte creado por estudiante, requiere revisar legibilidad de la imagen.',
    },
    {
      id: 3,
      title: 'Banco de exámenes de admisión comentados',
      description:
        'Compilación de preguntas antiguas con soluciones breves para práctica preuniversitaria.',
      type: 'Examen',
      format: 'Documento',
      subject: 'Razonamiento matemático',
      level: 'Preuniversitario',
      author: 'Luis Vargas',
      submittedAgo: 'Hace 1 h',
      status: 'Reportado',
      risk: 'Alto',
      permissionDeclared: false,
      sourceNote: 'El usuario no confirmó autorización del material recopilado.',
    },
    {
      id: 4,
      title: 'Diapositivas introductorias de Python',
      description:
        'Presentación con variables, condicionales y ejercicios cortos para iniciar programación.',
      type: 'Diapositivas',
      format: 'Enlace',
      subject: 'Computación',
      level: 'Universitario',
      author: 'Ana Torres',
      submittedAgo: 'Hace 2 h',
      status: 'Pendiente',
      risk: 'Bajo',
      permissionDeclared: true,
      sourceNote: 'Enlace público indicado por la autora del recurso.',
    },
  ]);

  readonly resources = computed(() => this.resourcesState());

  readonly reviewableResources = computed(() => this.resourcesState());

  readonly selectedResource = signal<ModerationResource | null>(null);

  readonly stats = computed<ModerationStats>(() => {
    const resources = this.resourcesState();

    return {
      pending: resources.filter(
        (resource) => resource.status === 'Pendiente' || resource.status === 'En revisión',
      ).length,
      approvedToday: resources.filter((resource) => resource.status === 'Aprobado').length + 6,
      rejected: resources.filter((resource) => resource.status === 'Rechazado').length + 2,
      reports: resources.filter((resource) => resource.status === 'Reportado').length,
    };
  });

  openReview(resourceId: number): void {
    this.updateStatus(resourceId, 'En revisión');
    this.selectedResource.set(
      this.resourcesState().find((resource) => resource.id === resourceId) ?? null,
    );
  }

  closeReview(): void {
    this.selectedResource.set(null);
  }

  approveResource(resourceId: number): void {
    this.updateStatus(resourceId, 'Aprobado');
    this.closeReview();
  }

  rejectResource(resourceId: number): void {
    this.updateStatus(resourceId, 'Rechazado');
    this.closeReview();
  }

  private updateStatus(resourceId: number, status: ModerationStatus): void {
    this.resourcesState.update((resources) =>
      resources.map((resource) =>
        resource.id === resourceId ? { ...resource, status } : resource,
      ),
    );
  }
}
