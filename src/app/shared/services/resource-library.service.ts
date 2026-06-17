import { Injectable, computed, signal } from '@angular/core';
import { MOCK_RESOURCES } from '../data/mock-resources';
import { ResourceItem } from '../models/resource.model';

// Centraliza la biblioteca simulada de recursos para todas las features.
@Injectable({ providedIn: 'root' })
export class ResourceLibraryService {
  private readonly resourcesState = signal<ResourceItem[]>(MOCK_RESOURCES);

  readonly resources = computed(() => this.resourcesState());
  readonly savedResources = computed(() =>
    this.resourcesState().filter((resource) => resource.isSaved),
  );

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
        resource.id === resourceId ? { ...resource, downloads: resource.downloads + 1 } : resource,
      ),
    );
  }

  findResource(resourceId: number): ResourceItem | undefined {
    return this.resourcesState().find((resource) => resource.id === resourceId);
  }
}
