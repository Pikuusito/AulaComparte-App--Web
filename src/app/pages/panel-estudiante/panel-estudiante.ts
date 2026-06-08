import { Component } from '@angular/core';
import { WelcomeHeaderComponent } from './components/welcome-header/welcome-header';
import { ResourceSearchComponent } from './components/resource-search/resource-search';
import { SavedResourcesComponent } from './components/saved-resources/saved-resources';
import { RecentResourcesComponent } from './components/recent-resources/recent-resources';
import { PublishResourceModalComponent } from './components/publish-resource-modal/publish-resource-modal';

@Component({
  selector: 'app-panel-estudiante',
  standalone: true,
  imports: [WelcomeHeaderComponent, ResourceSearchComponent, SavedResourcesComponent, RecentResourcesComponent, PublishResourceModalComponent],
  templateUrl: './panel-estudiante.html',
  styleUrl: './panel-estudiante.css',
})
export class PanelEstudiante {}
