import { afterNextRender, Component, inject } from '@angular/core';
import { WelcomeHeaderComponent } from './components/welcome-header/welcome-header';
import { ResourceSearchComponent } from './components/resource-search/resource-search';
import { SavedResourcesComponent } from './components/saved-resources/saved-resources';
import { RecentResourcesComponent } from './components/recent-resources/recent-resources';
import { PublishResourceModalComponent } from './components/publish-resource-modal/publish-resource-modal';
import { PanelScrollService } from './services/panel-scroll.service';

@Component({
  selector: 'app-panel-usuario',
  standalone: true,
  imports: [WelcomeHeaderComponent, ResourceSearchComponent, SavedResourcesComponent, RecentResourcesComponent, PublishResourceModalComponent],
  templateUrl: './panel-usuario.html',
  styleUrl: './panel-usuario.css',
})
export class PanelUsuario {
  private readonly panelScroll = inject(PanelScrollService);

  constructor() {
    afterNextRender(() => {
      this.panelScroll.restoreIfRequested();
    });
  }
}
