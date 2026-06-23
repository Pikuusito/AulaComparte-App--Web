import { NgClass } from '@angular/common';
import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiResourceType } from '../../../../shared/models/resource-api.model';
import { ResourceItem, ResourceType } from '../../../../shared/models/resource.model';
import { ResourceLibraryService } from '../../../../shared/services/resource-library.service';
import { PanelScrollService } from '../../services/panel-scroll.service';

interface Category {
  label: string;
  apiType?: ApiResourceType;
}

const VISIBLE_SEARCH_RESULTS = 4;

@Component({
  selector: 'app-resource-search',
  standalone: true,
  imports: [NgClass, RouterLink],
  templateUrl: './resource-search.html',
  styleUrl: './resource-search.css',
})
export class ResourceSearchComponent implements OnDestroy {
  private readonly resourceLibrary = inject(ResourceLibraryService);
  private readonly panelScroll = inject(PanelScrollService);
  private searchAnimationId: ReturnType<typeof setTimeout> | undefined;

  readonly categories = signal<Category[]>([
    { label: 'Todos' },
    { label: 'Libros', apiType: 'book' },
    { label: 'Apuntes', apiType: 'notes' },
    { label: 'Guías', apiType: 'guide' },
    { label: 'Diapositivas', apiType: 'slides' },
    { label: 'Ejercicios', apiType: 'exercises' },
    { label: 'Exámenes', apiType: 'exam' },
  ]);
  readonly selectedCategory = signal<string>('Todos');
  readonly searchInput = signal<string>('');
  readonly searchQuery = signal<string>('');
  readonly hasSearched = signal<boolean>(false);
  readonly isSearchingAnimation = signal<boolean>(false);
  readonly isResultsModalOpen = signal<boolean>(false);
  readonly results = this.resourceLibrary.searchResults;
  readonly isSearching = this.resourceLibrary.isSearchLoading;
  readonly searchError = this.resourceLibrary.searchError;
  readonly reportFeedback = this.resourceLibrary.reportFeedback;
  readonly reportError = this.resourceLibrary.reportError;
  readonly reportingIds = this.resourceLibrary.reportingIds;
  readonly visibleResults = computed(() => this.results().slice(0, VISIBLE_SEARCH_RESULTS));
  readonly hiddenResultsCount = computed(() => Math.max(0, this.results().length - VISIBLE_SEARCH_RESULTS));
  readonly hasMoreResults = computed(() => this.hiddenResultsCount() > 0);
  readonly selectedCategoryType = computed(() =>
    this.categories().find((category) => category.label === this.selectedCategory())?.apiType,
  );

  ngOnDestroy(): void {
    if (this.searchAnimationId) {
      clearTimeout(this.searchAnimationId);
    }
  }

  selectCategory(category: Category): void {
    this.selectedCategory.set(category.label);

    if (this.hasSearched()) {
      this.closeResultsModal();
      this.runSearch();
    }
  }

  updateSearchInput(event: Event): void {
    const value = this.getInputValue(event);
    this.searchInput.set(value);

    if (!value) {
      this.clearSearch();
    }
  }

  submitSearch(event?: Event): void {
    event?.preventDefault();
    this.closeResultsModal();
    this.runSearch();
  }

  retrySearch(): void {
    this.runSearch();
  }

  openResultsModal(): void {
    if (this.hasMoreResults()) {
      this.isResultsModalOpen.set(true);
    }
  }

  closeResultsModal(): void {
    this.isResultsModalOpen.set(false);
  }

  toggleSave(resourceId: number): void {
    this.resourceLibrary.toggleSave(resourceId);
  }

  openReportDialog(resource: ResourceItem): void {
    this.resourceLibrary.openReportDialog(resource);
  }

  rememberPanelScroll(): void {
    this.panelScroll.saveCurrentPosition();
  }

  getCategoryClasses(label: string, active: boolean): string {
    const base = 'rounded-xl px-5 py-2.5 text-sm font-bold cursor-pointer transition-all duration-300 border flex items-center gap-2 shadow-sm ';

    if (!active) {
      const inactiveMap: Record<string, string> = {
        Todos: 'bg-white text-slate-600 border-slate-200 hover:border-main-300 hover:text-main-600 hover:bg-main-50',
        Libros: 'bg-white text-slate-600 border-slate-200 hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50',
        Apuntes: 'bg-white text-slate-600 border-slate-200 hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50',
        Guías: 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50',
        Diapositivas: 'bg-white text-slate-600 border-slate-200 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50',
        Ejercicios: 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50',
        Exámenes: 'bg-white text-slate-600 border-slate-200 hover:border-red-300 hover:text-red-600 hover:bg-red-50',
      };
      return base + (inactiveMap[label] || inactiveMap['Todos']);
    }

    const activeMap: Record<string, string> = {
      Todos: 'bg-main-600 text-white border-main-600 shadow-main-600/30 scale-105',
      Libros: 'bg-rose-500 text-white border-rose-500 shadow-rose-500/30 scale-105',
      Apuntes: 'bg-amber-500 text-white border-amber-500 shadow-amber-500/30 scale-105',
      Guías: 'bg-blue-500 text-white border-blue-500 shadow-blue-500/30 scale-105',
      Diapositivas: 'bg-purple-500 text-white border-purple-500 shadow-purple-500/30 scale-105',
      Ejercicios: 'bg-emerald-500 text-white border-emerald-500 shadow-emerald-500/30 scale-105',
      Exámenes: 'bg-red-500 text-white border-red-500 shadow-red-500/30 scale-105',
    };
    return base + (activeMap[label] || activeMap['Todos']);
  }

  getTypeBadgeClasses(type: ResourceItem['type']): string {
    const classes: Record<ResourceType, string> = {
      Guía: 'bg-blue-100 text-blue-700 border-blue-200',
      Apuntes: 'bg-amber-100 text-amber-700 border-amber-200',
      Libro: 'bg-rose-100 text-rose-700 border-rose-200',
      Ejercicios: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      Diapositivas: 'bg-purple-100 text-purple-700 border-purple-200',
      Examen: 'bg-red-100 text-red-700 border-red-200',
      Investigación: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    };

    return classes[type];
  }

  private runSearch(): void {
    const query = this.searchInput().trim();

    if (!query) {
      this.clearSearch();
      return;
    }

    this.searchQuery.set(query);
    this.hasSearched.set(true);
    this.playSearchAnimation();
    this.resourceLibrary.searchCatalog(query, this.selectedCategoryType());
  }

  private clearSearch(): void {
    this.searchQuery.set('');
    this.hasSearched.set(false);
    this.closeResultsModal();
    this.selectedCategory.set('Todos');
    this.isSearchingAnimation.set(false);
    this.resourceLibrary.clearSearch();
  }

  private getInputValue(event: Event): string {
    return event.target instanceof HTMLInputElement ? event.target.value.trim() : '';
  }

  private playSearchAnimation(): void {
    if (this.searchAnimationId) {
      clearTimeout(this.searchAnimationId);
    }

    this.isSearchingAnimation.set(true);
    this.searchAnimationId = setTimeout(() => this.isSearchingAnimation.set(false), 520);
  }
}
