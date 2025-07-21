import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-export-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './export-modal.html',
  styleUrls: ['./export-modal.scss']
})
export class ExportModal {
  @Input() isOpen: boolean = false;
  @Output() closed = new EventEmitter<void>();
  @Output() exported = new EventEmitter<any>();

  selectedExportType: string = 'students';
  selectedFormat: string = 'pdf';
  startDate: string = '';
  endDate: string = '';
  includeInactive: boolean = false;
  includeStats: boolean = true;
  isExporting: boolean = false;
  exportProgress: number = 0;

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }

  onExport() {
    if (!this.selectedExportType || !this.selectedFormat) {
      return;
    }

    this.isExporting = true;
    this.exportProgress = 0;

    // Simulate export progress
    const progressInterval = setInterval(() => {
      this.exportProgress += 10;
      if (this.exportProgress >= 100) {
        clearInterval(progressInterval);
        this.isExporting = false;
        this.exported.emit({
          type: this.selectedExportType,
          format: this.selectedFormat,
          startDate: this.startDate,
          endDate: this.endDate,
          includeInactive: this.includeInactive,
          includeStats: this.includeStats
        });
        this.onCancel();
      }
    }, 100);
  }

  onCancel() {
    this.isOpen = false;
    this.closed.emit();
  }
}
