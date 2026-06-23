import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { finalize } from 'rxjs';
import {
  ApiEducationLevel,
  ApiResourceFormat,
  ApiResourceType,
  ResourceCreateRequest,
} from '../../../../shared/models/resource-api.model';
import { ResourceApiService } from '../../../../shared/services/resource-api.service';
import { ResourceMetadataService } from '../../../../shared/services/resource-metadata.service';
import { PanelUiService } from '../../services/panel-ui.service';

type ResourceType = 'Libro' | 'Apuntes' | 'Guía' | 'Ejercicios' | 'Diapositivas' | 'Examen';
type EducationLevel = 'Primaria' | 'Secundaria' | 'Preuniversitario' | 'Universitario';
type ResourceFormat = 'PDF' | 'Imagen' | 'Documento' | 'Enlace' | 'Material físico';
type WizardStepValue = 1 | 2 | 3;

// Define cada paso del formulario tipo wizard.
interface WizardStep {
  value: WizardStepValue;
  eyebrow: string;
  label: string;
}

@Component({
  selector: 'app-publish-resource-modal',
  standalone: true,
  templateUrl: './publish-resource-modal.html',
  styleUrl: './publish-resource-modal.css',
})
export class PublishResourceModalComponent implements OnDestroy {
  // Servicios e inyecciones para controlar el modal y mantener compatibilidad con SSR.
  readonly panelUi = inject(PanelUiService);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly renderer = inject(Renderer2);
  private readonly resourceMetadata = inject(ResourceMetadataService);
  private readonly resourceApi = inject(ResourceApiService);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly resourceFileInput = viewChild<ElementRef<HTMLInputElement>>('resourceFileInput');

  // Opciones que aparecen en los selects del formulario.
  readonly resourceTypes: ResourceType[] = [
    'Libro',
    'Apuntes',
    'Guía',
    'Ejercicios',
    'Diapositivas',
    'Examen',
  ];
  readonly educationLevels: EducationLevel[] = [
    'Primaria',
    'Secundaria',
    'Preuniversitario',
    'Universitario',
  ];
  readonly formats: ResourceFormat[] = ['PDF', 'Imagen', 'Documento', 'Enlace', 'Material físico'];
  readonly steps: readonly WizardStep[] = [
    { value: 1, eyebrow: 'Paso 1', label: 'Información' },
    { value: 2, eyebrow: 'Paso 2', label: 'Recurso' },
    { value: 3, eyebrow: 'Paso 3', label: 'Confirmación' },
  ];

  readonly currentStep = signal<WizardStepValue>(1);

  // Estado editable del formulario.
  readonly title = signal('');
  readonly description = signal('');
  readonly resourceType = signal<ResourceType>('Guía');
  readonly subject = signal('');
  readonly level = signal<EducationLevel>('Secundaria');
  readonly author = signal('');
  readonly format = signal<ResourceFormat>('PDF');
  readonly resourceLink = signal('');
  readonly fileName = signal('');
  readonly selectedFile = signal<File | null>(null);
  readonly detectedPages = signal<number | null>(null);
  readonly detectedImageCount = signal<number | null>(null);
  readonly metadataFeedback = signal('');
  readonly materialReference = signal('');
  readonly hasPermission = signal(false);
  readonly isSubmitting = signal(false);
  readonly wasPublished = signal(false);
  readonly feedback = signal('');
  readonly hasSubmitError = signal(false);
  readonly showErrors = signal(false);

  // Estados calculados para saber qué campos mostrar y qué pasos están completos.
  readonly requiresLink = computed(() => this.format() === 'Enlace');
  readonly isPhysicalMaterial = computed(() => this.format() === 'Material físico');
  readonly stepOneComplete = computed(
    () =>
      this.title().trim().length > 0 &&
      this.subject().trim().length > 0 &&
      this.author().trim().length > 0,
  );

  readonly stepTwoComplete = computed(
    () => this.description().trim().length > 0 && this.attachmentReady(),
  );

