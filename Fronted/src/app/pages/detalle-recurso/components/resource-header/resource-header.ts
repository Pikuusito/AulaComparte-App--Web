import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { ResourceDetailService } from '../../services/resource-detail.service';

@Component({
  selector: 'app-resource-header',
  standalone: true,
  imports: [NgClass],
  templateUrl: './resource-header.html',
  styleUrl: './resource-header.css',
})
export class ResourceHeaderComponent {
  readonly detail = inject(ResourceDetailService);
}
