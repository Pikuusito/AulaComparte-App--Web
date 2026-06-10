import { NgClass } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import {
  ModerationDataService,
  ModerationResource,
  ModerationResourceFormat,
  ModerationResourceType,
} from '../../services/moderation-data.service';

@Component({
  selector: 'app-review-resource-modal',
  standalone: true,
  imports: [NgClass],
  templateUrl: './review-resource-modal.html',
  styleUrl: './review-resource-modal.css',
})
export class ReviewResourceModalComponent {
  readonly moderationData = inject(ModerationDataService);

  readonly isEducational = signal(false);
  readonly hasClearDescription = signal(false);
  readonly isSafeContent = signal(false);
  readonly respectsPrivacy = signal(false);
  readonly permissionChecked = signal(false);

  readonly canApprove = computed(
    () =>
      this.isEducational() &&
      this.hasClearDescription() &&
      this.isSafeContent() &&
      this.respectsPrivacy() &&
      this.permissionChecked(),
  );

  close(): void {
    this.resetChecklist();
    this.moderationData.closeReview();
  }

  approve(resource: ModerationResource): void {
    if (!this.canApprove()) {
      return;
    }

    this.moderationData.approveResource(resource.id);
    this.resetChecklist();
  }

  reject(resource: ModerationResource): void {
    this.moderationData.rejectResource(resource.id);
    this.resetChecklist();
  }

  updateSignal(target: EventTarget | null, signalRef: { set(value: boolean): void }): void {
    const input = target as HTMLInputElement | null;
    signalRef.set(input?.checked ?? false);
  }

  getTypeBadgeClasses(type: ModerationResourceType): string {
    const classes: Record<ModerationResourceType, string> = {
      Libro: 'bg-rose-50 text-rose-700 ring-rose-100',
      Apuntes: 'bg-amber-50 text-amber-700 ring-amber-100',
      Guía: 'bg-blue-50 text-blue-700 ring-blue-100',
      Ejercicios: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
      Diapositivas: 'bg-purple-50 text-purple-700 ring-purple-100',
      Examen: 'bg-red-50 text-red-700 ring-red-100',
    };

    return classes[type];
  }

  getFormatBadgeClasses(format: ModerationResourceFormat): string {
    const classes: Record<ModerationResourceFormat, string> = {
      PDF: 'bg-red-600 text-white ring-red-500/30',
      Imagen: 'bg-cyan-600 text-white ring-cyan-500/30',
      Documento: 'bg-slate-700 text-white ring-slate-500/30',
      Enlace: 'bg-main-600 text-white ring-main-500/30',
      'Material físico': 'bg-orange-500 text-white ring-orange-400/30',
    };

    return classes[format];
  }

  private resetChecklist(): void {
    this.isEducational.set(false);
    this.hasClearDescription.set(false);
    this.isSafeContent.set(false);
    this.respectsPrivacy.set(false);
    this.permissionChecked.set(false);
  }
}
