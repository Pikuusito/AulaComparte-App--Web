import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PanelUiService } from '../../../pages/panel-estudiante/services/panel-ui.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private router = inject(Router);
  private panelUi = inject(PanelUiService);

  get isStudentPanel(): boolean {
    return this.router.url.includes('/panel-estudiante');
  }

  openPublishResource(): void {
    this.panelUi.openPublishResource();
  }
}
