export type ResourceType =
  | 'Guía'
  | 'Apuntes'
  | 'Libro'
  | 'Ejercicios'
  | 'Diapositivas'
  | 'Investigación';

export interface ResourceItem {
  id: number;
  title: string;
  type: ResourceType;
  subject: string;
  downloads?: number;
  author: string;
  publishedAgo: string;
  description?: string;
  level?: string;
  pages?: number;
  imageCount?: number;
  format?: string;
  isSaved?: boolean;
  fileUrl?: string;
}

export interface ResourceDetail extends ResourceItem {
  description: string;
  level: string;
  pages?: number;
  format: string;
  isSaved: boolean;
  fileUrl: string;
}
