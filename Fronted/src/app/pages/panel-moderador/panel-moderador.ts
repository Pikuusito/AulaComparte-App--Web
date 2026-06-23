import { Component, inject } from '@angular/core';
import { ModerationStatsComponent } from './components/moderation-stats/moderation-stats';
import { ModeratorWelcomeComponent } from './components/moderator-welcome/moderator-welcome';
import { PendingResourcesComponent } from './components/pending-resources/pending-resources';
import { ResourceDetailsModalComponent } from './components/resource-details-modal/resource-details-modal';
import { ModerationDataService } from './services/moderation-data.service';

@Component({
  selector: 'app-panel-moderador',
  standalone: true,
  imports: [
    ModeratorWelcomeComponent,
    ModerationStatsComponent,
    PendingResourcesComponent,
    ResourceDetailsModalComponent,
  ],
  templateUrl: './panel-moderador.html',
  styleUrl: './panel-moderador.css',
})
export class PanelModerador {
  readonly moderationData = inject(ModerationDataService);
}
