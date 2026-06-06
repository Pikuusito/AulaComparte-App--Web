import { Component } from '@angular/core';
import { WelcomeHeaderComponent } from './components/welcome-header/welcome-header';
import { ResourceSearchComponent } from './components/resource-search/resource-search';
import { RecentResourcesComponent } from './components/recent-resources/recent-resources';
import { MyActivityComponent } from './components/my-activity/my-activity';

@Component({
  selector: 'app-panel-estudiante',
  standalone: true,
  imports: [WelcomeHeaderComponent, ResourceSearchComponent, RecentResourcesComponent, MyActivityComponent],
  templateUrl: './panel-estudiante.html',
  styleUrl: './panel-estudiante.css',
})
export class PanelEstudiante {}
