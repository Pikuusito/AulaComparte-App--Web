import { Component, inject } from '@angular/core';
import { ResourceLibraryService } from '../../../../shared/services/resource-library.service';

@Component({
  selector: 'app-report-resource-modal',
  standalone: true,
  templateUrl: './report-resource-modal.html',
  styleUrl: './report-resource-modal.css',
})
export class ReportResourceModalComponent {
  private readonly resourceLibrary = inject(ResourceLibraryService);

  readonly selectedReportResource = this.resourceLibrary.selectedReportResource;
  readonly reportReason = this.resourceLibrary.reportReason;
  readonly reportReasonError = this.resourceLibrary.reportReasonError;
  readonly reportingIds = this.resourceLibrary.reportingIds;
  readonly canSubmitReport = this.resourceLibrary.canSubmitReport;

  close(): void {
    this.resourceLibrary.closeReportDialog();
  }

  closeFromBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  updateReportReason(event: Event): void {
    const reason = event.target instanceof HTMLTextAreaElement ? event.target.value : '';
    this.resourceLibrary.updateReportReason(reason);
  }

  submitReport(): void {
    this.resourceLibrary.submitReport();
  }
}
