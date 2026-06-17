import { Injectable, computed, signal } from '@angular/core';
import { MOCK_MODERATION_RESOURCES } from '../data/mock-moderation-resources';
import {
  ModerationResource,
  ModerationStats,
} from '../models/moderation.model';

// Gestiona el estado de moderacion y consume datos simulados de la feature.
@Injectable({ providedIn: 'root' })
export class ModerationDataService {
  private readonly resourcesState = signal<ModerationResource[]>(MOCK_MODERATION_RESOURCES);

  readonly resources = computed(() => this.resourcesState());

  readonly reviewableResources = computed(() => this.resourcesState());

  readonly selectedResource = signal<ModerationResource | null>(null);

  readonly stats = computed<ModerationStats>(() => {
    const resources = this.resourcesState();

    return {
      pending: resources.filter((resource) => resource.status === 'Pendiente').length,
      approvedToday: resources.filter((resource) => resource.status === 'Aprobado').length + 6,
      rejected: resources.filter((resource) => resource.status === 'Rechazado').length + 2,
      reports: resources.filter((resource) => resource.status === 'Reportado').length,
    };
  });

  openResourceDetails(resourceId: number): void {
    this.selectedResource.set(
      this.resourcesState().find((resource) => resource.id === resourceId) ?? null,
    );
  }

  closeResourceDetails(): void {
    this.selectedResource.set(null);
  }
}
