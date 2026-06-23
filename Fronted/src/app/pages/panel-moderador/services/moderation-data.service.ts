import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import {
  ApiEducationLevel,
  ApiResource,
  ApiResourceFormat,
  ApiResourceStatus,
  ApiResourceType,
} from '../../../shared/models/resource-api.model';
import { ResourceLibraryService } from '../../../shared/services/resource-library.service';
import { ResourceApiService } from '../../../shared/services/resource-api.service';
import {
  ModerationDailyWorkStats,
  ModerationFeedback,
  ModerationResource,
  ModerationResourceFormat,
  ModerationResourceType,
  ModerationStats,
} from '../models/moderation.model';

const API_BASE_URL = 'http://localhost:8000/';
const DAILY_WORK_STATS_STORAGE_KEY = 'aulacomparte:moderation-daily-work-stats';

@Injectable({ providedIn: 'root' })
export class ModerationDataService {
  private readonly resourceApi = inject(ResourceApiService);
  private readonly resourceLibrary = inject(ResourceLibraryService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly resourcesState = signal<ModerationResource[]>([]);
  private readonly dailyWorkStats = signal<ModerationDailyWorkStats>({
    date: this.getTodayKey(),
    approvedToday: 0,
    rejectedToday: 0,
  });

  readonly isLoading = signal(false);
  readonly loadError = signal('');
  readonly isModerating = signal(false);
  readonly feedback = signal<ModerationFeedback | null>(null);
  readonly resources = computed(() => this.resourcesState());
  readonly reviewableResources = computed(() => this.resourcesState());
  readonly selectedResource = signal<ModerationResource | null>(null);
  readonly moderatorComment = signal('');
  readonly dailyResetLabel = 'Los contadores de trabajo se reinician automáticamente a las 00:00.';
  private feedbackTimeout: ReturnType<typeof setTimeout> | null = null;
  private dailyResetTimeout: ReturnType<typeof setTimeout> | null = null;

  readonly stats = computed<ModerationStats>(() => {
    const resources = this.resourcesState();
    const dailyWorkStats = this.dailyWorkStats();

    return {
      pending: resources.filter((resource) => resource.status === 'Pendiente').length,
      approvedToday: dailyWorkStats.approvedToday,
      rejected: dailyWorkStats.rejectedToday,
      reports: resources.filter((resource) => resource.status === 'Reportado').length,
    };
  });

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.restoreDailyWorkStats();
      this.scheduleDailyStatsReset();
      this.loadPendingResources();
    }
  }

  loadPendingResources(): void {
    this.isLoading.set(true);
    this.loadError.set('');

    this.resourceApi
      .loadPending()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (resources) => {
          this.resourcesState.set(resources.map((resource) => this.mapResource(resource)));
          this.syncSelectedResource();
        },
        error: (error: HttpErrorResponse) => {
          this.loadError.set(this.resolveErrorMessage(error));
        },
      });
  }

  approveResource(resourceId: number): void {
    this.updateResourceStatus(resourceId, 'approved', this.moderatorComment().trim());
  }

  rejectResource(resourceId: number): void {
    this.updateResourceStatus(resourceId, 'rejected', this.moderatorComment().trim());
  }

  openResourceDetails(resourceId: number): void {
    this.selectedResource.set(
      this.resourcesState().find((resource) => resource.id === resourceId) ?? null,
    );
  }

  closeResourceDetails(): void {
    this.selectedResource.set(null);
    this.moderatorComment.set('');
  }

  updateModeratorComment(comment: string): void {
    this.moderatorComment.set(comment);
  }

  dismissFeedback(): void {
    this.feedback.set(null);

    if (this.feedbackTimeout) {
      clearTimeout(this.feedbackTimeout);
      this.feedbackTimeout = null;
    }
  }

  private updateResourceStatus(resourceId: number, status: ApiResourceStatus, moderatorComment?: string): void {
    this.isModerating.set(true);
    this.loadError.set('');

    this.resourceApi
      .updateStatus(resourceId, status, moderatorComment)
      .pipe(finalize(() => this.isModerating.set(false)))
      .subscribe({
        next: () => {
          const resource = this.resourcesState().find((item) => item.id === resourceId);

          this.resourcesState.update((resources) =>
            resources.filter((resource) => resource.id !== resourceId),
          );
          this.closeResourceDetails();
          this.registerDailyWork(status);
          this.showFeedback(resource, status);

          if (status === 'approved') {
            this.resourceLibrary.loadCatalog();
          }
        },
        error: (error: HttpErrorResponse) => {
          this.loadError.set(this.resolveErrorMessage(error));
        },
      });
  }

  private showFeedback(resource: ModerationResource | undefined, status: ApiResourceStatus): void {
    if (status === 'approved') {
      this.setFeedback({
        kind: 'approved',
        title: 'Material aprobado',
        message: `${resource?.title ?? 'El recurso'} ya está disponible para los estudiantes.`,
      });
      return;
    }

    this.setFeedback({
      kind: 'rejected',
      title: 'Material rechazado',
      message: `${resource?.title ?? 'El recurso'} fue retirado de la cola de revisión.`,
    });
  }

  private setFeedback(feedback: ModerationFeedback): void {
    this.feedback.set(feedback);

    if (this.feedbackTimeout) {
      clearTimeout(this.feedbackTimeout);
    }

    this.feedbackTimeout = setTimeout(() => this.feedback.set(null), 3_500);
  }

  private registerDailyWork(status: ApiResourceStatus): void {
    const today = this.getTodayKey();

    this.dailyWorkStats.update((stats) => {
      const currentStats = stats.date === today
        ? stats
        : { date: today, approvedToday: 0, rejectedToday: 0 };

      if (status === 'approved') {
        return {
          ...currentStats,
          approvedToday: currentStats.approvedToday + 1,
        };
      }

      if (status === 'rejected') {
        return {
          ...currentStats,
          rejectedToday: currentStats.rejectedToday + 1,
        };
      }

      return currentStats;
    });

    this.persistDailyWorkStats();
  }

  private restoreDailyWorkStats(): void {
    const storedStats = this.readStoredDailyWorkStats();
    const today = this.getTodayKey();

    if (!storedStats || storedStats.date !== today) {
      this.resetDailyWorkStats(today);
      return;
    }

    this.dailyWorkStats.set(storedStats);
  }

  private resetDailyWorkStats(date = this.getTodayKey()): void {
    this.dailyWorkStats.set({
      date,
      approvedToday: 0,
      rejectedToday: 0,
    });
    this.persistDailyWorkStats();
  }

  private scheduleDailyStatsReset(): void {
    if (this.dailyResetTimeout) {
      clearTimeout(this.dailyResetTimeout);
    }

    this.dailyResetTimeout = setTimeout(() => {
      this.resetDailyWorkStats();
      this.scheduleDailyStatsReset();
    }, this.getMillisecondsUntilNextMidnight());
  }

  private persistDailyWorkStats(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    globalThis.localStorage?.setItem(
      DAILY_WORK_STATS_STORAGE_KEY,
      JSON.stringify(this.dailyWorkStats()),
    );
  }

  private readStoredDailyWorkStats(): ModerationDailyWorkStats | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const rawValue = globalThis.localStorage?.getItem(DAILY_WORK_STATS_STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    try {
      const parsedValue: unknown = JSON.parse(rawValue);

      if (!this.isModerationDailyWorkStats(parsedValue)) {
        return null;
      }

      return parsedValue;
    } catch {
      return null;
    }
  }

  private isModerationDailyWorkStats(value: unknown): value is ModerationDailyWorkStats {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    const candidate = value as Partial<ModerationDailyWorkStats>;

    return (
      typeof candidate.date === 'string' &&
      typeof candidate.approvedToday === 'number' &&
      Number.isInteger(candidate.approvedToday) &&
      candidate.approvedToday >= 0 &&
      typeof candidate.rejectedToday === 'number' &&
      Number.isInteger(candidate.rejectedToday) &&
      candidate.rejectedToday >= 0
    );
  }

  private getTodayKey(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private getMillisecondsUntilNextMidnight(): number {
    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setHours(24, 0, 0, 0);

    return Math.max(1_000, nextMidnight.getTime() - now.getTime());
  }

  private syncSelectedResource(): void {
    const selected = this.selectedResource();

    if (!selected) {
      return;
    }

    this.selectedResource.set(
      this.resourcesState().find((resource) => resource.id === selected.id) ?? null,
    );
  }

  private mapResource(resource: ApiResource): ModerationResource {
    return {
      id: resource.id,
      title: resource.title,
      description: resource.description,
      type: this.mapType(resource.resource_type),
      format: this.mapFormat(resource.format),
      subject: resource.subject,
      level: this.mapLevel(resource.education_level),
      author: resource.author,
      submittedAgo: this.formatElapsedTime(resource.created_at),
      fileSize: this.resolveFileSize(resource),
      status: resource.status === 'reported' ? 'Reportado' : 'Pendiente',
      risk: resource.permission_declared ? 'Bajo' : 'Medio',
      permissionDeclared: resource.permission_declared,
      reportReason: resource.report_reason ?? undefined,
      sourceNote: this.resolveSourceNote(resource),
      sourceUrl: this.resolveSourceUrl(resource),
    };
  }

  private mapType(type: ApiResourceType): ModerationResourceType {
    const types: Record<ApiResourceType, ModerationResourceType> = {
      book: 'Libro',
      notes: 'Apuntes',
      guide: 'Guía',
      exercises: 'Ejercicios',
      slides: 'Diapositivas',
      exam: 'Examen',
    };

    return types[type];
  }

  private mapFormat(format: ApiResourceFormat): ModerationResourceFormat {
    const formats: Record<ApiResourceFormat, ModerationResourceFormat> = {
      pdf: 'PDF',
      image: 'Imagen',
      document: 'Documento',
      link: 'Enlace',
      physical: 'Material físico',
    };

    return formats[format];
  }

  private mapLevel(level: ApiEducationLevel): string {
    const levels: Record<ApiEducationLevel, string> = {
      primary: 'Primaria',
      secondary: 'Secundaria',
      preuniversity: 'Preuniversitario',
      university: 'Universitario',
    };

    return levels[level];
  }

  private resolveFileSize(resource: ApiResource): string {
    if (resource.format === 'link') {
      return 'Enlace externo';
    }

    if (resource.format === 'physical') {
      return 'Referencia física';
    }

    return 'Archivo adjunto';
  }

  private resolveSourceNote(resource: ApiResource): string {
    if (resource.external_url) {
      return resource.external_url;
    }

    if (resource.material_reference) {
      return resource.material_reference;
    }

    return resource.file_path ? 'Archivo guardado en el volumen de Docker' : 'Sin fuente declarada';
  }

  private resolveSourceUrl(resource: ApiResource): string {
    if (resource.external_url) {
      return resource.external_url;
    }

    if (resource.file_path) {
      return `${API_BASE_URL}${resource.file_path}`;
    }

    return '';
  }

  private formatElapsedTime(value: string): string {
    const createdAt = new Date(value).getTime();
    const elapsedMs = Date.now() - createdAt;
    const elapsedMinutes = Math.max(1, Math.floor(elapsedMs / 60_000));

    if (elapsedMinutes < 60) {
      return `${elapsedMinutes} min`;
    }

    const elapsedHours = Math.floor(elapsedMinutes / 60);

    if (elapsedHours < 24) {
      return `${elapsedHours} h`;
    }

    const elapsedDays = Math.floor(elapsedHours / 24);
    return `${elapsedDays} d`;
  }

  private resolveErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 401 || error.status === 403) {
      return 'Tu sesión de moderador no tiene permiso para revisar estos recursos.';
    }

    if (error.status === 0) {
      return 'No se pudo conectar con el backend. Revisa que Docker y la API estén encendidos.';
    }

    return 'No se pudo cargar o actualizar la cola de moderación. Intenta nuevamente.';
  }
}
