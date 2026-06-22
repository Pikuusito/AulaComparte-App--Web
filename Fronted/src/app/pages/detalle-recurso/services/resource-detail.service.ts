import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ResourceDetail, ResourceType } from '../../../shared/models/resource.model';
import { ResourceLibraryService } from '../../../shared/services/resource-library.service';

// Servicio para manejar la lógica de detalle de recurso, incluyendo carga, estado de descarga y vista previa. Se integra con (ResourceLibraryService) para sincronizar cambios como guardados o descargas.
@Injectable({ providedIn: 'root' })
export class ResourceDetailService {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly resourceLibrary = inject(ResourceLibraryService);
  private readonly currentResourceId = signal(1);

  // Cargamos el primer recurso de la biblioteca simulada por defecto.
  readonly resource = signal<ResourceDetail>(this.resourceLibrary.findResource(1) as ResourceDetail);

  readonly isDownloading = signal(false);
  readonly downloaded    = signal(false);
  readonly showPreview   = signal(false);
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
    const found = this.resourceLibrary.findResource(id);
    if (found) {
      this.currentResourceId.set(id);
      this.resource.set(found as ResourceDetail);
      // Reset state
      this.downloaded.set(false);
      this.showPreview.set(false);
      this.previewLoaded.set(false);
    }
  }

  readonly typeBadgeClasses = computed(() => {
    const classMap: Record<ResourceType, string> = {
      'Guía':         'bg-blue-100 text-blue-700 border-blue-200',
      'Apuntes':      'bg-amber-100 text-amber-700 border-amber-200',
      'Libro':        'bg-rose-100 text-rose-700 border-rose-200',
      'Ejercicios':   'bg-emerald-100 text-emerald-700 border-emerald-200',
      'Diapositivas': 'bg-purple-100 text-purple-700 border-purple-200',
      'Investigación':'bg-indigo-100 text-indigo-700 border-indigo-200',
    };
    return classMap[this.resource().type];
  });

  readonly resourceMetricLabel = computed(() => {
    const resource = this.resource();
    const normalizedFormat = resource.format.toLowerCase();

    if (normalizedFormat.includes('imagen') || normalizedFormat.includes('image')) {
      const imageCount = resource.imageCount;
      if (imageCount === undefined) {
        return 'Detectando imagenes...';
      }

      return `${imageCount} ${imageCount === 1 ? 'imagen' : 'imagenes'}`;
    }

    if (resource.pages === undefined) {
      return 'Detectando paginas...';
    }

    return `${resource.pages} ${resource.pages === 1 ? 'pagina' : 'paginas'}`;
  });

  readonly previewUrl = computed<SafeResourceUrl>(() => {
    const url = this.resource().fileUrl;
    
    // Si la URL es pública (http), usamos Google Docs Viewer (ideal para móviles o docs)
    if (url.startsWith('http')) {
      const encoded = encodeURIComponent(url);
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://docs.google.com/viewer?url=${encoded}&embedded=true`
      );
    }
    
    // Si es un archivo local, el navegador lo renderiza nativamente
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  toggleSave(): void {
    const resourceId = this.resource().id;
    this.resourceLibrary.toggleSave(resourceId);
    this.syncResourceFromLibrary(resourceId);
  }

  simulateDownload(): void {
    if (this.isDownloading()) return;
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
    this.showPreview.update(v => !v);
    if (!this.showPreview()) this.previewLoaded.set(false);
  }

  onPreviewLoad(): void {
    this.previewLoaded.set(true);
  }

  private syncResourceFromLibrary(resourceId: number): void {
    const resource = this.resourceLibrary.findResource(resourceId);

    if (resource) {
      this.resource.set(resource as ResourceDetail);
    }
  }
}
