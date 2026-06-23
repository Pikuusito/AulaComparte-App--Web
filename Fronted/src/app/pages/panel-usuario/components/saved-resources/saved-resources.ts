import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ResourceItem, ResourceType } from '../../../../shared/models/resource.model';
import { ResourceLibraryService } from '../../../../shared/services/resource-library.service';
import { PanelScrollService } from '../../services/panel-scroll.service';

@Component({
  selector: 'app-saved-resources',
  standalone: true,
  imports: [NgClass, RouterLink],
  templateUrl: './saved-resources.html',
  styleUrl: './saved-resources.css',
})
export class SavedResourcesComponent {
  private readonly resourceLibrary = inject(ResourceLibraryService);
  private readonly panelScroll = inject(PanelScrollService);
  readonly savedResources = this.resourceLibrary.savedResources;
  readonly reportingIds = this.resourceLibrary.reportingIds;

  getTypeBadgeClasses(type: ResourceItem['type']): string {
    const classMap: Record<ResourceType, string> = {
      Guía: 'bg-blue-100 text-blue-700 border-blue-200',
      Apuntes: 'bg-amber-100 text-amber-700 border-amber-200',
      Libro: 'bg-rose-100 text-rose-700 border-rose-200',
      Ejercicios: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      Diapositivas: 'bg-purple-100 text-purple-700 border-purple-200',
      Examen: 'bg-red-100 text-red-700 border-red-200',
      Investigación: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    };

    return classMap[type];
  }

  toggleSave(resourceId: number): void {
    this.resourceLibrary.toggleSave(resourceId);
  }

  openReportDialog(resource: ResourceItem): void {
    this.resourceLibrary.openReportDialog(resource);
  }

  rememberPanelScroll(): void {
    this.panelScroll.saveCurrentPosition();
  }
}
