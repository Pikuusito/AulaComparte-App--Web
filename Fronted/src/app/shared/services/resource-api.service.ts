import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiResource, ApiResourceStatus, ApiResourceType, ResourceCreateRequest } from '../models/resource-api.model';

const RESOURCES_API_URL = 'http://localhost:8000/api/resources';

@Injectable({ providedIn: 'root' })
export class ResourceApiService {
  private readonly http = inject(HttpClient);
  private readonly myResourcesState = signal<ApiResource[]>([]);

  readonly myResources = this.myResourcesState.asReadonly();

  create(request: ResourceCreateRequest, file: File | null): Observable<ApiResource> {
    const formData = new FormData();
    formData.append('title', request.title);
    formData.append('description', request.description);
    formData.append('resource_type', request.resource_type);
    formData.append('subject', request.subject);
    formData.append('education_level', request.education_level);
    formData.append('format', request.format);
    formData.append('author', request.author);
    formData.append('permission_declared', String(request.permission_declared));

    this.appendOptional(formData, 'external_url', request.external_url);
    this.appendOptional(formData, 'material_reference', request.material_reference);
    this.appendOptionalNumber(formData, 'page_count', request.page_count);
    this.appendOptionalNumber(formData, 'image_count', request.image_count);
    if (file) {
      formData.append('file', file, file.name);
    }

    return this.http.post<ApiResource>(RESOURCES_API_URL, formData).pipe(
      tap((resource) => this.myResourcesState.update((resources) => [resource, ...resources])),
    );
  }

  loadMine(): Observable<ApiResource[]> {
    return this.http
      .get<ApiResource[]>(`${RESOURCES_API_URL}/mine`)
      .pipe(tap((resources) => this.myResourcesState.set(resources)));
  }

  loadCatalog(): Observable<ApiResource[]> {
    return this.http.get<ApiResource[]>(RESOURCES_API_URL);
  }

  search(query: string, resourceType?: ApiResourceType): Observable<ApiResource[]> {
    let params = new HttpParams().set('q', query);

    if (resourceType) {
      params = params.set('resource_type', resourceType);
    }

    return this.http.get<ApiResource[]>(`${RESOURCES_API_URL}/search`, { params });
  }

  loadSaved(): Observable<ApiResource[]> {
    return this.http.get<ApiResource[]>(`${RESOURCES_API_URL}/saved`);
  }

  save(resourceId: number): Observable<ApiResource> {
    return this.http.post<ApiResource>(`${RESOURCES_API_URL}/${resourceId}/save`, {});
  }

  unsave(resourceId: number): Observable<void> {
    return this.http.delete<void>(`${RESOURCES_API_URL}/${resourceId}/save`);
  }

  report(resourceId: number, reason: string): Observable<ApiResource> {
    return this.http.post<ApiResource>(`${RESOURCES_API_URL}/${resourceId}/report`, { reason });
  }

  loadPending(): Observable<ApiResource[]> {
    return this.http.get<ApiResource[]>(`${RESOURCES_API_URL}/pending`);
  }

  updateStatus(resourceId: number, status: ApiResourceStatus, moderatorComment?: string): Observable<ApiResource> {
    return this.http.patch<ApiResource>(`${RESOURCES_API_URL}/${resourceId}/status`, {
      status,
      moderator_comment: moderatorComment,
    });
  }

  private appendOptional(formData: FormData, key: string, value: string | undefined): void {
    if (value) {
      formData.append(key, value);
    }
  }

  private appendOptionalNumber(formData: FormData, key: string, value: number | undefined): void {
    if (value !== undefined) {
      formData.append(key, String(value));
    }
  }
}
