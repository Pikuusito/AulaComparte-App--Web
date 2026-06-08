import { Component, computed, inject, signal } from '@angular/core';
import { PanelUiService } from '../../services/panel-ui.service';

type ResourceType = 'Libro' | 'Apuntes' | 'Guía' | 'Ejercicios' | 'Diapositivas' | 'Examen';
type EducationLevel = 'Primaria' | 'Secundaria' | 'Preuniversitario' | 'Universitario';
type ResourceFormat = 'PDF' | 'Imagen' | 'Documento' | 'Enlace' | 'Material físico';

@Component({
  selector: 'app-publish-resource-modal',
  standalone: true,
  templateUrl: './publish-resource-modal.html',
  styleUrl: './publish-resource-modal.css',
})
export class PublishResourceModalComponent {
  readonly panelUi = inject(PanelUiService);

  readonly resourceTypes: ResourceType[] = ['Libro', 'Apuntes', 'Guía', 'Ejercicios', 'Diapositivas', 'Examen'];
  readonly educationLevels: EducationLevel[] = ['Primaria', 'Secundaria', 'Preuniversitario', 'Universitario'];
  readonly formats: ResourceFormat[] = ['PDF', 'Imagen', 'Documento', 'Enlace', 'Material físico'];

  readonly title = signal('');
  readonly description = signal('');
  readonly resourceType = signal<ResourceType>('Guía');
  readonly subject = signal('');
  readonly level = signal<EducationLevel>('Secundaria');
  readonly author = signal('');
  readonly format = signal<ResourceFormat>('PDF');
  readonly resourceLink = signal('');
  readonly fileName = signal('');
  readonly hasPermission = signal(false);
  readonly isSubmitting = signal(false);
  readonly wasPublished = signal(false);
  readonly feedback = signal('');

  readonly requiresLink = computed(() => this.format() === 'Enlace');

  readonly canSubmit = computed(() =>
    this.title().trim().length > 0 &&
    this.description().trim().length > 0 &&
    this.subject().trim().length > 0 &&
    this.author().trim().length > 0 &&
    this.hasPermission() &&
    (!this.requiresLink() || this.isValidLink(this.resourceLink()))
  );

  close(): void {
    this.panelUi.closePublishResource();
    this.isSubmitting.set(false);
    this.feedback.set('');
  }

  updateTitle(target: EventTarget | null): void {
    this.title.set(this.getTextValue(target));
  }

  updateDescription(target: EventTarget | null): void {
    this.description.set(this.getTextValue(target));
  }

  updateSubject(target: EventTarget | null): void {
    this.subject.set(this.getTextValue(target));
  }

  updateAuthor(target: EventTarget | null): void {
    this.author.set(this.getTextValue(target));
  }

  updateResourceLink(target: EventTarget | null): void {
    this.resourceLink.set(this.getTextValue(target));
  }

  updateCheckbox(target: EventTarget | null): void {
    const input = target as HTMLInputElement | null;
    this.hasPermission.set(input?.checked ?? false);
  }

  updateResourceType(target: EventTarget | null): void {
    const select = target as HTMLSelectElement | null;
    this.resourceType.set((select?.value as ResourceType | undefined) ?? 'Guía');
  }

  updateLevel(target: EventTarget | null): void {
    const select = target as HTMLSelectElement | null;
    this.level.set((select?.value as EducationLevel | undefined) ?? 'Secundaria');
  }

  updateFormat(target: EventTarget | null): void {
    const select = target as HTMLSelectElement | null;
    this.format.set((select?.value as ResourceFormat | undefined) ?? 'PDF');
    this.feedback.set('');
  }

  updateFile(target: EventTarget | null): void {
    const input = target as HTMLInputElement | null;
    this.fileName.set(input?.files?.item(0)?.name ?? '');
  }

  submit(event: Event): void {
    event.preventDefault();
    this.feedback.set('');

    if (!this.canSubmit()) {
      this.feedback.set('Completa los campos obligatorios y confirma los permisos del material.');
      return;
    }

    this.isSubmitting.set(true);
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.wasPublished.set(true);
      this.feedback.set('Recurso preparado para publicación.');
    }, 520);
  }

  resetForm(): void {
    this.title.set('');
    this.description.set('');
    this.resourceType.set('Guía');
    this.subject.set('');
    this.level.set('Secundaria');
    this.author.set('');
    this.format.set('PDF');
    this.resourceLink.set('');
    this.fileName.set('');
    this.hasPermission.set(false);
    this.isSubmitting.set(false);
    this.wasPublished.set(false);
    this.feedback.set('');
  }

  private isValidLink(value: string): boolean {
    return /^https?:\/\/.+\..+/.test(value.trim());
  }

  private getTextValue(target: EventTarget | null): string {
    const input = target as HTMLInputElement | HTMLTextAreaElement | null;
    return input?.value ?? '';
  }
}