  readonly attachmentReady = computed(() => {
    // La validación del recurso cambia según el formato elegido.
    if (this.requiresLink()) {
      return this.isValidLink(this.resourceLink());
    }

    if (this.isPhysicalMaterial()) {
      return this.materialReference().trim().length > 0;
    }

    return this.fileName().trim().length > 0;
  });

  readonly canSubmit = computed(
    () => this.stepOneComplete() && this.stepTwoComplete() && this.hasPermission(),
  );

  readonly progressPercentage = computed(() => {
    // La barra superior avanza según los pasos completados.
    const completedSteps = [
      this.stepOneComplete(),
      this.stepTwoComplete(),
      this.hasPermission(),
    ].filter(Boolean).length;
    return `${(completedSteps / this.steps.length) * 100}%`;
  });

  readonly attachmentLabel = computed(() => {
    // Texto que se muestra en la vista previa según el tipo de recurso adjunto.
    if (this.requiresLink()) {
      return this.resourceLink().trim() || 'Enlace pendiente';
    }

    if (this.isPhysicalMaterial()) {
      return this.materialReference().trim() || 'Referencia pendiente';
    }

    return this.fileName().trim() || 'Archivo pendiente';
  });

  readonly detectedMetadataLabel = computed(() => {
    if (this.format() === 'PDF' && this.detectedPages() !== null) {
      const pages = this.detectedPages();
      return `${pages} ${pages === 1 ? 'pagina' : 'paginas'}`;
    }

    if (this.format() === 'Imagen' && this.detectedImageCount() !== null) {
      const images = this.detectedImageCount();
      return `${images} ${images === 1 ? 'imagen' : 'imagenes'}`;
    }

    return '';
  });

  readonly formatHelperText = computed(() => {
    if (this.requiresLink()) {
      return 'Comparte un enlace público y verificable que empiece con http:// o https://.';
    }

    if (this.isPhysicalMaterial()) {
      return 'Describe cómo se coordina el préstamo, donación o entrega del material físico.';
    }

    return 'Adjunta un archivo educativo en el formato seleccionado para que pueda revisarse.';
  });

  readonly acceptedFileTypes = computed(() => {
    if (this.format() === 'PDF') {
      return 'application/pdf,.pdf';
    }
    if (this.format() === 'Imagen') {
      return 'image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif';
    }
    return '.doc,.docx,.odt,.ods,.odp,.ppt,.pptx,.xls,.xlsx';
  });

  readonly missingRequirements = computed(() => {
    // Lista corta de pendientes que aparece en el paso de confirmación.
    const requirements: string[] = [];

    if (!this.stepOneComplete()) {
      requirements.push('Completa título, curso y autor.');
    }

    if (!this.stepTwoComplete()) {
      requirements.push('Agrega descripción y recurso.');
    }

    if (!this.hasPermission()) {
      requirements.push('Confirma los permisos de uso.');
    }

    return requirements;
  });

  readonly titleError = computed(() =>
    this.showErrors() && this.title().trim().length === 0
      ? 'Agrega un título claro para el recurso.'
      : '',
  );

  readonly subjectError = computed(() =>
    this.showErrors() && this.subject().trim().length === 0
      ? 'Indica el curso o área del material.'
      : '',
  );

  readonly authorError = computed(() =>
    this.showErrors() && this.author().trim().length === 0
      ? 'Indica quién comparte o creó el material.'
      : '',
  );

  readonly descriptionError = computed(() =>
    this.showErrors() && this.description().trim().length === 0
      ? 'Describe el contenido y cómo ayuda a estudiar.'
      : '',
  );

  readonly attachmentError = computed(() => {
    if (!this.showErrors() || this.attachmentReady()) {
      return '';
    }

    if (this.requiresLink()) {
      return 'Ingresa un enlace válido que empiece con http:// o https://.';
    }

    if (this.isPhysicalMaterial()) {
      return 'Agrega una referencia o forma de coordinación para el material físico.';
    }

    return 'Selecciona un archivo para adjuntar al recurso.';
  });

  readonly permissionError = computed(() =>
    this.showErrors() && !this.hasPermission()
      ? 'Confirma que puedes compartir este material.'
      : '',
  );

