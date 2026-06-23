import { afterNextRender, Component, inject } from '@angular/core';
import { WelcomeHeaderComponent } from './components/welcome-header/welcome-header';
import { ResourceSearchComponent } from './components/resource-search/resource-search';
import { SavedResourcesComponent } from './components/saved-resources/saved-resources';
import { RecentResourcesComponent } from './components/recent-resources/recent-resources';
import { PublishResourceModalComponent } from './components/publish-resource-modal/publish-resource-modal';
import { ReportResourceModalComponent } from './components/report-resource-modal/report-resource-modal';
import { PanelScrollService } from './services/panel-scroll.service';
import { ResourceLibraryService } from '../../shared/services/resource-library.service';

@Component({
  selector: 'app-panel-usuario',
  standalone: true,
  imports: [WelcomeHeaderComponent, ResourceSearchComponent, SavedResourcesComponent, RecentResourcesComponent, PublishResourceModalComponent, ReportResourceModalComponent],
  templateUrl: './panel-usuario.html',
  styleUrl: './panel-usuario.css',
})
export class PanelUsuario {
  private readonly panelScroll = inject(PanelScrollService);
  private readonly resourceLibrary = inject(ResourceLibraryService);

  constructor() {
    afterNextRender(() => {
      this.resourceLibrary.loadCatalog();
      this.panelScroll.restoreIfRequested();
    });
  }
}
