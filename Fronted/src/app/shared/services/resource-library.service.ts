import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import {
  ApiEducationLevel,
  ApiResource,
  ApiResourceFormat,
  ApiResourceType,
} from '../models/resource-api.model';
import { ResourceItem, ResourceType } from '../models/resource.model';
import { AuthService } from './auth.service';
import { ResourceApiService } from './resource-api.service';

const API_ORIGIN = 'http://localhost:8000';

@Injectable({ providedIn: 'root' })
export class ResourceLibraryService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly auth = inject(AuthService);
  private readonly resourceApi = inject(ResourceApiService);
  private readonly resourcesState = signal<ResourceItem[]>([]);
  private readonly searchResultsState = signal<ResourceItem[]>([]);
  private readonly savedResourceIds = signal<Set<number>>(new Set<number>());
  private readonly reportingResourceIds = signal<Set<number>>(new Set<number>());
  private readonly reportResourceSelection = signal<ResourceItem | null>(null);

  readonly resources = computed(() => this.resourcesState());
  readonly searchResults = computed(() => this.searchResultsState());
  readonly isLoading = signal(false);
  readonly isSearchLoading = signal(false);
  readonly loadError = signal('');
  readonly searchError = signal('');
  readonly reportFeedback = signal('');
  readonly reportError = signal('');
  readonly reportReason = signal('');
  readonly reportReasonError = signal('');
  readonly selectedReportResource = computed(() => this.reportResourceSelection());
  readonly reportingIds = computed(() => this.reportingResourceIds());
  readonly canSubmitReport = computed(() => this.reportReason().trim().length >= 10);
  readonly savedResources = computed(() =>
    this.resourcesState().filter((resource) => resource.isSaved),
  );

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCatalog();
    }
  }

  loadCatalog(): void {
    this.isLoading.set(true);
    this.loadError.set('');
    this.resourceApi
      .loadCatalog()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (resources) => {
          this.resourcesState.set(resources.map((resource) => this.mapResource(resource)));
          this.loadSavedResources();
        },
        error: () => this.loadError.set('No se pudo cargar el catálogo desde el servidor.'),
      });
  }

  loadSavedResources(): void {
    if (this.auth.currentUser()?.role !== 'user') {
      this.savedResourceIds.set(new Set<number>());
      this.applySavedState();
      return;
    }

    this.resourceApi.loadSaved().subscribe({
      next: (resources) => {
        this.savedResourceIds.set(new Set(resources.map((resource) => resource.id)));
        this.applySavedState();
      },
      error: () => this.loadError.set('No se pudieron cargar tus recursos guardados.'),
    });
  }

  searchCatalog(query: string, resourceType?: ApiResourceType): void {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      this.clearSearch();
      return;
    }

    this.isSearchLoading.set(true);
    this.searchError.set('');
    this.resourceApi
      .search(trimmedQuery, resourceType)
      .pipe(finalize(() => this.isSearchLoading.set(false)))
      .subscribe({
        next: (resources) => {
          this.searchResultsState.set(resources.map((resource) => this.mapResource(resource)));
        },
        error: () => this.searchError.set('No se pudo completar la búsqueda. Inténtalo nuevamente.'),
      });
  }

  clearSearch(): void {
    this.searchResultsState.set([]);
    this.searchError.set('');
    this.isSearchLoading.set(false);
  }

  toggleSave(resourceId: number): void {
    const wasSaved = this.savedResourceIds().has(resourceId);
    this.setSavedState(resourceId, !wasSaved);

    const request: Observable<unknown> = wasSaved
      ? this.resourceApi.unsave(resourceId)
      : this.resourceApi.save(resourceId);

    request.subscribe({
      next: () => undefined,
      error: () => {
        this.setSavedState(resourceId, wasSaved);
        this.loadError.set('No se pudo actualizar el recurso guardado. Inténtalo nuevamente.');
      },
    });
  }

  openReportDialog(resource: ResourceItem): void {
    this.reportResourceSelection.set(resource);
    this.reportReason.set('');
    this.reportReasonError.set('');
    this.reportError.set('');
  }

  closeReportDialog(): void {
    this.reportResourceSelection.set(null);
    this.reportReason.set('');
    this.reportReasonError.set('');
  }

  updateReportReason(reason: string): void {
    this.reportReason.set(reason);

    if (reason.trim().length >= 10) {
      this.reportReasonError.set('');
    }
  }

  submitReport(): void {
    const resource = this.reportResourceSelection();
    const reason = this.reportReason().trim();

    if (!resource) {
      return;
    }

    if (reason.length < 10) {
      this.reportReasonError.set('Escribe una razón un poco más clara para que el moderador pueda revisarla.');
      return;
    }

    this.reportResource(resource.id, reason);
  }

  private reportResource(resourceId: number, reason: string): void {
    if (this.reportingResourceIds().has(resourceId)) {
      return;
    }

    this.reportFeedback.set('');
    this.reportError.set('');
    this.setReportingState(resourceId, true);

    this.resourceApi
      .report(resourceId, reason)
      .pipe(finalize(() => this.setReportingState(resourceId, false)))
      .subscribe({
        next: () => {
          this.removeResourceFromStudentLists(resourceId);
          this.closeReportDialog();
          this.reportFeedback.set('Reporte enviado. El material pasará a revisión del moderador.');
        },
        error: () => {
          this.reportError.set('No se pudo reportar el material. Inténtalo nuevamente.');
        },
      });
  }

  incrementDownloads(resourceId: number): void {
    this.resourcesState.update((resources) =>
      resources.map((resource) =>
        resource.id === resourceId
          ? { ...resource, downloads: (resource.downloads ?? 0) + 1 }
          : resource,
      ),
    );
  }

  findResource(resourceId: number): ResourceItem | undefined {
    return this.resourcesState().find((resource) => resource.id === resourceId);
  }

  private setSavedState(resourceId: number, isSaved: boolean): void {
    const nextIds = new Set(this.savedResourceIds());

    if (isSaved) {
      nextIds.add(resourceId);
    } else {
      nextIds.delete(resourceId);
    }

    this.savedResourceIds.set(nextIds);
    this.applySavedState();
  }

  private setReportingState(resourceId: number, isReporting: boolean): void {
    const nextIds = new Set(this.reportingResourceIds());

    if (isReporting) {
      nextIds.add(resourceId);
    } else {
      nextIds.delete(resourceId);
    }

    this.reportingResourceIds.set(nextIds);
  }

  private removeResourceFromStudentLists(resourceId: number): void {
    this.resourcesState.update((resources) => resources.filter((resource) => resource.id !== resourceId));
    this.searchResultsState.update((resources) => resources.filter((resource) => resource.id !== resourceId));
    this.setSavedState(resourceId, false);
  }

  private applySavedState(): void {
    const savedIds = this.savedResourceIds();
    this.resourcesState.update((resources) =>
      resources.map((resource) => ({ ...resource, isSaved: savedIds.has(resource.id) })),
    );
    this.searchResultsState.update((resources) =>
      resources.map((resource) => ({ ...resource, isSaved: savedIds.has(resource.id) })),
    );
  }

  private mapResource(resource: ApiResource): ResourceItem {
    return {
      id: resource.id,
      title: resource.title,
      type: this.mapType(resource.resource_type),
      subject: resource.subject,
      downloads: resource.downloads,
      author: resource.author,
      publishedAgo: this.formatPublishedAgo(resource.created_at),
      description: resource.description,
      level: this.mapLevel(resource.education_level),
      pages: resource.page_count ?? undefined,
      imageCount: resource.image_count ?? undefined,
      format: this.mapFormat(resource.format),
      isSaved: this.savedResourceIds().has(resource.id),
      fileUrl: this.resolveResourceUrl(resource),
    };
  }

  private mapType(type: ApiResourceType): ResourceType {
    const types: Record<ApiResourceType, ResourceType> = {
      book: 'Libro',
      notes: 'Apuntes',
      guide: 'Guía',
      exercises: 'Ejercicios',
      slides: 'Diapositivas',
      exam: 'Examen',
    };

    return types[type];
  }

  private mapLevel(level: ApiEducationLevel): string {
    const levels: Record<ApiEducationLevel, string> = {
      primary: 'Primaria',
      secondary: 'Secundaria',
      preuniversity: 'Preuniversitario',
      university: 'Universitario',
    };

    return levels[level];
  }

  private mapFormat(format: ApiResourceFormat): string {
    const formats: Record<ApiResourceFormat, string> = {
      pdf: 'PDF',
      image: 'Imagen',
      document: 'Documento',
      link: 'Enlace',
      physical: 'Material físico',
    };

    return formats[format];
  }

  private resolveResourceUrl(resource: ApiResource): string {
    if (resource.file_path) {
      return `${API_ORIGIN}/${resource.file_path}`;
    }
    return resource.external_url ?? '';
  }

  private formatPublishedAgo(createdAt: string): string {
    const elapsedDays = Math.max(
      0,
      Math.floor((Date.now() - new Date(createdAt).getTime()) / 86_400_000),
    );
    if (elapsedDays === 0) {
      return 'Publicado hoy';
    }
    if (elapsedDays === 1) {
      return 'Hace 1 día';
    }
    return `Hace ${elapsedDays} días`;
  }
}
