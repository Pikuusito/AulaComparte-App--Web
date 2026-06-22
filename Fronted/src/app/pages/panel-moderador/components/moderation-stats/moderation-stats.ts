import { Component, inject } from '@angular/core';
import { ModerationDataService } from '../../services/moderation-data.service';

@Component({
  selector: 'app-moderation-stats',
  standalone: true,
  templateUrl: './moderation-stats.html',
  styleUrl: './moderation-stats.css',
})
export class ModerationStatsComponent {
  readonly moderationData = inject(ModerationDataService);
}
