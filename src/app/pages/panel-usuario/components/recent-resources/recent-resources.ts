import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ResourceItem } from '../../../../shared/models/resource.model';
import { ResourceLibraryService } from '../../../../shared/services/resource-library.service';
import { PanelScrollService } from '../../services/panel-scroll.service';

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

  getTypeBadgeClasses(type: ResourceItem['type']): string {
    if (!type) return '';
    const classes: Record<string, string> = {
      'Guía': 'bg-blue-100 text-blue-700 border-blue-200',
      'Apuntes': 'bg-amber-100 text-amber-700 border-amber-200',
      'Libro': 'bg-rose-100 text-rose-700 border-rose-200',
      'Ejercicios': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'Diapositivas': 'bg-purple-100 text-purple-700 border-purple-200',
      'Investigación': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    };

    return classes[type] || '';
  }

  toggleSave(resourceId: number): void {
    this.resourceLibrary.toggleSave(resourceId);
  }

  rememberPanelScroll(): void {
    this.panelScroll.saveCurrentPosition();
  }
}
