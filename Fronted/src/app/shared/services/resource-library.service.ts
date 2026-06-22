import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { MOCK_RESOURCES } from '../data/mock-resources';
import { ResourceItem } from '../models/resource.model';
import { ResourceMetadataService } from './resource-metadata.service';

// Centraliza la biblioteca simulada de recursos para todas las features.
@Injectable({ providedIn: 'root' })
export class ResourceLibraryService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly resourceMetadata = inject(ResourceMetadataService);
  private readonly resourcesState = signal<ResourceItem[]>(MOCK_RESOURCES);

  readonly resources = computed(() => this.resourcesState());
  readonly savedResources = computed(() =>
    this.resourcesState().filter((resource) => resource.isSaved),
  );

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      void this.detectMockResourceMetadata();
    }
  }

  toggleSave(resourceId: number): void {
    this.resourcesState.update((resources) =>
      resources.map((resource) =>
        resource.id === resourceId ? { ...resource, isSaved: !resource.isSaved } : resource,
      ),
    );
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

  // Método privado para detectar metadatos de recursos simulados (PDFs e imágenes) y actualizar el estado de la biblioteca.
  private async detectMockResourceMetadata(): Promise<void> {
    const resources = this.resourcesState();

    await Promise.all(
      resources.map(async (resource) => {
        const metadata = await this.resourceMetadata.detectFromUrl(resource.fileUrl, resource.format);

        if (metadata.pages === undefined && metadata.imageCount === undefined) {
          return;
        }

        this.resourcesState.update((currentResources) =>
          currentResources.map((currentResource) =>
            currentResource.id === resource.id ? { ...currentResource, ...metadata } : currentResource,
          ),
        );
      }),
    );
  }
}
