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

export type ModerationStatus = 'Pendiente' | 'Aprobado' | 'Rechazado' | 'Reportado';
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
  fileSize: string;
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
