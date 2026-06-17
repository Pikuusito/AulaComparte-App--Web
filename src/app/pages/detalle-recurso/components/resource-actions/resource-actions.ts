import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { ResourceDetailService } from '../../services/resource-detail.service';

@Component({
  selector: 'app-resource-actions',
  standalone: true,
  imports: [NgClass],
  templateUrl: './resource-actions.html',
  styleUrl: './resource-actions.css',
})
export class ResourceActionsComponent {
  readonly detail = inject(ResourceDetailService);
}
