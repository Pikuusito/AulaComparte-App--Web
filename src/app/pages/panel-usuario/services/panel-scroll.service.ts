import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

// Servicio que permite guardar la posición actual del scroll y restaurarla al volver al panel.
@Injectable({ providedIn: 'root' })
export class PanelScrollService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private savedScrollY = 0;
  private shouldRestore = false;

  saveCurrentPosition(): void {
    if (!this.isBrowser) {
      return;
    }

    this.savedScrollY = this.document.defaultView?.scrollY ?? 0;
    this.shouldRestore = true;
  }

  restoreIfRequested(): void {
    if (!this.isBrowser || !this.shouldRestore) {
      return;
    }

    this.shouldRestore = false;
    this.document.defaultView?.scrollTo({
      top: this.savedScrollY,
      left: 0,
      behavior: 'instant',
    });
  }
}
