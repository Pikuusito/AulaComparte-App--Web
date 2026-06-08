import { Component } from '@angular/core';
import { WelcomeHeaderComponent } from './components/welcome-header/welcome-header';
import { ResourceSearchComponent } from './components/resource-search/resource-search';
import { SavedResourcesComponent } from './components/saved-resources/saved-resources';
import { MyActivityComponent } from './components/my-activity/my-activity';

@Component({
  selector: 'app-panel-estudiante',
  standalone: true,
  imports: [WelcomeHeaderComponent, ResourceSearchComponent, SavedResourcesComponent, MyActivityComponent],
  templateUrl: './panel-estudiante.html',
  styleUrl: './panel-estudiante.css',
})
export class PanelEstudiante {}
