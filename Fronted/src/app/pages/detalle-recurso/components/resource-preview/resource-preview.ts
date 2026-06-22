import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { ResourceDetailService } from '../../services/resource-detail.service';

@Component({
  selector: 'app-resource-preview',
  standalone: true,
  imports: [],
  templateUrl: './resource-preview.html',
  styleUrl: './resource-preview.css',
})
export class ResourcePreviewComponent {
  readonly detail = inject(ResourceDetailService);
}
