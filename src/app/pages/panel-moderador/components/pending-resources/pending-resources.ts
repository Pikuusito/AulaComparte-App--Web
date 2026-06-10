import { Component, inject } from '@angular/core';
import { ModerationDataService, ModerationStatus } from '../../services/moderation-data.service';

@Component({
  selector: 'app-pending-resources',
  standalone: true,
  templateUrl: './pending-resources.html',
  styleUrl: './pending-resources.css',
})
export class PendingResourcesComponent {
  readonly moderationData = inject(ModerationDataService);

  getStatusTextClasses(status: ModerationStatus): string {
    const classes: Record<ModerationStatus, string> = {
      Pendiente: 'table-text-icon status-pending',
      'En revisión': 'table-text-icon status-reviewing',
      Aprobado: 'table-text-icon status-approved',
      Rechazado: 'table-text-icon status-rejected',
      Reportado: 'table-text-icon status-reported',
    };

    return classes[status];
  }
}
