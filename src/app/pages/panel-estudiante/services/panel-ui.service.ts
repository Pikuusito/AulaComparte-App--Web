import { Injectable, signal } from '@angular/core';

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
