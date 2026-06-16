import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, effect, inject } from '@angular/core';
import {
  ModerationDataService,
  ModerationResourceType,
} from '../../services/moderation-data.service';

@Component({
  selector: 'app-resource-details-modal',
  standalone: true,
  templateUrl: './resource-details-modal.html',
  styleUrl: './resource-details-modal.css',
})
export class ResourceDetailsModalComponent {
  readonly moderationData = inject(ModerationDataService);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly lockPageScroll = effect((onCleanup) => {
    if (!isPlatformBrowser(this.platformId) || !this.moderationData.selectedResource()) {
      return;
    }

    const { body, documentElement } = this.document;
    const scrollY = window.scrollY;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
    const previousBodyStyles = {
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };
    const previousHtmlOverflow = documentElement.style.overflow;

    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    documentElement.style.overflow = 'hidden';

    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    onCleanup(() => {
      body.style.overflow = previousBodyStyles.overflow;
      body.style.paddingRight = previousBodyStyles.paddingRight;
      body.style.position = previousBodyStyles.position;
      body.style.top = previousBodyStyles.top;
      body.style.width = previousBodyStyles.width;
      documentElement.style.overflow = previousHtmlOverflow;
      window.scrollTo({ top: scrollY, left: 0, behavior: 'instant' });
    });
  });

  closeFromBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  close(): void {
    this.moderationData.closeResourceDetails();
  }

  getResourceTypeIconClasses(type: ModerationResourceType): string {
    const classes: Record<ModerationResourceType, string> = {
      Libro: 'resource-type-icon resource-type-book',
      Apuntes: 'resource-type-icon resource-type-notes',
      Guía: 'resource-type-icon resource-type-guide',
      Ejercicios: 'resource-type-icon resource-type-exercises',
      Diapositivas: 'resource-type-icon resource-type-slides',
      Examen: 'resource-type-icon resource-type-exam',
    };

    return classes[type];
  }

  getResourceTypeBadgeClasses(type: ModerationResourceType): string {
    const classes: Record<ModerationResourceType, string> = {
      Libro: 'resource-type-badge resource-type-book-badge',
      Apuntes: 'resource-type-badge resource-type-notes-badge',
      Guía: 'resource-type-badge resource-type-guide-badge',
      Ejercicios: 'resource-type-badge resource-type-exercises-badge',
      Diapositivas: 'resource-type-badge resource-type-slides-badge',
      Examen: 'resource-type-badge resource-type-exam-badge',
    };

    return classes[type];
  }
}
