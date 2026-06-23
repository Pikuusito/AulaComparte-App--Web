export type ApiResourceType = 'book' | 'notes' | 'guide' | 'exercises' | 'slides' | 'exam';
export type ApiEducationLevel = 'primary' | 'secondary' | 'preuniversity' | 'university';
export type ApiResourceFormat = 'pdf' | 'image' | 'document' | 'link' | 'physical';
export type ApiResourceStatus = 'pending' | 'approved' | 'rejected' | 'reported';

export interface ResourceCreateRequest {
  title: string;
  description: string;
  resource_type: ApiResourceType;
  subject: string;
  education_level: ApiEducationLevel;
  format: ApiResourceFormat;
  author: string;
  external_url?: string;
  material_reference?: string;
  page_count?: number;
  image_count?: number;
  permission_declared: boolean;
}

export interface ApiResource {
  id: number;
  owner_id: number;
  title: string;
  description: string;
  resource_type: ApiResourceType;
  subject: string;
  education_level: ApiEducationLevel;
  format: ApiResourceFormat;
  author: string;
  file_path: string | null;
  external_url: string | null;
  material_reference: string | null;
  page_count: number | null;
  image_count: number | null;
  permission_declared: boolean;
  report_reason: string | null;
  status: ApiResourceStatus;
  downloads: number;
  created_at: string;
}
