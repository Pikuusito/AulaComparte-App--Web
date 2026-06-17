import { Component, inject } from '@angular/core';
import { ResourceDetailService } from '../../services/resource-detail.service';

@Component({
  selector: 'app-resource-info',
  standalone: true,
  templateUrl: './resource-info.html',
  styleUrl: './resource-info.css',
})
export class ResourceInfoComponent {
  readonly detail = inject(ResourceDetailService);
}
