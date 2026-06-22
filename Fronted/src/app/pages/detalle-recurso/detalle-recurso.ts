import { Component, Input, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ResourceHeaderComponent } from './components/resource-header/resource-header';
import { ResourceInfoComponent } from './components/resource-info/resource-info';
import { ResourcePreviewComponent } from './components/resource-preview/resource-preview';
import { ResourceActionsComponent } from './components/resource-actions/resource-actions';
import { ResourceDetailService } from './services/resource-detail.service';

@Component({
  selector: 'app-detalle-recurso',
  standalone: true,
  imports: [RouterLink, ResourceHeaderComponent, ResourceInfoComponent, ResourcePreviewComponent, ResourceActionsComponent],
  templateUrl: './detalle-recurso.html',
  styleUrl: './detalle-recurso.css',
})
export class DetalleRecurso implements OnInit {
  private detailService = inject(ResourceDetailService);

  @Input() set id(value: string) {
    if (value) {
      this.detailService.loadResource(Number(value));
    }
  }

  ngOnInit(): void {
  }
}