  constructor() {
    effect(() => {
      if (!this.isBrowser) {
        return;
      }

      // Evita que la página de fondo se desplace mientras el modal está abierto.
      if (this.panelUi.isPublishResourceOpen()) {
        this.renderer.setStyle(this.document.body, 'overflow', 'hidden');
      } else {
        this.renderer.removeStyle(this.document.body, 'overflow');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      this.renderer.removeStyle(this.document.body, 'overflow');
    }
  }

  close(): void {
    // Cerrar con X, Escape o fondo conserva el progreso del formulario.
    this.panelUi.closePublishResource();
    this.isSubmitting.set(false);
    this.feedback.set('');
    this.hasSubmitError.set(false);
    this.showErrors.set(false);
  }

  cancel(event?: Event): void {
    // Cancelar sí borra todo el progreso antes de cerrar.
    event?.preventDefault();
    event?.stopPropagation();
    this.panelUi.closePublishResource();
    this.resetForm();
  }

  closeFromBackdrop(event: MouseEvent): void {
    // Solo cierra si el clic fue sobre el fondo, no dentro de la tarjeta del modal.
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  goToStep(step: WizardStepValue): void {
    // No permite saltar a pasos futuros si los anteriores están incompletos.
    if (this.wasPublished()) {
      return;
    }

    if (step === 1 || step < this.currentStep() || this.canReachStep(step)) {
      this.currentStep.set(step);
      this.feedback.set('');
      this.hasSubmitError.set(false);
      this.showErrors.set(false);
    }
  }

  nextStep(): void {
    // Activa mensajes de error si el usuario intenta avanzar sin completar campos.
    this.showErrors.set(true);

    if (this.currentStep() === 1) {
      if (!this.stepOneComplete()) {
        this.feedback.set('Completa la información básica para continuar.');
        return;
      }

      this.currentStep.set(2);
    } else if (this.currentStep() === 2) {
      if (!this.stepTwoComplete()) {
        this.feedback.set('Completa la descripción y el recurso para continuar.');
        return;
      }

      this.currentStep.set(3);
    }

    this.feedback.set('');
    this.hasSubmitError.set(false);
    this.showErrors.set(false);
  }

  previousStep(): void {
    // Volver no borra datos; solo cambia el paso visible.
    const step = this.currentStep();

    if (step > 1) {
      this.currentStep.set((step - 1) as WizardStepValue);
      this.feedback.set('');
      this.hasSubmitError.set(false);
      this.showErrors.set(false);
    }
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

  updateMaterialReference(target: EventTarget | null): void {
    this.materialReference.set(this.getTextValue(target));
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
    // Al cambiar formato, se limpia el recurso anterior para evitar datos incoherentes.
    const select = target as HTMLSelectElement | null;
    this.format.set((select?.value as ResourceFormat | undefined) ?? 'PDF');
    this.feedback.set('');
    this.hasSubmitError.set(false);
    this.resourceLink.set('');
    this.fileName.set('');
    this.selectedFile.set(null);
    this.clearNativeFileInput();
    this.resetDetectedMetadata();
    this.materialReference.set('');
  }

  async updateFile(target: EventTarget | null): Promise<void> {
    const input = target as HTMLInputElement | null;
    const files = input?.files ?? null;
    this.resetDetectedMetadata();

    if (!files || files.length === 0) {
      this.fileName.set('');
      this.selectedFile.set(null);
      return;
    }

    const file = files.item(0);
    this.selectedFile.set(file);
    this.fileName.set(file?.name ?? '');

    const selectedFormat = this.format();

    if (selectedFormat !== 'PDF' && selectedFormat !== 'Imagen') {
      return;
    }

    this.metadataFeedback.set('Analizando archivo...');
    const metadata = await this.resourceMetadata.detectFromFiles(files, selectedFormat);

    this.detectedPages.set(metadata.pages ?? null);
    this.detectedImageCount.set(metadata.imageCount ?? null);
    this.metadataFeedback.set(this.detectedMetadataLabel() || 'No se pudo detectar metadata del archivo.');
  }

  submit(event: Event): void {
    event.preventDefault();
    this.feedback.set('');
    this.hasSubmitError.set(false);
    this.showErrors.set(true);

    if (!this.canSubmit()) {
      this.feedback.set('Revisa los requisitos pendientes antes de publicar.');
      return;
    }

    this.isSubmitting.set(true);
    this.resourceApi
      .create(this.buildCreateRequest(), this.selectedFile())
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.wasPublished.set(true);
          this.feedback.set('Recurso enviado correctamente y pendiente de revisión.');
        },
        error: (error: HttpErrorResponse) => {
          this.hasSubmitError.set(true);
          this.feedback.set(this.getSubmitErrorMessage(error));
        },
      });
  }

  resetForm(): void {
    // Devuelve el modal a su estado inicial.
    this.currentStep.set(1);
    this.title.set('');
    this.description.set('');
    this.resourceType.set('Guía');
    this.subject.set('');
    this.level.set('Secundaria');
    this.author.set('');
    this.format.set('PDF');
    this.resourceLink.set('');
    this.fileName.set('');
    this.selectedFile.set(null);
    this.clearNativeFileInput();
    this.resetDetectedMetadata();
    this.materialReference.set('');
    this.hasPermission.set(false);
    this.isSubmitting.set(false);
    this.wasPublished.set(false);
    this.feedback.set('');
    this.hasSubmitError.set(false);
    this.showErrors.set(false);
  }

  isStepComplete(step: WizardStepValue): boolean {
    // Usado por las tarjetas superiores para marcar pasos completos.
    if (step === 1) {
      return this.stepOneComplete();
    }

    if (step === 2) {
      return this.stepTwoComplete();
    }

    return this.hasPermission();
  }

  getStepClasses(step: WizardStepValue): string {
    // Clases visuales de las tarjetas Paso 1, Paso 2 y Paso 3.
    const base =
      'wizard-step group flex min-w-0 flex-1 items-center gap-3 rounded-2xl border px-3.5 py-2.5 text-left transition-all duration-300';

    if (step === this.currentStep()) {
      return `${base} border-main-200 bg-gradient-to-br from-main-50 to-emerald-50 text-main-950 shadow-[0_10px_24px_rgba(13,148,136,0.12)] ring-1 ring-main-100`;
    }

    if (this.isStepComplete(step)) {
      return `${base} border-emerald-100 bg-white text-emerald-900 shadow-sm hover:border-emerald-200 hover:bg-emerald-50/70`;
    }

    return `${base} border-slate-100 bg-white text-slate-600 shadow-sm hover:border-main-100 hover:bg-slate-50 hover:text-slate-900`;
  }

  getStepMarkerClasses(step: WizardStepValue): string {
    // Clases del número/check dentro de cada tarjeta de paso.
    const base =
      'grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-semibold transition-all duration-300';

    if (step === this.currentStep()) {
      return `${base} bg-main-600 text-white shadow-lg shadow-main-600/25 group-hover:scale-105`;
    }

    if (this.isStepComplete(step)) {
      return `${base} bg-emerald-600 text-white shadow-md shadow-emerald-600/15`;
    }

    return `${base} bg-slate-100 text-slate-500 group-hover:bg-main-50 group-hover:text-main-700`;
  }

  getFieldClasses(hasError: boolean): string {
    // Aplica borde rojo cuando el campo tiene error.
    const base =
      'mt-1.5 w-full rounded-2xl border bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4';
    return hasError
      ? `${base} border-red-300 focus:border-red-400 focus:ring-red-100`
      : `${base} border-slate-200 focus:border-main-400 focus:ring-main-100`;
  }

  getResourceTypeBadgeClasses(type: ResourceType): string {
    // Color del badge según categoría del recurso.
    const base = 'rounded-full px-3 py-1 text-xs font-semibold ring-1 ';
    const classes: Record<ResourceType, string> = {
      Libro: 'bg-rose-50 text-rose-700 ring-rose-100',
      Apuntes: 'bg-amber-50 text-amber-700 ring-amber-100',
      Guía: 'bg-blue-50 text-blue-700 ring-blue-100',
      Ejercicios: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
      Diapositivas: 'bg-purple-50 text-purple-700 ring-purple-100',
      Examen: 'bg-red-50 text-red-700 ring-red-100',
    };

    return base + classes[type];
  }

  getFormatBadgeClasses(format: ResourceFormat): string {
    // Color del badge según formato del recurso.
    const base = 'rounded-full px-3 py-1 text-xs font-semibold ring-1 ';
    const classes: Record<ResourceFormat, string> = {
      PDF: 'bg-red-600 text-white ring-red-500/30',
      Imagen: 'bg-cyan-600 text-white ring-cyan-500/30',
      Documento: 'bg-slate-700 text-white ring-slate-500/30',
      Enlace: 'bg-main-600 text-white ring-main-500/30',
      'Material físico': 'bg-orange-500 text-white ring-orange-400/30',
    };

    return base + classes[format];
  }

  private canReachStep(step: WizardStepValue): boolean {
    // Regla para bloquear navegación hacia pasos todavía no habilitados.
    if (step === 2) {
      return this.stepOneComplete();
    }

    if (step === 3) {
      return this.stepOneComplete() && this.stepTwoComplete();
    }

    return true;
  }

  private isValidLink(value: string): boolean {
    return /^https?:\/\/.+\..+/.test(value.trim());
  }

  private resetDetectedMetadata(): void {
    this.detectedPages.set(null);
    this.detectedImageCount.set(null);
    this.metadataFeedback.set('');
  }

  private clearNativeFileInput(): void {
    // El navegador no permite limpiar un input file con data binding; esta es la única
    // manipulación imperativa y se mantiene encapsulada mediante la query de Angular.
    const input = this.resourceFileInput()?.nativeElement;
    if (input) {
      input.value = '';
    }
  }

  private getTextValue(target: EventTarget | null): string {
    // Helper para leer valores de input/textarea sin usar any.
    const input = target as HTMLInputElement | HTMLTextAreaElement | null;
    return input?.value ?? '';
  }

  private buildCreateRequest(): ResourceCreateRequest {
    const resourceTypes: Record<ResourceType, ApiResourceType> = {
      Libro: 'book',
      Apuntes: 'notes',
      Guía: 'guide',
      Ejercicios: 'exercises',
      Diapositivas: 'slides',
      Examen: 'exam',
    };
    const levels: Record<EducationLevel, ApiEducationLevel> = {
      Primaria: 'primary',
      Secundaria: 'secondary',
      Preuniversitario: 'preuniversity',
      Universitario: 'university',
    };
    const formats: Record<ResourceFormat, ApiResourceFormat> = {
      PDF: 'pdf',
      Imagen: 'image',
      Documento: 'document',
      Enlace: 'link',
      'Material físico': 'physical',
    };

    const request: ResourceCreateRequest = {
      title: this.title().trim(),
      description: this.description().trim(),
      resource_type: resourceTypes[this.resourceType()],
      subject: this.subject().trim(),
      education_level: levels[this.level()],
      format: formats[this.format()],
      author: this.author().trim(),
      permission_declared: this.hasPermission(),
    };
    if (this.requiresLink()) {
      request.external_url = this.resourceLink().trim();
    }
    if (this.isPhysicalMaterial()) {
      request.material_reference = this.materialReference().trim();
    }
    const pages = this.detectedPages();
    const images = this.detectedImageCount();
    if (pages !== null) {
      request.page_count = pages;
    }
    if (images !== null) {
      request.image_count = images;
    }
    return request;
  }

  private getSubmitErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Verifica que FastAPI esté encendido.';
    }
    if (error.status === 401) {
      return 'Tu sesión venció. Inicia sesión nuevamente para publicar.';
    }
    if (typeof error.error?.detail === 'string') {
      return error.error.detail;
    }
    return 'No se pudo publicar el recurso. Revisa los datos e inténtalo nuevamente.';
  }
}
