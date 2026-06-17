import { Injectable } from '@angular/core';

export type DetectableResourceFormat = 'PDF' | 'Imagen';

export interface ResourceFileMetadata {
  pages?: number;
  imageCount?: number;
}

// Servicio para detectar metadatos de archivos PDF e imágenes seleccionados por el usuario al crear un recurso.
@Injectable({ providedIn: 'root' })
export class ResourceMetadataService {
  async detectFromFiles(
    files: FileList | readonly File[] | null,
    format: DetectableResourceFormat,
  ): Promise<ResourceFileMetadata> {
    const selectedFiles = Array.from(files ?? []);

    if (selectedFiles.length === 0) {
      return {};
    }

    if (format === 'Imagen') {
      return {
        imageCount: selectedFiles.filter((file) => this.isImageFile(file)).length,
      };
    }

    const pdfFile = selectedFiles.find((file) => this.isPdfFile(file));

    if (!pdfFile) {
      return {};
    }

    return {
      pages: this.countPdfPages(await pdfFile.arrayBuffer()),
    };
  }

  private countPdfPages(buffer: ArrayBuffer): number {
    const content = new TextDecoder('latin1').decode(buffer);
    const pageMatches = content.match(/\/Type\s*\/Page\b/g);

    if (pageMatches?.length) {
      return pageMatches.length;
    }

    const countMatches = [...content.matchAll(/\/Count\s+(\d+)/g)]
      .map((match) => Number(match[1]))
      .filter((count) => Number.isFinite(count) && count > 0);

    return countMatches.length > 0 ? Math.max(...countMatches) : 0;
  }

  private isPdfFile(file: File): boolean {
    return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  }

  private isImageFile(file: File): boolean {
    return file.type.startsWith('image/') || /\.(apng|avif|gif|jpe?g|png|webp)$/i.test(file.name);
  }
}
