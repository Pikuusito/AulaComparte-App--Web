import { NgClass } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ResourceItem, ResourceType } from '../../../../shared/models/resource.model';
import { ResourceLibraryService } from '../../../../shared/services/resource-library.service';
import { PanelScrollService } from '../../services/panel-scroll.service';

const VISIBLE_RECENT_RESOURCES = 8;

@Component({
  selector: 'app-recent-resources',
  standalone: true,
  imports: [NgClass, RouterLink],
  templateUrl: './recent-resources.html',
  styleUrl: './recent-resources.css',
})
export class RecentResourcesComponent {
  private readonly resourceLibrary = inject(ResourceLibraryService);
  private readonly panelScroll = inject(PanelScrollService);

  readonly resources = this.resourceLibrary.resources;
  readonly isLoading = this.resourceLibrary.isLoading;
  readonly loadError = this.resourceLibrary.loadError;
  readonly reportFeedback = this.resourceLibrary.reportFeedback;
  readonly reportError = this.resourceLibrary.reportError;
  readonly reportingIds = this.resourceLibrary.reportingIds;
  readonly isLibraryOpen = signal(false);
  readonly visibleResources = computed(() => this.resources().slice(0, VISIBLE_RECENT_RESOURCES));
  readonly libraryResources = computed(() => this.resources().slice(VISIBLE_RECENT_RESOURCES));
  readonly hiddenResourceCount = computed(() => this.libraryResources().length);
  readonly hasMoreResources = computed(() => this.hiddenResourceCount() > 0);

  getTypeBadgeClasses(type: ResourceItem['type']): string {
    const classes: Record<ResourceType, string> = {
      Guía: 'bg-blue-100 text-blue-700 border-blue-200',
      Apuntes: 'bg-amber-100 text-amber-700 border-amber-200',
      Libro: 'bg-rose-100 text-rose-700 border-rose-200',
      Ejercicios: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      Diapositivas: 'bg-purple-100 text-purple-700 border-purple-200',
      Examen: 'bg-red-100 text-red-700 border-red-200',
      Investigación: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    };

    return classes[type];
  }

  toggleSave(resourceId: number): void {
    this.resourceLibrary.toggleSave(resourceId);
  }

  openReportDialog(resource: ResourceItem): void {
    this.resourceLibrary.openReportDialog(resource);
  }

  openLibrary(): void {
    if (!this.hasMoreResources()) {
      return;
    }

    this.isLibraryOpen.set(true);
  }

  closeLibrary(): void {
    this.isLibraryOpen.set(false);
  }

  rememberPanelScroll(): void {
    this.panelScroll.saveCurrentPosition();
  }

  retryLoad(): void {
    this.resourceLibrary.loadCatalog();
  }
}
