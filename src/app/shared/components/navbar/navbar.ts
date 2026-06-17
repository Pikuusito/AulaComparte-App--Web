import { Component, inject, computed } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { PanelUiService } from '../../../pages/panel-usuario/services/panel-ui.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly panelUi = inject(PanelUiService);
  private readonly router = inject(Router);
  readonly auth = inject(AuthService);
  readonly profileRoute = computed(() => this.auth.isModerador() ? '/panel-moderador' : '/panel-usuario');

  get isHome(): boolean {
    return this.router.url === '/' || this.router.url === '';
  }

  openPublishResource(): void {
    this.panelUi.openPublishResource();
  }
}
