import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ResourceDetail, ResourceType } from '../../../shared/models/resource.model';
import { ResourceLibraryService } from '../../../shared/services/resource-library.service';

const API_ORIGIN = 'http://localhost:8000';

@Injectable({ providedIn: 'root' })
export class ResourceDetailService {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly resourceLibrary = inject(ResourceLibraryService);
  private readonly currentResourceId = signal(1);

  readonly resource = signal<ResourceDetail>({
    id: 0,
    title: 'Cargando recurso...',
    type: 'Guía',
    subject: '',
    author: '',
    publishedAgo: '',
    description: 'Estamos obteniendo la información desde el catálogo.',
    level: '',
    format: 'Enlace',
    isSaved: false,
    fileUrl: '',
  });

  readonly isDownloading = signal(false);
  readonly downloaded = signal(false);
  readonly showPreview = signal(false);
  readonly previewLoaded = signal(false);

  constructor() {
    effect(() => {
      const resource = this.resourceLibrary
        .resources()
        .find((item) => item.id === this.currentResourceId());

      if (resource) {
        this.resource.set(resource as ResourceDetail);
      }
    });
  }

  loadResource(id: number): void {
    this.currentResourceId.set(id);
    const found = this.resourceLibrary.findResource(id);
    if (found) {
      this.resource.set(found as ResourceDetail);
      this.downloaded.set(false);
      this.showPreview.set(false);
      this.previewLoaded.set(false);
    }
  }

  readonly typeBadgeClasses = computed(() => {
    const classMap: Record<ResourceType, string> = {
      Guía: 'bg-blue-100 text-blue-700 border-blue-200',
      Apuntes: 'bg-amber-100 text-amber-700 border-amber-200',
      Libro: 'bg-rose-100 text-rose-700 border-rose-200',
      Ejercicios: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      Diapositivas: 'bg-purple-100 text-purple-700 border-purple-200',
      Examen: 'bg-red-100 text-red-700 border-red-200',
      Investigación: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    };
    return classMap[this.resource().type];
  });

  readonly resourceMetricLabel = computed(() => {
    const resource = this.resource();
    const normalizedFormat = resource.format.toLowerCase();

    if (normalizedFormat.includes('imagen') || normalizedFormat.includes('image')) {
      const imageCount = resource.imageCount;
      if (imageCount === undefined) {
        return 'Detectando imágenes...';
      }

      return `${imageCount} ${imageCount === 1 ? 'imagen' : 'imágenes'}`;
    }

    if (resource.pages === undefined) {
      return 'Detectando páginas...';
    }

    return `${resource.pages} ${resource.pages === 1 ? 'página' : 'páginas'}`;
  });

  readonly previewUrl = computed<SafeResourceUrl>(() => {
    const url = this.resource().fileUrl;

    if (this.shouldUseGoogleViewer()) {
      const encoded = encodeURIComponent(url);
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://docs.google.com/viewer?url=${encoded}&embedded=true`,
      );
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  readonly previewProviderLabel = computed(() =>
    this.shouldUseGoogleViewer() ? 'Powered by Google Docs Viewer' : 'Vista previa local',
  );

  readonly downloadUrl = computed(() => {
    const resourceId = this.resource().id;
    return resourceId > 0 ? `${API_ORIGIN}/api/resources/${resourceId}/download` : '';
  });

  toggleSave(): void {
    const resourceId = this.resource().id;
    this.resourceLibrary.toggleSave(resourceId);
    this.syncResourceFromLibrary(resourceId);
  }

  downloadResource(event: MouseEvent): void {
    if (this.isDownloading() || !this.downloadUrl()) {
      event.preventDefault();
      return;
    }

    this.isDownloading.set(true);
    setTimeout(() => {
      this.isDownloading.set(false);
      this.downloaded.set(true);
      const resourceId = this.resource().id;
      this.resourceLibrary.incrementDownloads(resourceId);
      this.syncResourceFromLibrary(resourceId);
    }, 1200);
  }

  togglePreview(): void {
    this.showPreview.update((value) => !value);
    if (!this.showPreview()) this.previewLoaded.set(false);
  }

  onPreviewLoad(): void {
    this.previewLoaded.set(true);
  }

  private shouldUseGoogleViewer(): boolean {
    const url = this.resource().fileUrl;
    const format = this.resource().format.toLowerCase();

    return Boolean(
      url.startsWith('http')
      && !url.startsWith(`${API_ORIGIN}/`)
      && !format.includes('pdf')
      && !format.includes('imagen'),
    );
  }

  private syncResourceFromLibrary(resourceId: number): void {
    const resource = this.resourceLibrary.findResource(resourceId);

    if (resource) {
      this.resource.set(resource as ResourceDetail);
    }
  }
}
