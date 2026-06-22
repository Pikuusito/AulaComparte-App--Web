import { Injectable, signal } from '@angular/core';

// Servicio para gestionar el estado de la interfaz del panel de usuario, como la apertura y cierre del modal de publicación de recursos
@Injectable({ providedIn: 'root' })
export class PanelUiService {
  readonly isPublishResourceOpen = signal(false);

  openPublishResource(): void {
    this.isPublishResourceOpen.set(true);
  }

  closePublishResource(): void {
    this.isPublishResourceOpen.set(false);
  }
}
