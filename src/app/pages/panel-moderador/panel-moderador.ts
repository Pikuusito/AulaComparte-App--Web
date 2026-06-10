import { Component } from '@angular/core';
import { ModerationStatsComponent } from './components/moderation-stats/moderation-stats';
import { ModeratorWelcomeComponent } from './components/moderator-welcome/moderator-welcome';
import { PendingResourcesComponent } from './components/pending-resources/pending-resources';
import { ReviewResourceModalComponent } from './components/review-resource-modal/review-resource-modal';

@Component({
  selector: 'app-panel-moderador',
  standalone: true,
  imports: [
    ModeratorWelcomeComponent,
    ModerationStatsComponent,
    PendingResourcesComponent,
    ReviewResourceModalComponent,
  ],
  templateUrl: './panel-moderador.html',
  styleUrl: './panel-moderador.css',
})
export class PanelModerador {}
